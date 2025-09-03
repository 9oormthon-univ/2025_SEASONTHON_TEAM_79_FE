// src/pages/CurrentLocationMapPage.jsx
import { useEffect, useRef, useState } from "react";
import { useKakaoLoader } from "../lib/useKakaoLoader";

const ctrlBtnStyle = {
  width: 40, height: 40, borderRadius: 10,
  border: "1px solid #E5E7EB", background: "#fff", fontSize: 18,
};

export default function CurrentLocationMapPage() {
  const loaded = useKakaoLoader();
  const mapEl = useRef(null);
  const mapRef = useRef(null);
  const myMarkerRef = useRef(null);
  const clustererRef = useRef(null);
  const placesRef = useRef(null);

  const [keyword, setKeyword] = useState("");
  const [statusMsg, setStatusMsg] = useState("내 위치를 확인 중...");

  useEffect(() => {
    if (!loaded || !mapEl.current) return;

    if (!window.kakao?.maps) {
      console.error("kakao.maps가 아직 준비되지 않았습니다.");
      return;
    }
    const { kakao } = window;

    // 기본 좌표(서울시청)
    const initCenter = new kakao.maps.LatLng(37.5665, 126.9780);
    const map = new kakao.maps.Map(mapEl.current, { center: initCenter, level: 5 });
    mapRef.current = map;

    // 내 위치 마커
    const myMarker = new kakao.maps.Marker({
      map,
      position: initCenter,
      image: new kakao.maps.MarkerImage(
        "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
        new kakao.maps.Size(24, 35)
      ),
    });
    myMarkerRef.current = myMarker;

    // 클러스터러 & 장소검색
    clustererRef.current = new kakao.maps.MarkerClusterer({
      map, averageCenter: true, minLevel: 6,
    });
    placesRef.current = new kakao.maps.services.Places();

    // 현재 위치로 이동
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const ll = new kakao.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
          myMarker.setPosition(ll);
          map.setCenter(ll);
          setStatusMsg("현재 위치로 이동 완료");
        },
        () => setStatusMsg("위치 권한을 허용하면 내 위치로 이동할 수 있어요.")
      );
    } else {
      setStatusMsg("이 브라우저는 위치 정보를 지원하지 않아요.");
    }
  }, [loaded]);

  const runSearch = () => {
    const map = mapRef.current;
    const clusterer = clustererRef.current;
    const places = placesRef.current;
    const { kakao } = window;
    if (!map || !clusterer || !places || !keyword) return;

    setStatusMsg(`"${keyword}" 검색 중...`);
    places.keywordSearch(
      keyword,
      (data, status) => {
        if (status !== kakao.maps.services.Status.OK) {
          setStatusMsg("검색 결과가 없어요.");
          clusterer.clear();
          return;
        }
        const bounds = new kakao.maps.LatLngBounds();
        const markers = data.map((p) => {
          const m = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(p.y, p.x),
            title: p.place_name,
          });
          bounds.extend(m.getPosition());
          return m;
        });
        clusterer.clear();
        clusterer.addMarkers(markers);
        map.setBounds(bounds);
        setStatusMsg(`"${keyword}" 결과: ${data.length}곳`);
      },
      { useMapBounds: true } // 현재 지도 범위 내
    );
  };

  const zoomIn = () => mapRef.current && mapRef.current.setLevel(mapRef.current.getLevel() - 1);
  const zoomOut = () => mapRef.current && mapRef.current.setLevel(mapRef.current.getLevel() + 1);
  const goMyLocation = () => {
    const map = mapRef.current;
    const myMarker = myMarkerRef.current;
    if (!map || !myMarker) return;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const ll = new kakao.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
          myMarker.setPosition(ll);
          map.panTo(ll);
          setStatusMsg("내 위치로 이동");
        },
        () => setStatusMsg("위치 권한을 허용해야 이동할 수 있어요.")
      );
    }
  };

  const onFabClick = () => {
    alert("플로팅 버튼 클릭: 원하는 액션(등록/필터 등)을 연결하세요.");
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100dvh", background: "#fff" }}>
      {/* 상단바 */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, zIndex: 10,
        padding: "12px 12px 8px", background: "rgba(255,255,255,0.9)",
        backdropFilter: "saturate(180%) blur(6px)", borderBottom: "1px solid #eee"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => window.history.back()} style={{ border: 0, background: "transparent", fontSize: 18 }}>←</button>
          <div style={{ fontWeight: 600 }}>내 주변</div>
        </div>
        <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="원룸, 편의점, 대학 등"
            style={{ flex: 1, padding: "10px 12px", border: "1px solid #E5E7EB", borderRadius: 10, outline: "none" }}
            onKeyDown={(e) => e.key === "Enter" && runSearch()}
          />
          <button onClick={runSearch} style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #E5E7EB", background: "#fff" }}>
            검색
          </button>
        </div>
        <div style={{ marginTop: 6, fontSize: 12, color: "#6B7280" }}>{statusMsg}</div>
      </div>

      {/* 지도 */}
      <div ref={mapEl} style={{ position: "absolute", top: 72, left: 0, right: 0, bottom: 80 }} />

      {/* 우측 컨트롤 */}
      <div style={{ position: "absolute", right: 12, bottom: 120, zIndex: 10, display: "grid", gap: 8 }}>
        <button onClick={zoomIn} style={ctrlBtnStyle}>＋</button>
        <button onClick={zoomOut} style={ctrlBtnStyle}>－</button>
        <button onClick={goMyLocation} style={ctrlBtnStyle}>◎</button>
      </div>

      {/* 하단 FAB */}
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 0, height: 80,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "linear-gradient(to top, rgba(255,255,255,0.9), rgba(255,255,255,0))"
      }}>
        <button onClick={onFabClick} style={{
          width: 64, height: 64, borderRadius: 999, border: "none",
          background: "#5B8CFF", color: "#fff", fontSize: 28, boxShadow: "0 6px 16px rgba(0,0,0,0.2)"
        }}>＋</button>
      </div>
    </div>
  );
}
