// src/user/MapBrowseExact/MapBrowseExact.jsx
import React, { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

/* ===== 색 토큰 ===== */
const C = {
  line: "#E7EDF5",
  blue: "#0C7AE9",
  blueLine: "#0073E6",
  text: "#0F172A",
};

/* ===== 개발 모드 전용 안전 로거 ===== */
const logDev = (...args) => {
  if (import.meta.env?.DEV) {
    // eslint-disable-next-line no-console
    console.error(...args);
  }
};

/* ===== 포맷 유틸 ===== */
const comma = (n) => (typeof n === "number" ? n.toLocaleString() : "");
const priceText = (deposit, monthly) => {
  const d = typeof deposit === "number" && deposit > 0 ? comma(deposit) : null;
  const m = typeof monthly === "number" && monthly > 0 ? comma(monthly) : null;
  if (m) return `월세 ${d ?? 0}/${m}`;
  if (d) return `전세 ${d}`;
  return "가격 정보 없음";
};
const specText = (sqm, fee) => {
  const a = typeof sqm === "number" && sqm > 0 ? `${sqm}㎡` : null;
  const b = typeof fee === "number" && fee >= 0 ? `관리비 ${comma(fee)}만원` : null;
  return [a, b].filter(Boolean).join(", ");
};

/** 마커 배치에 쓸 상대 오프셋(지도의 중심 기준) */
const OFFSETS = [
  [0.0018, -0.0012],
  [-0.0016, 0.001],
  [0.0022, 0.0006],
  [-0.002, -0.0008],
];

/* ===== 더미 데이터(구름스퀘어 강남 주변 4개) =====
   - 지도 좌표는 center 기준 상대값 off 로 제어
   - 금액 단위: 만원
*/
const DUMMIES = [
  {
    name: "구름스퀘어 레지던스",
    addr: "서울 강남구 역삼로 180",
    monthly: 120,
    deposit: 3000,
    area: 56,
    fee: 7,
    score: 4.7,
    checkId: 101,
    off: OFFSETS[0],
  },
  {
    name: "테헤란로 스테이",
    addr: "서울 강남구 테헤란로 322",
    monthly: 65,
    deposit: 1000,
    area: 33,
    fee: 5,
    score: 4.6,
    checkId: 102,
    off: OFFSETS[1],
  },
  {
    name: "강남 센트럴하임",
    addr: "서울 강남구 논현로 508",
    monthly: 0,
    deposit: 32000, // 전세 3억2천
    area: 59,
    fee: 6,
    score: 4.7,
    checkId: 103,
    off: OFFSETS[2],
  },
  {
    name: "역삼 프라임빌",
    addr: "서울 강남구 테헤란로 311",
    monthly: 120,
    deposit: 3000,
    area: 56,
    fee: 7,
    score: 4.7,
    checkId: 104,
    off: OFFSETS[3],
  },
];

/* 칩 공통 스타일 */
const chipBase = {
  border: `1px solid #E6EBF3`,
  background: "#FFFFFF",
  color: "#0F172A",
  borderRadius: 999,
  padding: "9px 11px",
  fontSize: 12,
  fontWeight: 700,
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  whiteSpace: "nowrap",
  cursor: "pointer",
};
const chipActive = {
  ...chipBase,
  background: C.blue,
  border: `1px solid ${C.blueLine}`,
  color: "#FFFFFF",
};
const ctrlBtn = {
  width: 40,
  height: 40,
  borderRadius: 12,
  border: "1px solid #E7EDF5",
  background: "#fff",
  fontSize: 18,
  boxShadow: "0 2px 8px rgba(0,0,0,.08)",
  cursor: "pointer",
};

export default function MapBrowseExact() {
  const mapEl = useRef(null);
  const mapRef = useRef(null);
  const myMarkerRef = useRef(null);
  const clustererRef = useRef(null);
  const geocoderRef = useRef(null);

  const currentOverlayRef = useRef(null); // { overlay, marker }
  const selectedMarkerRef = useRef(null);

  const [status, setStatus] = useState("현재 위치 파악 중…");
  const [locationLabel, setLocationLabel] = useState("위치 가져오는 중…");

  // ===== 필터 상태 =====
  const [roomTypeSheetOpen, setRoomTypeSheetOpen] = useState(false);
  const ROOM_TYPE_OPTIONS = ["원룸", "투룸", "3개이상"];
  const [roomType, setRoomType] = useState(null); // UI 라벨만

  const [txTypeSheetOpen, setTxTypeSheetOpen] = useState(false);
  const TX_OPTIONS = ["월세", "전세"];
  const [txType, setTxType] = useState(null); // null=전체, "월세" | "전세"

  // 표시용 방 목록 (필터 적용 후)
  const [rooms, setRooms] = useState([]);

  // 하단 카드(캐러셀)
  const [showCards, setShowCards] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const carouselRef = useRef(null);
  const cardRefs = useRef([]);

  const navigate = useNavigate();

  // 위치 실패시 기본(신촌/홍대)
  const FALLBACK = { lat: 37.5563, lng: 126.9368 };

  /* ---------- Kakao marker dot(●) ---------- */
  const getDotImage = () => {
    const { kakao } = window;
    const DOT_SVG =
      "data:image/svg+xml;utf8," +
      '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">' +
      '<circle cx="9" cy="9" r="6" fill="%230C7AE9" stroke="white" stroke-width="3"/></svg>';
    return new kakao.maps.MarkerImage(
      DOT_SVG,
      new kakao.maps.Size(18, 18),
      { offset: new kakao.maps.Point(9, 9) }
    );
  };

  /* ---------- 공통 유틸 ---------- */
  const closeOverlay = () => {
    if (currentOverlayRef.current) {
      currentOverlayRef.current.overlay.setMap(null);
      currentOverlayRef.current = null;
    }
    const sel = selectedMarkerRef.current;
    if (sel) {
      try { sel.setImage(null); } catch (err) { logDev(err); }
      try { sel.setZIndex(0); } catch (err) { logDev(err); }
    }
    selectedMarkerRef.current = null;
  };

  /** 행정동 라벨 */
  const updateLabelFromLatLng = (ll) => {
    const geocoder = geocoderRef.current;
    if (!geocoder || !window?.kakao?.maps?.services?.Status) return;
    geocoder.coord2RegionCode(ll.getLng(), ll.getLat(), (result, s) => {
      if (s !== window.kakao.maps.services.Status.OK || !result?.length) return;
      const r = result.find((x) => x.region_type === "H") || result[0];
      const l1 = r.region_1depth_name || "";
      const l2 = r.region_2depth_name || "";
      const l3 = r.region_3depth_name || "";
      setLocationLabel([l1, l2, l3].filter(Boolean).join(" "));
    });
  };

  /** 말풍선(커스텀 오버레이) */
  const buildBubbleContent = (room) => {
    const { kakao } = window;

    const wrap = document.createElement("div");
    wrap.style.cssText = [
      "position:relative",
      "display:flex",
      "align-items:center",
      "gap:12px",
      "background:#fff",
      `border:1px solid ${C.line}`,
      "border-radius:999px",
      "padding:12px 16px",
      "box-shadow:0 10px 24px rgba(0,0,0,.18)",
      "font-family:system-ui,-apple-system,Segoe UI,Roboto,Apple SD Gothic Neo,Noto Sans KR,Helvetica,Arial,sans-serif",
      "user-select:none",
      "pointer-events:auto",
    ].join(";");

    const icon = document.createElement("div");
    icon.style.cssText =
      `width:40px;height:40px;border-radius:50%;display:grid;place-items:center;background:${C.blue};color:#fff;flex:0 0 40px`;
    icon.innerHTML =
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-4.35 7-11a7 7 0 10-14 0c0 6.65 7 11 7 11z"/><circle cx="12" cy="10" r="2.5" fill="none"/></svg>';

    const texts = document.createElement("div");
    texts.style.cssText = "display:flex;flex-direction:column;line-height:1.2";

    const title = document.createElement("div");
    title.style.cssText =
      "font-weight:800;color:#9CA3AF;margin-bottom:4px;letter-spacing:-.2px";
    title.textContent = room.name || "—";

    const price = document.createElement("div");
    price.style.cssText =
      "font-weight:900;font-size:20px;color:#0F172A;letter-spacing:-.3px";
    price.textContent = room.price || "—";

    const tailBorder = document.createElement("div");
    tailBorder.style.cssText = [
      "position:absolute",
      "left:50%",
      "bottom:-10px",
      "transform:translateX(-50%)",
      "width:0",
      "height:0",
      "border-left:12px solid transparent",
      "border-right:12px solid transparent",
      `border-top:12px solid ${C.line}`,
    ].join(";");

    const tail = document.createElement("div");
    tail.style.cssText = [
      "position:absolute",
      "left:50%",
      "bottom:-8px",
      "transform:translateX(-50%)",
      "width:0",
      "height:0",
      "border-left:10px solid transparent",
      "border-right:10px solid transparent",
      "border-top:10px solid #fff",
    ].join(";");

    const stop = () =>
      kakao?.maps?.event?.preventMap && kakao.maps.event.preventMap();
    wrap.addEventListener("mousedown", stop);
    wrap.addEventListener("touchstart", stop);

    texts.appendChild(title);
    texts.appendChild(price);
    wrap.appendChild(icon);
    wrap.appendChild(texts);
    wrap.appendChild(tailBorder);
    wrap.appendChild(tail);

    return wrap;
  };

  /** rooms[]를 지도에 표시 */
  const showRoomsAround = (centerLL, list) => {
    const { kakao } = window;
    const map = mapRef.current;
    const clusterer = clustererRef.current;
    if (!map || !clusterer || !kakao?.maps) return;

    // SDK 버전에 따라 clear/clearClusterer 공존
    if (typeof clusterer.clear === "function") clusterer.clear();
    else if (typeof clusterer.clearClusterer === "function")
      clusterer.clearClusterer();

    closeOverlay();
    setShowCards(false);
    setSelectedIndex(null);

    const dotImg = getDotImage();
    const baseLat = centerLL.getLat();
    const baseLng = centerLL.getLng();

    const markers = list.map((r, idx) => {
      const off = r.off || OFFSETS[idx % OFFSETS.length];
      const ll = new kakao.maps.LatLng(baseLat + off[0], baseLng + off[1]);

      const marker = new kakao.maps.Marker({ position: ll, title: r.name });
      const overlay = new kakao.maps.CustomOverlay({
        content: buildBubbleContent(r),
        position: ll,
        xAnchor: 0.5,
        yAnchor: 1.35,
        zIndex: 4,
        clickable: true,
      });

      kakao.maps.event.addListener(marker, "click", () => {
        const alreadyOpen = currentOverlayRef.current?.marker === marker;

        // 이전 선택 해제
        const sel = selectedMarkerRef.current;
        if (sel) {
          try { sel.setImage(null); } catch (err) { logDev(err); }
          try { sel.setZIndex(0); } catch (err) { logDev(err); }
          selectedMarkerRef.current = null;
        }

        if (alreadyOpen) {
          closeOverlay();
          setShowCards(false);
          setSelectedIndex(null);
          return;
        }

        overlay.setMap(map);
        currentOverlayRef.current = { overlay, marker };

        marker.setImage(dotImg);
        marker.setZIndex(1000);
        selectedMarkerRef.current = marker;

        setSelectedIndex(idx);
        setShowCards(true);
      });

      return marker;
    });

    clusterer.addMarkers(markers);
  };

  /** 좌표로 센터 이동/갱신 */
  const refreshAt = (lat, lng, pan = false) => {
    const { kakao } = window;
    const ll = new kakao.maps.LatLng(lat, lng);
    const map = mapRef.current, my = myMarkerRef.current;
    if (!map || !my) return;
    my.setPosition(ll);
    pan ? map.panTo(ll) : map.setCenter(ll);
    updateLabelFromLatLng(ll);
    showRoomsAround(ll, rooms);
  };

  /** 현위치 */
  const getCurrentPosition = () =>
    new Promise((resolve) => {
      if (!navigator.geolocation) return resolve(null);
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => resolve(null),
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
      );
    });

  /** 최초 지도 세팅 */
  const initMapAt = (lat, lng) => {
    const { kakao } = window;
    const centerLL = new kakao.maps.LatLng(lat, lng);

    const map = new kakao.maps.Map(mapEl.current, {
      center: centerLL,
      level: 5,
    });
    mapRef.current = map;

    geocoderRef.current = new kakao.maps.services.Geocoder();
    clustererRef.current = new kakao.maps.MarkerClusterer({
      map,
      averageCenter: true,
      minLevel: 6,
    });

    // 내 위치 마커(작은 별)
    const my = new kakao.maps.Marker({
      map,
      position: centerLL,
      image: new kakao.maps.MarkerImage(
        "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
        new kakao.maps.Size(24, 35)
      ),
    });
    myMarkerRef.current = my;

    updateLabelFromLatLng(centerLL);
    showRoomsAround(centerLL, rooms);

    // 빈곳 클릭 → 닫기
    kakao.maps.event.addListener(map, "click", () => {
      closeOverlay();
      setShowCards(false);
      setSelectedIndex(null);
    });

    kakao.maps.event.addListener(map, "idle", () =>
      updateLabelFromLatLng(map.getCenter())
    );
  };

  /* ---------- Kakao SDK + 현위치 ---------- */
  useEffect(() => {
    const KEY = import.meta.env.VITE_KAKAO_MAP_KEY;
    if (!KEY) {
      setStatus(".env의 VITE_KAKAO_MAP_KEY가 없습니다.");
      return;
    }

    const boot = async () => {
      const here = await getCurrentPosition();
      if (here) {
        initMapAt(here.lat, here.lng);
        setStatus("현재 위치 기준으로 표시");
      } else {
        initMapAt(FALLBACK.lat, FALLBACK.lng);
        setStatus("위치 권한 거부/실패 — 기본 위치로 표시");
      }
    };

    if (window.kakao?.maps) {
      window.kakao.maps.load(boot);
    } else {
      const s = document.createElement("script");
      s.id = "kakao-sdk";
      s.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KEY}&autoload=false&libraries=services,clusterer`;
      s.async = true;
      s.onload = () => window.kakao.maps.load(boot);
      s.onerror = () => setStatus("SDK 로드 실패(키/도메인 확인)");
      document.head.appendChild(s);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- 더미 데이터 → rooms 계산 & 지도 반영 ---------- */
  const baseRooms = useMemo(
    () =>
      DUMMIES.map((d) => ({
        ...d,
        price: priceText(d.deposit, d.monthly),
      })),
    []
  );

  const filteredRooms = useMemo(() => {
    if (!txType) return baseRooms;
    if (txType === "월세") return baseRooms.filter((r) => (r.monthly ?? 0) > 0);
    if (txType === "전세")
      return baseRooms.filter(
        (r) => (r.monthly ?? 0) === 0 && (r.deposit ?? 0) > 0
      );
    return baseRooms;
  }, [baseRooms, txType]);

  useEffect(() => {
    setRooms(filteredRooms);
    try {
      const m = mapRef.current;
      if (m && window?.kakao?.maps) showRoomsAround(m.getCenter(), filteredRooms);
    } catch (err) {
      logDev(err);
    }
  }, [filteredRooms]);

  /* ---------- controls ---------- */
  const zoomIn = () => {
    const m = mapRef.current;
    if (m) m.setLevel(m.getLevel() - 1);
  };
  const zoomOut = () => {
    const m = mapRef.current;
    if (m) m.setLevel(m.getLevel() + 1);
  };
  const moveToHere = async () => {
    setStatus("현재 위치로 이동 중…");
    const pos = await getCurrentPosition();
    if (pos) {
      refreshAt(pos.lat, pos.lng, true);
      setStatus("현재 위치로 이동");
    } else {
      setStatus("위치 권한 거부/실패");
    }
  };

  /* ---------- 캐러셀 스냅 ---------- */
  useEffect(() => {
    if (!showCards || selectedIndex == null) return;
    const el = cardRefs.current[selectedIndex];
    if (el?.scrollIntoView) {
      el.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [showCards, selectedIndex]);

  /* ---------- render ---------- */
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100dvh",
        background: "#fff",
      }}
    >
      {/* 상단 앱바 */}
      <div
        style={{
          position: "absolute",
          left: 0, right: 0, top: 0,
          zIndex: 20,
          background: "#fff",
          borderBottom: `1px solid ${C.line}`,
          height: 56,
          display: "grid",
          gridTemplateColumns: "56px 1fr 56px",
          alignItems: "center",
        }}
      >
        <button
          onClick={() => window.history.back()}
          style={{ border: "none", background: "transparent", cursor: "pointer" }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24">
            <path
              d="M15 19l-7-7 7-7"
              stroke="#111827"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div
          style={{
            justifySelf: "center",
            fontWeight: 800,
            letterSpacing: "-0.2px",
          }}
        >
          둘러보기
        </div>
        <div />
      </div>

      {/* 위치 라벨 + 칩 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 56,
          zIndex: 15,
          background: "#fff",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px 0 16px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 800,
                lineHeight: 1.25,
                letterSpacing: "-0.2px",
              }}
            >
              {locationLabel}
            </div>
          </div>
        </div>

        {/* 칩 — 거래유형/가격 + 방크기 */}
        <div
          style={{
            display: "flex",
            gap: 8,
            padding: "10px 16px 10px 16px",
            overflowX: "auto",
          }}
        >
          <button
            style={txType ? chipActive : chipBase}
            onClick={() => setTxTypeSheetOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={txTypeSheetOpen}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              {txType ?? "거래유형/가격"}
              <svg width="12" height="12" viewBox="0 0 24 24">
                <path
                  d="M7 10l5 5 5-5"
                  fill="none"
                  stroke={txType ? "#ffffff" : "#7B8496"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>

          <button
            style={roomType ? chipActive : chipBase}
            onClick={() => setRoomTypeSheetOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={roomTypeSheetOpen}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              {roomType ?? "방크기"}
              <svg width="12" height="12" viewBox="0 0 24 24">
                <path
                  d="M7 10l5 5 5-5"
                  fill="none"
                  stroke={roomType ? "#ffffff" : "#7B8496"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>
        </div>
      </div>

      {/* 지도 */}
      <div
        ref={mapEl}
        style={{ position: "absolute", top: 164, left: 0, right: 0, bottom: 0 }}
      />

      {/* 우측 컨트롤 */}
      <div
        style={{
          position: "absolute",
          right: 12,
          bottom: 120,
          display: "grid",
          gap: 8,
          zIndex: 15,
        }}
      >
        <button onClick={zoomIn} style={ctrlBtn}>＋</button>
        <button onClick={zoomOut} style={ctrlBtn}>－</button>
        <button onClick={moveToHere} style={ctrlBtn} title="현위치로 이동">◎</button>
      </div>

      {/* 목록보기 pill */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          navigate("/listingpage");
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          bottom: showCards ? 200 : 120,
          zIndex: 26,
          background: C.blue,
          color: "#fff",
          border: `1px solid ${C.blueLine}`,
          borderRadius: 999,
          padding: "10px 16px",
          fontWeight: 800,
          boxShadow:
            "0 10px 20px rgba(12,122,233,.35), 0 4px 10px rgba(0,0,0,.12), 0 0 0 2px #fff",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
        }}
        aria-label="목록보기"
      >
        <span style={{ fontSize: 14 }}>≡</span> 목록보기 ({rooms.length})
      </button>

      {/* 하단 카드 캐러셀 */}
      {showCards && rooms.length > 0 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 16,
            zIndex: 30,
            paddingLeft: 16,
            paddingRight: 16,
          }}
        >
          <div
            ref={carouselRef}
            style={{
              display: "flex",
              gap: 12,
              overflowX: "auto",
              paddingBottom: 4,
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {rooms.map((room, idx) => (
              <div
                key={room.name + idx}
                ref={(el) => (cardRefs.current[idx] = el)}
                style={{
                  scrollSnapAlign: "center",
                  background: "#FFFFFF",
                  border: `1px solid ${C.line}`,
                  borderRadius: 14,
                  boxShadow: "0 12px 28px rgba(0,0,0,.18)",
                  minWidth: "calc(100% - 64px)",
                  maxWidth: 368,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: 14,
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: 12,
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 900, fontSize: 16, marginBottom: 6 }}>
                      {room.price}
                    </div>
                    <div style={{ color: "#6B7280", fontSize: 13, marginBottom: 6 }}>
                      {specText(room.area, room.fee) || "정보 없음"}
                    </div>
                    <div style={{ fontWeight: 900, fontSize: 14, marginBottom: 4 }}>
                      {room.name}
                    </div>
                    <div style={{ color: "#6B7280", fontSize: 12 }}>
                      {room.addr || locationLabel}
                    </div>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        marginTop: 8,
                        fontSize: 12,
                        color: "#374151",
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24">
                        <path
                          d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z"
                          fill="#3B82F6"
                        />
                      </svg>
                      {typeof room.score === "number"
                        ? room.score.toFixed(1)
                        : "—"}
                    </div>
                  </div>

                  <button
                    disabled={!room.checkId}
                    onClick={() => {
                      if (!room.checkId) return;
                      navigate(`/homedetailpage/${room.checkId}`, {
                        state: {
                          item: {
                            id: room.checkId,
                            title: room.name,
                            addr: room.addr || locationLabel,
                            image: "",
                            deal: room.price,
                          },
                        },
                      });
                    }}
                    style={{
                      border: `1px solid ${C.blue}`,
                      background: room.checkId ? C.blue : "#D7E3FF",
                      color: "#fff",
                      borderRadius: 12,
                      padding: "10px 14px",
                      fontWeight: 800,
                      width: 96,
                      cursor: room.checkId ? "pointer" : "not-allowed",
                    }}
                  >
                    둘러보기
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 상태표시 */}
      <div
        style={{
          position: "absolute",
          left: 12,
          bottom: 20,
          fontSize: 12,
          color: "#6B7280",
        }}
      >
        {status}
      </div>

      {/* ================= 바텀 시트: 방크기 ================= */}
      {roomTypeSheetOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setRoomTypeSheetOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(0,0,0,.35)",
            display: "grid",
            alignItems: "end",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderTopLeftRadius: 18,
              borderTopRightRadius: 18,
              border: `1px solid ${C.line}`,
              padding: "12px 12px 16px",
              maxHeight: "70dvh",
            }}
          >
            <div
              style={{
                display: "grid",
                placeItems: "center",
                paddingTop: 4,
                paddingBottom: 10,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 4,
                  background: "#E5E7EB",
                  borderRadius: 999,
                }}
              />
            </div>
            <div style={{ fontWeight: 800, padding: "0 4px 8px" }}>방크기</div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {ROOM_TYPE_OPTIONS.map((opt) => {
                const active = roomType === opt;
                return (
                  <li key={opt}>
                    <button
                      onClick={() => {
                        setRoomType(opt);
                        setRoomTypeSheetOpen(false);
                      }}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "14px 10px",
                        border: 0,
                        background: "transparent",
                        display: "grid",
                        gridTemplateColumns: "1fr auto",
                        alignItems: "center",
                        cursor: "pointer",
                        fontSize: 15,
                        fontWeight: 700,
                        color: active ? C.blue : "#0F172A",
                      }}
                    >
                      <span>{opt}</span>
                      {active && (
                        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                          <path
                            d="M20 6L9 17l-5-5"
                            fill="none"
                            stroke={C.blue}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
            <div style={{ height: 8 }} />
          </div>
        </div>
      )}

      {/* ================= 바텀 시트: 거래유형/가격(월세/전세) ================= */}
      {txTypeSheetOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setTxTypeSheetOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(0,0,0,.35)",
            display: "grid",
            alignItems: "end",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderTopLeftRadius: 18,
              borderTopRightRadius: 18,
              border: `1px solid ${C.line}`,
              padding: "12px 12px 16px",
              maxHeight: "60dvh",
            }}
          >
            <div
              style={{
                display: "grid",
                placeItems: "center",
                paddingTop: 4,
                paddingBottom: 10,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 4,
                  background: "#E5E7EB",
                  borderRadius: 999,
                }}
              />
            </div>
            <div style={{ fontWeight: 800, padding: "0 4px 8px" }}>거래유형</div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {TX_OPTIONS.map((opt) => {
                const active = txType === opt;
                return (
                  <li key={opt}>
                    <button
                      onClick={() => {
                        setTxType(opt);
                        setTxTypeSheetOpen(false);
                      }}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "14px 10px",
                        border: 0,
                        background: "transparent",
                        display: "grid",
                        gridTemplateColumns: "1fr auto",
                        alignItems: "center",
                        cursor: "pointer",
                        fontSize: 15,
                        fontWeight: 700,
                        color: active ? C.blue : "#0F172A",
                      }}
                    >
                      <span>{opt}</span>
                      {active && (
                        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                          <path
                            d="M20 6L9 17l-5-5"
                            fill="none"
                            stroke={C.blue}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
            <div style={{ height: 8 }} />
          </div>
        </div>
      )}
    </div>
  );
}
