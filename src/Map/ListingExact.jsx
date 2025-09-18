// src/user/ListingExact/ListingExact.jsx
import React, { useMemo, useState, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { useNavigate } from "react-router-dom";

/* ▼ 리스트 페이지에서만 BottomNav 숨기기 */
const HideBottomNavGlobal = createGlobalStyle`
  main:has([data-hide-bottom-nav]) + footer { display:none !important; }
  main:has([data-hide-bottom-nav]) { padding-bottom: env(safe-area-inset-bottom,0px) !important; }
`;
const HideBottomNavToken = () => <span data-hide-bottom-nav style={{ display: "none" }} />;

/* ===== 색/치수 토큰 ===== */
const C = {
  bg: "#FFFFFF",
  text: "#0F172A",
  sub: "#6B7280",
  line: "#E7EDF5",
  chipLine: "#E6EBF3",
  soft: "#F3F6FB",
  // Lottie tone
  blue: "#0C7AE9",
  blueLine: "#0073E6",
  star: "#3B82F6",
};
const R = { card: 16, img: 12, chip: 999 };
const S = { gap: 12, padX: 16, headerH: 56 };

/* ===== 유틸 ===== */
const swallow = (e) => {
  if (import.meta.env?.DEV) {
    // eslint-disable-next-line no-console
    console.debug(e);
  }
};

/* ===== API 유틸 ===== */
const API_BASE = (import.meta.env?.VITE_API_BASE || "").replace(/\/+$/, "");
const withBase = (p) => `${API_BASE}${p}`;
const getToken = () =>
  (localStorage.getItem("token") ||
    localStorage.getItem("auth_token") ||
    "").trim();

/* ===================================================================================
   더미 사용 스위치
   - 개발 중 백엔드 없이 리스트를 띄우려면 true
   - 서버 붙일 땐 false 로 전환
=================================================================================== */
const FORCE_DUMMY = true;

/* ===================================================================================
   구름스퀘어 강남(역삼/테헤란로) 주변 더미 데이터 4개
   백엔드 응답 스키마 그대로 맞춰서 작성 (normalizeList로 변환)
=================================================================================== */
const DUMMY_GROUPS = [
  {
    address: "서울 강남구 테헤란로 311 (역삼동)",
    latestName: "역삼 프라임빌",
    latestMonthly: 120,        // 만원
    latestDeposit: 3000,       // 만원
    latestMaintenanceFee: 7,   // 만원
    latestFloorAreaSqm: 56,    // ㎡
    avgScore: 4.7,
    checklists: [
      {
        id: 101,
        name: "역삼 프라임빌 601호",
        monthly: 120,
        deposit: 3000,
        maintenanceFee: 7,
        floorAreaSqm: 56,
        score: 4.7,
        photos: [
          {
            id: 1,
            filename: "apt1.jpg",
            contentType: "image/jpeg",
            size: 0,
            caption: "거실",
            createdAt: new Date().toISOString(),
            rawUrl:
              "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
          },
        ],
      },
    ],
  },
  {
    address: "서울 강남구 역삼로 180",
    latestName: "구름스퀘어 레지던스",
    latestMonthly: 0,
    latestDeposit: 45000,      // 전세 4억5천
    latestMaintenanceFee: 9,
    latestFloorAreaSqm: 84,
    avgScore: 4.8,
    checklists: [
      {
        id: 102,
        name: "레지던스 1202호",
        monthly: 0,
        deposit: 45000,
        maintenanceFee: 9,
        floorAreaSqm: 84,
        score: 4.8,
        photos: [
          {
            id: 2,
            filename: "apt2.jpg",
            contentType: "image/jpeg",
            size: 0,
            caption: "주방",
            createdAt: new Date().toISOString(),
            rawUrl:
              "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200&auto=format&fit=crop",
          },
        ],
      },
    ],
  },
  {
    address: "서울 강남구 테헤란로 322",
    latestName: "테헤란로 스테이",
    latestMonthly: 65,
    latestDeposit: 1000,
    latestMaintenanceFee: 5,
    latestFloorAreaSqm: 33,
    avgScore: 4.6,
    checklists: [
      {
        id: 103,
        name: "스테이 803호",
        monthly: 65,
        deposit: 1000,
        maintenanceFee: 5,
        floorAreaSqm: 33,
        score: 4.6,
        photos: [
          {
            id: 3,
            filename: "apt3.jpg",
            contentType: "image/jpeg",
            size: 0,
            caption: "침실",
            createdAt: new Date().toISOString(),
            rawUrl:
              "https://images.unsplash.com/photo-1495435229349-e86db7bfa013?q=80&w=1200&auto=format&fit=crop",
          },
        ],
      },
    ],
  },
  {
    address: "서울 강남구 논현로 508",
    latestName: "강남 센트럴하임",
    latestMonthly: 0,
    latestDeposit: 32000,      // 전세 3억2천
    latestMaintenanceFee: 6,
    latestFloorAreaSqm: 59,
    avgScore: 4.7,
    checklists: [
      {
        id: 104,
        name: "센트럴하임 1004호",
        monthly: 0,
        deposit: 32000,
        maintenanceFee: 6,
        floorAreaSqm: 59,
        score: 4.7,
        photos: [
          {
            id: 4,
            filename: "apt4.jpg",
            contentType: "image/jpeg",
            size: 0,
            caption: "외관",
            createdAt: new Date().toISOString(),
            rawUrl:
              "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1200&auto=format&fit=crop",
          },
        ],
      },
    ],
  },
];

/** 응답 정규화: 서버가 주는 스키마 → 카드 표시용 */
function normalizeList(raw = []) {
  if (!Array.isArray(raw)) return [];

  const pickDeal = (m, d) => {
    const isMonthly = typeof m === "number" && m > 0;
    const won = (n) => (typeof n === "number" ? n.toLocaleString() : undefined);
    if (isMonthly && typeof d === "number") return `월세 ${won(d)}/${won(m)}`;
    if (!isMonthly && typeof d === "number") return `전세 ${won(d)}`;
    return "가격 정보 없음";
  };

  return raw.map((g, idx) => {
    const firstChecklist = Array.isArray(g.checklists) ? g.checklists[0] : undefined;
    const firstPhoto =
      firstChecklist?.photos?.[0]?.rawUrl ||
      firstChecklist?.photos?.[0]?.url ||
      "";

    return {
      key: `group-${idx}`,

      // 원시값(필터 용도)
      monthly: g.latestMonthly ?? firstChecklist?.monthly ?? 0,
      deposit: g.latestDeposit ?? firstChecklist?.deposit ?? 0,

      // 표시용
      addr: g.address || "",
      title: g.latestName || firstChecklist?.name || "이름 없음",
      area: g.latestFloorAreaSqm ?? firstChecklist?.floorAreaSqm,
      manage: g.latestMaintenanceFee ?? firstChecklist?.maintenanceFee,
      dealText: pickDeal(
        g.latestMonthly ?? firstChecklist?.monthly,
        g.latestDeposit ?? firstChecklist?.deposit
      ),
      rating: typeof g.avgScore === "number" ? g.avgScore : undefined,
      image:
        firstPhoto ||
        "https://images.unsplash.com/photo-1495435229349-e86db7bfa013?q=80&w=1200&auto=format&fit=crop",

      // 행동용
      checkId: firstChecklist?.id,
      checkCount: Array.isArray(g.checklists) ? g.checklists.length : 0,
    };
  });
}

/* ===== 리스트 컴포넌트 ===== */
export default function ListingExact() {
  const [q, setQ] = useState("");
  const [wish, setWish] = useState(() => new Set());
  const [locationLabel, setLocationLabel] = useState("현재 위치 불러오는 중…");
  const [geoError, setGeoError] = useState("");

  const [items, setItems] = useState([]); // 서버/더미 데이터
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  // ▼ 지도 페이지와 동일한 칩 UX
  const ROOM_TYPE_OPTIONS = ["원룸", "투룸", "3개이상"];
  const [roomTypeSheetOpen, setRoomTypeSheetOpen] = useState(false);
  const [roomType, setRoomType] = useState(null); // 현재 서버 필터에는 미사용

  const TX_OPTIONS = ["월세", "전세"];
  const [txTypeSheetOpen, setTxTypeSheetOpen] = useState(false);
  const [txType, setTxType] = useState(null); // "월세" | "전세" | null(전체)

  const navigate = useNavigate();

  /* :has() 미지원 폴백 */
  useEffect(() => {
    if (CSS?.supports?.("selector(:has(*))")) return;
    const footer = document.querySelector("main + footer");
    const prev = footer?.style.display ?? "";
    if (footer) footer.style.display = "none";
    return () => {
      if (footer) footer.style.display = prev;
    };
  }, []);

  /* ===== 위치(역지오코딩) — 지도 페이지와 같은 라벨 UX ===== */
  useEffect(() => {
    let cancelled = false;
    const ac = new AbortController();

    const pickSGG = (a = {}) => {
      const ordered = [
        a.city_district,
        a.state_district,
        a.district,
        a.county,
        a.city,
        a.town,
        a.municipality,
        a.region,
        a.province,
        a.state,
      ]
        .map((v) => (typeof v === "string" ? v.trim() : ""))
        .filter(Boolean);
      const withSuffix = ordered.filter((v) => /(자치구|시|군|구)$/.test(v));
      return withSuffix[0] || ordered[0] || "";
    };
    const pickDong = (a = {}) => {
      const ordered = [
        a.neighbourhood,
        a.neighborhood,
        a.village,
        a.town,
        a.borough,
        a.suburb,
        a.quarter,
        a.hamlet,
      ]
        .map((v) => (typeof v === "string" ? v.trim() : ""))
        .filter(Boolean);
      const withSuffix = ordered.filter((v) => /(동|읍|면|리|가)$/.test(v));
      return withSuffix[0] || ordered[0] || "";
    };
    const formatKoAddress = (addr = {}) => {
      const sgg = pickSGG(addr);
      const dong = pickDong(addr);
      if (!sgg && !dong) return "";
      if (sgg && dong && sgg === dong) return sgg;
      return [sgg, dong].filter(Boolean).join(" ");
    };

    const reverseGeocode = async (lat, lon) => {
      try {
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=jsonv2&accept-language=ko&zoom=16`;
        const res = await fetch(url, {
          headers: { Accept: "application/json" },
          ...(ac?.signal ? { signal: ac.signal } : {}),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (cancelled) return;
        const label = formatKoAddress(data.address);
        setLocationLabel(label || "내 위치");
        setGeoError("");
      } catch (e) {
        if (cancelled) return;
        swallow(e);
        setLocationLabel("내 위치");
        setGeoError("주소를 불러오지 못했어요");
      }
    };

    if (!("geolocation" in navigator)) {
      setLocationLabel("내 위치");
      setGeoError("이 브라우저는 위치를 지원하지 않아요");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => reverseGeocode(pos.coords.latitude, pos.coords.longitude),
      (err) => {
        setLocationLabel("내 위치");
        setGeoError(
          err?.code === 1 ? "위치 권한을 허용해주세요" : "위치를 가져오지 못했어요"
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );

    return () => {
      cancelled = true;
      ac.abort();
    };
  }, []);

  /* ===== 서버 목록 가져오기 (더미 사용시 스킵/대체) ===== */
  useEffect(() => {
    const ac = new AbortController();
    const LIST_ENDPOINT = "/api/checklists";

    (async () => {
      try {
        setLoading(true);
        setErrMsg("");

        if (FORCE_DUMMY) {
          setItems(normalizeList(DUMMY_GROUPS));
          return;
        }

        const url = withBase(LIST_ENDPOINT);
        const headers = { Accept: "application/json" };
        const t = getToken();
        if (t) headers.Authorization = t.startsWith("Bearer ") ? t : `Bearer ${t}`;

        const res = await fetch(url, {
          method: "GET",
          credentials: "omit",
          headers,
          ...(ac?.signal ? { signal: ac.signal } : {}),
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`목록 조회 실패 (HTTP ${res.status})`);
        }

        const json = await res.json();
        setItems(normalizeList(json));
      } catch (e) {
        // 요청 취소는 조용히 무시
        if (e?.name === "AbortError" || ac.signal.aborted) return;
        // 서버 실패 → 더미로 폴백
        setItems(normalizeList(DUMMY_GROUPS));
        setErrMsg(""); // 폴백했으니 사용자에겐 에러 숨김(필요시 메시지 유지)
        swallow(e);
      } finally {
        setLoading(false);
      }
    })();

    return () => ac.abort();
  }, []);

  /* ===== 검색 + 거래유형 필터 ===== */
  const filtered = useMemo(() => {
    const kw = q.trim().toLowerCase();
    let list = items;

    if (txType === "월세") {
      list = list.filter((x) => Number(x.monthly) > 0);
    } else if (txType === "전세") {
      list = list.filter(
        (x) => Number(x.monthly) === 0 && Number(x.deposit) > 0
      );
    }

    if (!kw) return list;
    return list.filter(
      (x) =>
        (x.title || "").toLowerCase().includes(kw) ||
        (x.addr || "").toLowerCase().includes(kw) ||
        (x.dealText || "").toLowerCase().includes(kw)
    );
  }, [q, items, txType]);

  const toggleWish = (id) => {
    const n = new Set(wish);
    n.has(id) ? n.delete(id) : n.add(id);
    setWish(n);
  };

  const handleCardClick = (it) => {
    if (it?.checkId != null) {
      navigate(`/myhomedetailpage/${it.checkId}`);
    }
  };

  return (
    <Wrap>
      <HideBottomNavGlobal />
      <HideBottomNavToken />

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

      {/* 위치 */}
      <Section>
        <LocTitle>{locationLabel}</LocTitle>
        <LocSub>
          평균 평점 <StarIcon />{" "}
          <b>
            {Number.isFinite(filtered?.[0]?.rating)
              ? filtered[0].rating.toFixed?.(1)
              : "—"}
          </b>
          {geoError && <ErrorDot title={geoError} />}
        </LocSub>
      </Section>

      {/* 칩 */}
      <Chips>
        <Chip
          $active={!!roomType}
          onClick={() => setRoomTypeSheetOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={roomTypeSheetOpen}
        >
          {roomType ?? "방크기"} <Caret />
        </Chip>

        <Chip
          $active={!!txType}
          onClick={() => setTxTypeSheetOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={txTypeSheetOpen}
        >
          {txType ?? "거래유형/가격"} <Caret />
        </Chip>
      </Chips>

      {/* 검색 */}
      <Search>
        <SearchIcon />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="지역, 대학, 건물 등"
        />
      </Search>

      {/* 에러/로딩 */}
      {errMsg && <Alert role="alert">오류: {errMsg}</Alert>}
      {loading && <Hint>불러오는 중…</Hint>}

      {/* 리스트 */}
      <List>
        {filtered.map((it) => {
          const clickable = Boolean(it.checkId);
          const manageText =
            typeof it.manage === "number" ? `${it.manage.toLocaleString()}만원` : "-";
          const ratingText =
            typeof it.rating === "number" ? it.rating.toFixed(1) : "—";

          return (
            <Card
              key={it.key}
              onClick={() => handleCardClick(it)}
              $clickable={clickable}
              title={clickable ? "상세보기로 이동" : undefined}
            >
              <Thumb style={{ backgroundImage: `url(${it.image})` }} />
              <Info>
                <Addr>{it.addr || "주소 미상"}</Addr>
                <Name>{it.title}</Name>
                <RatingRow>
                  <SmallStar /> <span>{ratingText}</span>
                </RatingRow>
                <Meta>
                  {typeof it.area === "number" ? `${it.area}m²` : "면적 정보 없음"}
                  {" · "}관리비 {manageText}
                </Meta>
                <Deal>{it.dealText}</Deal>
                {it.checkCount > 1 && (
                  <SmallNote>{it.checkCount}개의 체크리스트</SmallNote>
                )}
              </Info>
              <WishBtn
                aria-label="wish"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWish(it.key);
                }}
                $on={wish.has(it.key)}
              >
                {wish.has(it.key) ? <BookmarkFill /> : <BookmarkOutline />}
              </WishBtn>
            </Card>
          );
        })}
      </List>

      {/* 지도보기 버튼 */}
      <MapFab onClick={() => navigate("/map")} aria-label="지도보기로 이동" title="지도보기">
        <PinIconWhiteLg />
        지도보기 ({filtered.length})
      </MapFab>

      {/* ================= 바텀 시트: 방크기 ================= */}
      {roomTypeSheetOpen && (
        <SheetBackdrop onClick={() => setRoomTypeSheetOpen(false)} role="dialog" aria-modal="true">
          <Sheet onClick={(e) => e.stopPropagation()}>
            <SheetHandle />
            <SheetTitle>방크기</SheetTitle>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {ROOM_TYPE_OPTIONS.map((opt) => {
                const active = roomType === opt;
                return (
                  <li key={opt}>
                    <SheetItem
                      onClick={() => {
                        setRoomType(opt);
                        setRoomTypeSheetOpen(false);
                      }}
                    >
                      <span>{opt}</span>
                      {active && <CheckIcon />}
                    </SheetItem>
                  </li>
                );
              })}
            </ul>
            <div style={{ height: 8 }} />
          </Sheet>
        </SheetBackdrop>
      )}

      {/* ================= 바텀 시트: 거래유형/가격 ================= */}
      {txTypeSheetOpen && (
        <SheetBackdrop onClick={() => setTxTypeSheetOpen(false)} role="dialog" aria-modal="true">
          <Sheet onClick={(e) => e.stopPropagation()}>
            <SheetHandle />
            <SheetTitle>거래유형</SheetTitle>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {TX_OPTIONS.map((opt) => {
                const active = txType === opt;
                return (
                  <li key={opt}>
                    <SheetItem
                      onClick={() => {
                        setTxType(opt);
                        setTxTypeSheetOpen(false);
                      }}
                    >
                      <span>{opt}</span>
                      {active && <CheckIcon />}
                    </SheetItem>
                  </li>
                );
              })}
            </ul>
            <div style={{ height: 8 }} />
          </Sheet>
        </SheetBackdrop>
      )}
    </Wrap>
  );
}

/* ===== styled ===== */
const Wrap = styled.div`
  min-height: 100dvh;
  background: ${C.bg};
  color: ${C.text};
  padding-bottom: 20px;
`;

const TopBar = styled.header`
  position: sticky;
  top: 0;
  z-index: 20;
  height: ${S.headerH}px;
  border-bottom: 1px solid ${C.line};
  display: grid;
  grid-template-columns: 56px 1fr 56px;
  align-items: center;
  background: #fff;
`;
const TopTitle = styled.div`justify-self: center; font-weight: 800;`;
const IconBtn = styled.button`
  border: 0;
  background: transparent;
  display: grid;
  place-items: center;
  height: 100%;
  cursor: pointer;
`;

const Section = styled.div`padding: 8px ${S.padX}px 0;`;
const LocTitle = styled.div`font-size: 22px; font-weight: 800; margin-top: 6px;`;
const LocSub = styled.div`
  color: ${C.sub};
  font-size: 13px;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
`;
const ErrorDot = styled.span`width: 6px; height: 6px; border-radius: 50%; background: #ef4444; display: inline-block;`;

const Chips = styled.div`display: flex; gap: 8px; padding: 8px ${S.padX}px 0; overflow-x: auto;`;
const Chip = styled.button`
  border: 1px solid ${(p) => (p.$active ? C.blueLine : C.chipLine)};
  background: ${(p) => (p.$active ? C.blue : "#fff")};
  border-radius: ${R.chip}px;
  padding: 10px 12px;
  font-size: 13px;
  font-weight: 700;
  color: ${(p) => (p.$active ? "#fff" : C.text)};
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  cursor: pointer;
  transition: background .15s ease, color .15s ease, border-color .15s ease;
`;

const Search = styled.div`
  margin: 8px ${S.padX}px 0;
  background: ${C.soft};
  border: 1px solid ${C.line};
  border-radius: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  input {
    border: 0;
    outline: none;
    flex: 1;
    background: transparent;
    font-size: 14px;
    color: ${C.text};
    ::placeholder {
      color: #9aa0a6;
    }
  }
`;

const Alert = styled.div`
  margin: 8px ${S.padX}px 0;
  padding: 10px 12px;
  border: 1px solid #fecaca;
  background: #fff1f2;
  color: #b91c1c;
  border-radius: 10px;
  font-size: 13px;
`;
const Hint = styled.div`margin: 8px ${S.padX}px; color: ${C.sub}; font-size: 13px;`;

const List = styled.div`display: grid; gap: ${S.gap}px; padding: 8px ${S.padX}px 88px;`;

const Card = styled.article`
  display: grid;
  grid-template-columns: 112px 1fr 28px;
  gap: 12px;
  padding: 10px;
  background: #fff;
  border: 1px solid #eef1f6;
  border-radius: ${R.card}px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  cursor: ${(p) => (p.$clickable ? "pointer" : "default")};
`;
const Thumb = styled.div`
  width: 112px;
  height: 96px;
  border-radius: ${R.img}px;
  background-size: cover;
  background-position: center;
`;
const Info = styled.div`display: grid; align-content: start; gap: 4px;`;
const Addr = styled.div`color: ${C.sub}; font-size: 12px;`;
const Name = styled.div`font-weight: 800; font-size: 16px;`;
const RatingRow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 700;
  color: #374151;
`;
const Meta = styled.div`font-size: 12px; color: ${C.sub};`;
const Deal = styled.div`font-weight: 900; margin-top: 2px;`;
const SmallNote = styled.div`font-size: 11px; color: ${C.sub};`;
const WishBtn = styled.button`
  border: 0;
  background: transparent;
  cursor: pointer;
  align-self: start;
  color: ${(p) => (p.$on ? C.blue : "#9aa0a6")};
`;

/* 지도보기 버튼 */
const MapFab = styled.button`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: calc(24px + env(safe-area-inset-bottom, 0px));
  z-index: 50;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  height: 40px;
  padding: 0 18px;
  border: 0;
  border-radius: 9999px;
  background: ${C.blue};
  color: #fff;
  font-weight: 900;
  font-size: 16px;
  letter-spacing: -0.2px;
  box-shadow: 0 10px 20px rgba(12,122,233,.35), 0 4px 10px rgba(0,0,0,.12), 0 0 0 2px #fff;
  transition: transform 0.08s ease, box-shadow 0.12s ease, filter 0.12s ease;
  &:active {
    transform: translateX(-50%) scale(0.98);
    filter: brightness(0.98);
  }
`;

/* ===== Bottom Sheet ===== */
const SheetBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.35);
  display: grid;
  align-items: end;
`;
const Sheet = styled.div`
  background: #fff;
  border-top-left-radius: 18px;
  border-top-right-radius: 18px;
  border: 1px solid ${C.line};
  padding: 12px 12px 16px;
  max-height: 70dvh;
`;
const SheetHandle = styled.div`
  display: grid;
  place-items: center;
  padding-top: 4px;
  padding-bottom: 10px;
  &::after {
    content: "";
    width: 40px;
    height: 4px;
    background: #e5e7eb;
    border-radius: 999px;
    display: block;
  }
`;
const SheetTitle = styled.div`font-weight: 800; padding: 0 4px 8px;`;
const SheetItem = styled.button`
  width: 100%;
  text-align: left;
  padding: 14px 10px;
  border: 0;
  background: transparent;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  cursor: pointer;
  font-size: 15px;
  font-weight: 700;
  color: ${C.text};
`;

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
    <path
      d="M20 6L9 17l-5-5"
      fill="none"
      stroke="#4C8DFF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ===== Icons ===== */
function ChevronLeft(props) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" {...props}>
      <path
        d="M15 19l-7-7 7-7"
        stroke="#111827"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function BookmarkOutline(props) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" {...props}>
      <path
        d="M6 4h12v16l-6-3-6 3V4z"
        fill="none"
        stroke="#111827"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function BookmarkFill(props) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" {...props}>
      <path d="M6 4h12v16l-6-3-6 3V4z" fill={C.blue} />
    </svg>
  );
}
function StarIcon(props) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" {...props}>
      <path
        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z"
        fill="#3B82F6"
      />
    </svg>
  );
}
const SmallStar = (props) => <StarIcon {...props} />;
function Caret(props) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" {...props}>
      <path
        d="M7 10l5 5 5-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function SearchIcon(props) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" {...props}>
      <circle cx="11" cy="11" r="7" stroke="#9AA0A6" strokeWidth="2" fill="none" />
      <path d="M21 21l-4.3-4.3" stroke="#9AA0A6" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function PinIconWhiteLg(props) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...props}>
      <path
        d="M12 2C8.7 2 6 4.6 6 7.9c0 4.5 6 12.2 6 12.2s6-7.7 6-12.2C18 4.6 15.3 2 12 2zm0 8.2a3 3 0 110-6 3 3 0 010 6z"
        fill="#ffffff"
      />
    </svg>
  );
}
