// ListingExact.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";

/** ===== 색/치수 토큰 ===== */
const C = {
  bg: "#FFFFFF",
  text: "#0F172A",
  sub: "#6B7280",
  line: "#E7EDF5",
  chipLine: "#E6EBF3",
  soft: "#F3F6FB",
  blue: "#4C8DFF",
  star: "#3B82F6",
};
const R = { card: 16, img: 12, chip: 999, seg: 999 };
const S = { gap: 12, padX: 16, headerH: 56, fab: 56 };

/** ===== 더미 데이터 ===== */
const DUMMY = [
  { id: "cc-01", title: "센텀힐스테이트", addr: "대구시 수성구 범어동", area: 112, manage: "10만원", deal: "전세 1억", rating: 4.8, image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop" },
  { id: "cc-02", title: "롯데캐슬", addr: "서울시 강남구 도곡동", area: 33,  manage: "5만원",  deal: "월세 300/84", rating: 4.8, image: "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200&auto=format&fit=crop" },
  { id: "cc-03", title: "위례자이", addr: "경기도 성남시 분당구 정자동", area: 95, manage: "5만원", deal: "월세 1000/55", rating: 4.8, image: "https://images.unsplash.com/photo-1495435229349-e86db7bfa013?q=80&w=1200&auto=format&fit=crop" },
  { id: "cc-04", title: "삼성쉐르빌", addr: "서울시 영등포구 여의도동", area: 45, manage: "6만원", deal: "월세 120/80", rating: 4.7, image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1200&auto=format&fit=crop" },
];

/** ===== 메인 컴포넌트 ===== */
export default function ListingExact() {
  const [q, setQ] = useState("");
  const [wish, setWish] = useState(() => new Set());
  const [locationLabel, setLocationLabel] = useState("내 위치 확인 중…");
  const geocoderRef = useRef(null);

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isList = pathname === "/listingpage";
  const isMap  = pathname === "/map";

  // 현재 위치 → 행정동 라벨
  useEffect(() => {
    const KEY = import.meta.env.VITE_KAKAO_MAP_KEY;

    const setLabelFromLL = (lat, lng) => {
      const { kakao } = window;
      const geocoder = geocoderRef.current || new kakao.maps.services.Geocoder();
      geocoderRef.current = geocoder;
      geocoder.coord2RegionCode(
        lng, lat,
        (result, status) => {
          if (status !== kakao.maps.services.Status.OK || !result?.length) {
            setLocationLabel("현재 위치");
            return;
          }
          const r = result.find((x) => x.region_type === "H") || result[0];
          setLocationLabel(`${r.region_1depth_name} ${r.region_2depth_name} ${r.region_3depth_name}`);
        }
      );
    };

    const locate = () => {
      if (!("geolocation" in navigator)) { setLocationLabel("위치 지원 안됨"); return; }
      navigator.geolocation.getCurrentPosition(
        (pos) => setLabelFromLL(pos.coords.latitude, pos.coords.longitude),
        (err) => {
          setLocationLabel(
            err.code === err.PERMISSION_DENIED ? "위치 권한 필요" :
            err.code === err.POSITION_UNAVAILABLE ? "위치 불가" : "위치 오류"
          );
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    };

    const init = () => locate();

    if (window.kakao?.maps?.services) init();
    else {
      const s = document.createElement("script");
      s.id = "kakao-services";
      s.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KEY}&autoload=false&libraries=services`;
      s.async = true;
      s.onload = () => window.kakao.maps.load(init);
      s.onerror = () => setLocationLabel("카카오 SDK 로드 실패");
      document.head.appendChild(s);
    }
  }, []);

  const filtered = useMemo(() => {
    const kw = q.trim();
    if (!kw) return DUMMY;
    return DUMMY.filter((x) => x.title.includes(kw) || x.addr.includes(kw) || x.deal.includes(kw));
  }, [q]);

  const toggleWish = (id) => {
    const n = new Set(wish);
    n.has(id) ? n.delete(id) : n.add(id);
    setWish(n);
  };

  return (
    <Wrap>
      {/* 헤더 */}
      <TopBar>
        <IconBtn aria-label="back" onClick={() => window.history.back()}>
          <ChevronLeft />
        </IconBtn>
        <TopTitle>둘러보기</TopTitle>
        <IconBtn aria-label="bookmark">
          <BookmarkOutline />
        </IconBtn>
      </TopBar>

      {/* 위치 + 세그먼트(한 줄) */}
      <Section>
        <HeaderRow>
          <div>
            <LocTitle>{locationLabel}</LocTitle>
            <LocSub>
              평균 평점 <StarIcon /> <b>4.8</b>
            </LocSub>
          </div>

          <Segment>
            <SegBtn $active={isList} onClick={() => navigate("/listingpage")}>목록</SegBtn>
            <SegBtn $active={isMap}  onClick={() => navigate("/map")}>지도</SegBtn>
          </Segment>
        </HeaderRow>
      </Section>

      {/* 칩 */}
      <Chips>
        <Chip>아파트 <Caret /></Chip>
        <Chip>방크기 <Caret /></Chip>
        <Chip>거래유형/가격 <Caret /></Chip>
      </Chips>

      {/* 검색 */}
      <Search>
        <SearchIcon />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="지역, 대학, 건물 등" />
      </Search>

      {/* 리스트 */}
      <List>
        {filtered.map((it) => (
          <Card key={it.id}>
            <Thumb style={{ backgroundImage: `url(${it.image})` }} />
            <Info>
              <Addr>{it.addr}</Addr>
              <Name>{it.title}</Name>
              <RatingRow><SmallStar /> <span>4.8</span></RatingRow>
              <Meta>{it.area}m² · 관리비 {it.manage}</Meta>
              <Deal>{it.deal}</Deal>
            </Info>
            <WishBtn aria-label="wish" onClick={() => toggleWish(it.id)} $on={wish.has(it.id)}>
              {wish.has(it.id) ? <BookmarkFill /> : <BookmarkOutline />}
            </WishBtn>
          </Card>
        ))}
      </List>

      {/* 플로팅 + 버튼(유지) */}
      <Fab>＋</Fab>
    </Wrap>
  );
}

/** ===== styled ===== */
const Wrap = styled.div`
  min-height: 100dvh;
  background: ${C.bg};
  color: ${C.text};
  padding-bottom: 20px; /* ✅ 풋터 삭제에 맞춰 여백 축소 */
`;

const TopBar = styled.header`
  position: sticky; top: 0; z-index: 20;
  height: ${S.headerH}px; border-bottom: 1px solid ${C.line};
  display: grid; grid-template-columns: 56px 1fr 56px; align-items: center; background: #fff;
`;
const TopTitle = styled.div`justify-self: center; font-weight: 800;`;
const IconBtn = styled.button`border:0; background:transparent; display:grid; place-items:center; height:100%; cursor:pointer;`;

const Section = styled.div`padding: 8px ${S.padX}px 0;`;
const HeaderRow = styled.div`display:flex; align-items:center; justify-content:space-between;`;
const LocTitle = styled.div`font-size:22px; font-weight:800; margin-top:6px;`;
const LocSub = styled.div`color:${C.sub}; font-size:13px; margin-top:4px; display:flex; align-items:center; gap:4px;`;

/* 세그먼트 */
const Segment = styled.div`display:inline-flex; gap:6px; padding:2px; border-radius:${R.seg}px; background:${C.soft};`;
const SegBtn = styled.button`
  padding:5px 14px; min-width:44px; height:28px; border-radius:${R.seg}px;
  border:1px solid ${(p)=>p.$active?C.blue:"transparent"};
  background:${(p)=>p.$active?"#fff":"transparent"};
  color:${(p)=>p.$active?C.text:"#8A94A6"};
  font-weight:700; font-size:13px; line-height:16px; white-space:nowrap; cursor:pointer;
  box-shadow:${(p)=>p.$active?"0 0 0 2px rgba(76,141,255,.25)":"none"};
`;

const Chips = styled.div`display:flex; gap:8px; padding:8px ${S.padX}px 0; overflow-x:auto;`;
const Chip = styled.button`
  border:1px solid ${C.chipLine}; background:#fff; border-radius:${R.chip}px;
  padding:10px 12px; font-size:13px; font-weight:700; color:${C.text};
  display:inline-flex; align-items:center; gap:6px; white-space:nowrap; cursor:pointer;
`;

const Search = styled.div`
  margin:8px ${S.padX}px 0; background:${C.soft}; border:1px solid ${C.line};
  border-radius:14px; display:flex; align-items:center; gap:8px; padding:12px;
  input{ border:0; outline:none; flex:1; background:transparent; font-size:14px; color:${C.text};
    ::placeholder{ color:#9aa0a6; } }
`;

const List = styled.div`display:grid; gap:${S.gap}px; padding:8px ${S.padX}px 12px;`;
const Card = styled.article`
  display:grid; grid-template-columns:112px 1fr 28px; gap:12px; padding:10px;
  background:#fff; border:1px solid #EEF1F6; border-radius:${R.card}px; box-shadow:0 2px 8px rgba(0,0,0,.04);
`;
const Thumb = styled.div`width:112px; height:96px; border-radius:${R.img}px; background-size:cover; background-position:center;`;
const Info = styled.div`display:grid; align-content:start; gap:4px;`;
const Addr = styled.div`color:${C.sub}; font-size:12px;`;
const Name = styled.div`font-weight:800; font-size:16px;`;
const RatingRow = styled.div`display:inline-flex; align-items:center; gap:4px; font-size:12px; font-weight:700; color:#374151;`;
const Meta = styled.div`font-size:12px; color:${C.sub};`;
const Deal = styled.div`font-weight:900; margin-top:2px;`;

const WishBtn = styled.button`border:0; background:transparent; cursor:pointer; align-self:start; color:${(p)=>p.$on?C.blue:"#9aa0a6"};`;

const Fab = styled.button`
  position: fixed; left: 50%; bottom: 20px; transform: translateX(-50%);
  width: ${S.fab}px; height: ${S.fab}px; border-radius: 999px; border: 0;
  background: ${C.blue}; color: #fff; font-size: 24px; font-weight: 800;
  box-shadow: 0 10px 20px rgba(76,141,255,.35); cursor: pointer;
`;

/** ===== Icons (SVG) ===== */
function ChevronLeft(props){return(<svg width="22" height="22" viewBox="0 0 24 24" {...props}><path d="M15 19l-7-7 7-7" stroke="#111827" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>);}
function BookmarkOutline(props){return(<svg width="22" height="22" viewBox="0 0 24 24" {...props}><path d="M6 4h12v16l-6-3-6 3V4z" fill="none" stroke="#111827" strokeWidth="1.8" strokeLinejoin="round"/></svg>);}
function BookmarkFill(props){return(<svg width="22" height="22" viewBox="0 0 24 24" {...props}><path d="M6 4h12v16l-6-3-6 3V4z" fill={C.blue}/></svg>);}
function StarIcon(props){return(<svg width="14" height="14" viewBox="0 0 24 24" {...props}><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z" fill={C.star}/></svg>);}
function SmallStar(props){return <StarIcon {...props}/>;}
function Caret(props){return(<svg width="14" height="14" viewBox="0 0 24 24" {...props}><path d="M7 10l5 5 5-5" fill="none" stroke="#7B8496" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>);}
function SearchIcon(props){return(<svg width="18" height="18" viewBox="0 0 24 24" {...props}><circle cx="11" cy="11" r="7" stroke="#9AA0A6" strokeWidth="2" fill="none"/><path d="M21 21l-4.3-4.3" stroke="#9AA0A6" strokeWidth="2" strokeLinecap="round"/></svg>);}
function HomeIcon(){return(<svg width="20" height="20" viewBox="0 0 24 24"><path d="M3 10l9-7 9 7v10a2 2 0 0 1-2 2h-4v-6H9v6H5a2 2 0 0 1-2-2V10z" fill="currentColor"/></svg>);}
