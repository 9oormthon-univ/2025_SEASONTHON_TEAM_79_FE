// MapBrowseExact.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function MapBrowseExact() {
  const mapEl = useRef(null);
  const mapRef = useRef(null);
  const myMarkerRef = useRef(null);
  const clustererRef = useRef(null);
  const placesRef = useRef(null);
  const geocoderRef = useRef(null);
  const currentInfoRef = useRef(null); // { iw, marker }

  const [status, setStatus] = useState("");
  const [locationLabel, setLocationLabel] = useState("경기 파주시 동패동");
  const [chips] = useState(["아파트", "방크기", "거래유형/가격"]);

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isList = pathname === "/listingpage";
  const isMap  = pathname === "/map";

  // 더미 방
  const USE_DUMMY = true;
  const DUMMIES = [
    { name: "한림대 도보 5분 원룸", type: "원룸", price: "월 45", off: [0.003, 0.0015] },
    { name: "명동 CGV 근처 투룸", type: "투룸", price: "월 62", off: [-0.0025, 0.0009] },
    { name: "춘천역 앞 오피스텔", type: "오피스텔", price: "월 75", off: [0.0016, -0.0022] },
    { name: "소양강 스카이워크 뷰", type: "원룸", price: "월 55", off: [-0.0011, -0.0026] },
    { name: "강대병원 근처 신축", type: "투룸", price: "월 70", off: [0.0006, 0.0032] },
    { name: "남춘천역 초근접", type: "원룸", price: "월 58", off: [0.0022, 0.0005] },
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
    geocoder.coord2RegionCode(
      ll.getLng(),
      ll.getLat(),
      (result, s) => {
        if (s !== window.kakao.maps.services.Status.OK || !result?.length) return;
        const r = result.find((x) => x.region_type === "H") || result[0];
        setLocationLabel(`${r.region_1depth_name} ${r.region_2depth_name} ${r.region_3depth_name}`);
      }
    );
  };

  const locate = (onOk) => {
    if (!("geolocation" in navigator)) { setStatus("이 브라우저는 위치를 지원하지 않아요."); return; }
    setStatus("내 위치 확인 중…");
    navigator.geolocation.getCurrentPosition(
      (pos) => onOk(pos.coords.latitude, pos.coords.longitude),
      (err) => {
        setStatus(
          err.code === err.PERMISSION_DENIED ? "위치 권한 거부됨" :
          err.code === err.POSITION_UNAVAILABLE ? "위치 정보를 사용할 수 없어요." :
          err.code === err.TIMEOUT ? "위치 요청 시간 초과" : "알 수 없는 위치 오류"
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
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
      const iw = new kakao.maps.InfoWindow({
        content: `
          <div style="padding:8px 10px; font-size:12px;">
            <div style="font-weight:700; margin-bottom:4px;">${r.name}</div>
            <div>${r.type} · ${r.price}</div>
          </div>`,
      });
      addToggle(m, iw);
      return m;
    });

    clusterer.addMarkers(markers);
  };

  /* ───────── Kakao SDK ───────── */
  useEffect(() => {
    const KEY = import.meta.env.VITE_KAKAO_MAP_KEY;
    if (!KEY) { setStatus(".env의 VITE_KAKAO_MAP_KEY가 없습니다."); return; }

    const init = () => {
      const { kakao } = window;
      const center = new kakao.maps.LatLng(37.5665, 126.9780);
      const map = new kakao.maps.Map(mapEl.current, { center, level: 5 });
      mapRef.current = map;

      geocoderRef.current = new kakao.maps.services.Geocoder();
      placesRef.current = new kakao.maps.services.Places();
      clustererRef.current = new kakao.maps.MarkerClusterer({ map, averageCenter: true, minLevel: 6 });

      const my = new kakao.maps.Marker({
        map, position: center,
        image: new kakao.maps.MarkerImage(
          "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
          new kakao.maps.Size(24, 35)
        ),
      });
      myMarkerRef.current = my;

      locate((lat, lng) => {
        const ll = new kakao.maps.LatLng(lat, lng);
        my.setPosition(ll);
        map.setCenter(ll);
        updateLabelFromLatLng(ll);
        if (USE_DUMMY) showDummiesAround(ll);
      });

      kakao.maps.event.addListener(map, "idle", () => updateLabelFromLatLng(map.getCenter()));
      kakao.maps.event.addListener(map, "click", () => closeInfo());

      setStatus("지도 로드 완료");
    };

    if (window.kakao?.maps) window.kakao.maps.load(init);
    else {
      const s = document.createElement("script");
      s.id = "kakao-sdk";
      s.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KEY}&autoload=false&libraries=services,clusterer`;
      s.async = true; s.onload = () => window.kakao.maps.load(init);
      s.onerror = () => setStatus("SDK 로드 실패(키/도메인 확인)");
      document.head.appendChild(s);
    }
  }, []);

  /* ───────── controls ───────── */
  const zoomIn = () => {
    const m = mapRef.current;
    if (m) m.setLevel(m.getLevel() - 1);
  };
  const zoomOut = () => {
    const m = mapRef.current;
    if (m) m.setLevel(m.getLevel() + 1);
  };
  const goMy = () => {
    const { kakao } = window;
    const map = mapRef.current, my = myMarkerRef.current;
    if (!map || !my) return;
    locate((lat, lng) => {
      const ll = new kakao.maps.LatLng(lat, lng);
      my.setPosition(ll);
      map.panTo(ll);
      updateLabelFromLatLng(ll);
      if (USE_DUMMY) showDummiesAround(ll);
    });
  };

  /* ───────── styles ───────── */
  const segWrap = {
    display: "inline-flex",
    gap: 6,
    background: "#F1F3F5",
    padding: 2,
    borderRadius: 999,
  };
  const segBtn = (active) => ({
    border: active ? "1px solid #4C8DFF" : "1px solid transparent",
    background: active ? "#FFFFFF" : "transparent",
    color: active ? "#2F5BFF" : "#8A94A6",
    padding: "4px 12px",
    height: 26,
    minWidth: 40,
    whiteSpace: "nowrap",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    lineHeight: "16px",
    letterSpacing: "-0.2px",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  });

  const chipStyle = {
    border: "1px solid #E6EBF3",
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
  };

  const ctrlBtn = {
    width: 40, height: 40,
    borderRadius: 12,
    border: "1px solid #E7EDF5",
    background: "#fff",
    fontSize: 18,
    boxShadow: "0 2px 8px rgba(0,0,0,.08)",
    cursor: "pointer",
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

          {/* ✅ 현재 경로에 따라 활성 스타일 자동 반영 */}
          <div style={segWrap}>
            <button onClick={() => navigate("/listingpage")} style={segBtn(isList)}>목록</button>
            <button onClick={() => navigate("/map")}          style={segBtn(isMap)}>지도</button>
          </div>
        </div>

        {/* 칩 */}
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
        <button onClick={zoomIn} style={ctrlBtn}>＋</button>
        <button onClick={zoomOut} style={ctrlBtn}>－</button>
        <button onClick={goMy} style={ctrlBtn}>◎</button>
        <button style={ctrlBtn}>🗺️</button>
      </div>

     
      {/* 상태표시 */}
      <div style={{ position: "absolute", left: 12, bottom: 20, fontSize: 12, color: "#6B7280" }}>{status}</div>
    </div>
  );
}
