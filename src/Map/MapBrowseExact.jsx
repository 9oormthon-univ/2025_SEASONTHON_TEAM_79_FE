// MapBrowseExact.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function MapBrowseExact() {
  const mapEl = useRef(null);
  const mapRef = useRef(null);
  const myMarkerRef = useRef(null);
  const clustererRef = useRef(null);
  const geocoderRef = useRef(null);
  const currentInfoRef = useRef(null); // { iw, marker }

  const [status, setStatus] = useState("명지전문대 기준으로 표시");
  const [locationLabel, setLocationLabel] = useState("명지전문대 인근");
  const [chips] = useState(["아파트", "방크기", "거래유형/가격"]);

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isList = pathname === "/listingpage";
  const isMap  = pathname === "/map";

  // ✅ 명지전문대 좌표
  const MJC = { lat: 37.5828, lng: 126.9114 };

  // 더미 방(명지전문대 인근)
  const DUMMIES = [
    { name: "가재울아이파크 3단지",   type: "아파트",  price: "전세 3억 2천",  off: [ 0.0018, -0.0012] },
    { name: "DMC 파크뷰자이",         type: "아파트",  price: "월세 3000/120", off: [-0.0016,  0.0010] },
    { name: "래미안 e편한세상 가재울", type: "아파트",  price: "월세 1000/65",  off: [ 0.0022,  0.0006] },
    { name: "홍은 래미안 에코포레",   type: "아파트",  price: "전세 4억 5천",  off: [-0.0020, -0.0008] },
  ];

  /* ───────── utils ───────── */
  const closeInfo = () => {
    if (currentInfoRef.current) {
      currentInfoRef.current.iw.close();
      currentInfoRef.current = null;
    }
  };

  const addToggle = (marker, iw) => {
    const { kakao } = window;
    kakao.maps.event.addListener(marker, "click", () => {
      if (currentInfoRef.current && currentInfoRef.current.marker === marker) {
        closeInfo();
        return;
      }
      closeInfo();
      iw.open(mapRef.current, marker);
      currentInfoRef.current = { iw, marker };
    });
  };

  const updateLabelFromLatLng = (ll) => {
    const geocoder = geocoderRef.current;
    if (!geocoder) return;
    geocoder.coord2RegionCode(ll.getLng(), ll.getLat(), (result, s) => {
      if (s !== window.kakao.maps.services.Status.OK || !result?.length) return;
      const r = result.find((x) => x.region_type === "H") || result[0];
      setLocationLabel(`${r.region_1depth_name} ${r.region_2depth_name} ${r.region_3depth_name}`);
    });
  };

  /** 팝업(인포윈도우)용 DOM 콘텐츠 생성 */
  const buildInfoContent = (room) => {
    const { kakao } = window;

    const wrap = document.createElement("div");
    // 깔끔한 흰색 팝업 스타일
    wrap.style.cssText = [
      "padding:10px 12px",
      "font-size:12px",
      "background:#fff",
      "border:1px solid #E7EDF5",
      "border-radius:8px",
      "box-shadow:0 6px 20px rgba(0,0,0,.12)",
      "min-width:180px",
    ].join(";");

    // 내부 구조
    const title = document.createElement("div");
    title.style.cssText = "font-weight:800;margin-bottom:6px;letter-spacing:-.2px";
    title.textContent = room.name;

    const meta = document.createElement("div");
    meta.style.cssText = "color:#374151;margin-bottom:8px";
    meta.textContent = `${room.type} · ${room.price}`;

    const footer = document.createElement("div");
    footer.style.cssText = "display:flex;gap:8px;align-items:center";

    // “상세보기” 버튼은 DMC 파크뷰자이만 노출
    if (room.name === "DMC 파크뷰자이") {
      const btn = document.createElement("button");
      btn.textContent = "상세보기";
      btn.style.cssText = [
        "border:1px solid #4C8DFF",
        "background:#4C8DFF",
        "color:#fff",
        "border-radius:999px",
        "padding:6px 10px",
        "font-weight:700",
        "cursor:pointer",
      ].join(";");

      // 버튼 클릭 시 상세 이동
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        // 지도 클릭 이벤트로 전파되는 것 방지
        if (kakao?.maps?.event?.preventMap) kakao.maps.event.preventMap();
        closeInfo();
        navigate("/homedetailpage", {
          state: {
            item: {
              aptNm: room.name,
              address: "서울 서대문구 북가좌 2동",
              사진: "",
            },
          },
        });
      });

      footer.appendChild(btn);
    }

    wrap.appendChild(title);
    wrap.appendChild(meta);
    if (footer.childNodes.length) wrap.appendChild(footer);

    // 팝업 내부 아무 곳이나 클릭 시 지도가 반응하지 않도록(안전장치)
    wrap.addEventListener("mousedown", () => {
      if (kakao?.maps?.event?.preventMap) kakao.maps.event.preventMap();
    });
    wrap.addEventListener("touchstart", () => {
      if (kakao?.maps?.event?.preventMap) kakao.maps.event.preventMap();
    });

    return wrap;
  };

  const showDummiesAround = (centerLL) => {
    const { kakao } = window;
    const map = mapRef.current;
    const clusterer = clustererRef.current;
    if (!map || !clusterer) return;

    clusterer.clear();
    closeInfo();

    const baseLat = centerLL.getLat();
    const baseLng = centerLL.getLng();

    const markers = DUMMIES.map((r) => {
      const ll = new kakao.maps.LatLng(baseLat + r.off[0], baseLng + r.off[1]);
      const m = new kakao.maps.Marker({ position: ll, title: r.name });

      // ✅ 인포윈도우를 DOM 노드로 생성 + 버튼 이벤트 연결
      const contentEl = buildInfoContent(r);
      const iw = new kakao.maps.InfoWindow({ content: contentEl, removable: false });

      // 모든 마커는 클릭 시 인포윈도우 토글
      addToggle(m, iw);

      return m;
    });

    clusterer.addMarkers(markers);
  };

  const initMapAtMJC = () => {
    const { kakao } = window;
    const centerLL = new kakao.maps.LatLng(MJC.lat, MJC.lng);

    const map = new kakao.maps.Map(mapEl.current, { center: centerLL, level: 5 });
    mapRef.current = map;

    geocoderRef.current  = new kakao.maps.services.Geocoder();
    clustererRef.current = new kakao.maps.MarkerClusterer({
      map, averageCenter: true, minLevel: 6
    });

    const my = new kakao.maps.Marker({
      map, position: centerLL,
      image: new kakao.maps.MarkerImage(
        "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
        new kakao.maps.Size(24, 35)
      ),
    });
    myMarkerRef.current = my;

    updateLabelFromLatLng(centerLL);
    showDummiesAround(centerLL);

    kakao.maps.event.addListener(map, "idle", () => updateLabelFromLatLng(map.getCenter()));
    kakao.maps.event.addListener(map, "click", () => closeInfo());

    setStatus("명지전문대 기준으로 고정됨");
  };

  const moveToMJC = () => {
    const { kakao } = window;
    const ll = new kakao.maps.LatLng(MJC.lat, MJC.lng);
    const map = mapRef.current, my = myMarkerRef.current;
    if (!map || !my) return;
    my.setPosition(ll);
    map.panTo(ll);
    updateLabelFromLatLng(ll);
    showDummiesAround(ll);
    setStatus("명지전문대 위치로 이동");
  };

  /* ───────── Kakao SDK 로드 + 초기화 ───────── */
  useEffect(() => {
    const KEY = import.meta.env.VITE_KAKAO_MAP_KEY;
    if (!KEY) { setStatus(".env의 VITE_KAKAO_MAP_KEY가 없습니다."); return; }

    const start = () => initMapAtMJC();

    if (window.kakao?.maps) {
      window.kakao.maps.load(start);
    } else {
      const s = document.createElement("script");
      s.id = "kakao-sdk";
      s.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KEY}&autoload=false&libraries=services,clusterer`;
      s.async = true;
      s.onload = () => window.kakao.maps.load(start);
      s.onerror = () => setStatus("SDK 로드 실패(키/도메인 확인)");
      document.head.appendChild(s);
    }
  }, []);

  /* ───────── controls ───────── */
  const zoomIn = () => { const m = mapRef.current; if (m) m.setLevel(m.getLevel() - 1); };
  const zoomOut = () => { const m = mapRef.current; if (m) m.setLevel(m.getLevel() + 1); };

  /* ───────── styles ───────── */
  const segWrap = { display: "inline-flex", gap: 6, background: "#F1F3F5", padding: 2, borderRadius: 999 };
  const segBtn = (active) => ({
    border: active ? "1px solid #4C8DFF" : "1px solid transparent",
    background: active ? "#FFFFFF" : "transparent",
    color: active ? "#2F5BFF" : "#8A94A6",
    padding: "4px 12px",
    height: 26, minWidth: 40, whiteSpace: "nowrap", borderRadius: 999,
    fontSize: 12, fontWeight: 700, lineHeight: "16px", letterSpacing: "-0.2px",
    cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center",
  });
  const chipStyle = {
    border: "1px solid #E6EBF3", background: "#FFFFFF", color: "#0F172A",
    borderRadius: 999, padding: "9px 11px", fontSize: 12, fontWeight: 700,
    display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap",
  };
  const ctrlBtn = {
    width: 40, height: 40, borderRadius: 12, border: "1px solid #E7EDF5",
    background: "#fff", fontSize: 18, boxShadow: "0 2px 8px rgba(0,0,0,.08)", cursor: "pointer",
  };

  /* ───────── render ───────── */
  return (
    <div style={{ position: "relative", width: "100%", height: "100dvh", background: "#fff" }}>
      {/* 상단 앱바 */}
      <div style={{
        position: "absolute", left: 0, right: 0, top: 0, zIndex: 20,
        background: "#fff", borderBottom: "1px solid #E7EDF5", height: 56,
        display: "grid", gridTemplateColumns: "56px 1fr 56px", alignItems: "center"
      }}>
        <button onClick={() => window.history.back()} style={{ border: "none", background: "transparent", cursor: "pointer" }}>
          <svg width="22" height="22" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke="#111827" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div style={{ justifySelf: "center", fontWeight: 800, letterSpacing: "-0.2px" }}>둘러보기</div>
        <button style={{ border: "none", background: "transparent", cursor: "pointer", justifySelf: "center" }}>
          <svg width="22" height="22" viewBox="0 0 24 24"><path d="M6 4h12v16l-6-3-6 3V4z" fill="none" stroke="#111827" strokeWidth="1.8" strokeLinejoin="round"/></svg>
        </button>
      </div>

      {/* 위치/세그먼트/칩 */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 56, zIndex: 15, background: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px 0 16px" }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, lineHeight: 1.25, letterSpacing: "-0.2px" }}>{locationLabel}</div>
          </div>
          <div style={segWrap}>
            <button onClick={() => navigate("/listingpage")} style={segBtn(isList)}>목록</button>
            <button onClick={() => navigate("/map")}          style={segBtn(isMap)}>지도</button>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, padding: "10px 16px 10px 16px", overflowX: "auto" }}>
          {chips.map((c) => (
            <button key={c} style={chipStyle}>
              {c}
              <svg width="12" height="12" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5" fill="none" stroke="#7B8496" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          ))}
        </div>
      </div>

      {/* 지도 */}
      <div ref={mapEl} style={{ position: "absolute", top: 164, left: 0, right: 0, bottom: 0 }} />

      {/* 우측 컨트롤 */}
      <div style={{ position: "absolute", right: 12, bottom: 120, display: "grid", gap: 8, zIndex: 15 }}>
        <button onClick={zoomIn}  style={ctrlBtn}>＋</button>
        <button onClick={zoomOut} style={ctrlBtn}>－</button>
        {/* ✅ '현위치' 대신 명지전문대 중심 이동 */}
        <button onClick={moveToMJC} style={ctrlBtn}>◎</button>
        <button style={ctrlBtn}>🗺️</button>
      </div>

      {/* 상태표시 */}
      <div style={{ position: "absolute", left: 12, bottom: 20, fontSize: 12, color: "#6B7280" }}>{status}</div>
    </div>
  );
}
