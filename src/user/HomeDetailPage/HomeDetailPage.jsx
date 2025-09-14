// HomeDetailPage.jsx
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { NavLink, useParams, useLocation, useNavigate } from "react-router-dom";

/* ── 디자인 토큰 ── */
const C = { bg:"#fff", line:"#E7EDF5", soft:"#F8FAFF", text:"#0F172A", sub:"#6B7280", blue:"#4C8DFF", overlay:"rgba(14,18,27,.5)", star: "#3B82F6" };
const R = { img:12, card:12, pill:999 };
const S = { headerH:56, padX:16 };
const I = { text: "#0F172A", sub: "#464A4D" };

/* ── 유틸 ── */
const fmtWonUnit = (n) => (typeof n === "number" ? n.toLocaleString() : "—");
const fmtPriceText = (deposit, monthly) => {
  const hasD = typeof deposit === "number";
  const hasM = typeof monthly === "number";
  if (!hasD && !hasM) return "가격 정보 없음";
  if (!hasD) return `월세 ?/${fmtWonUnit(monthly)}`;
  if (!hasM) return `보증금 ${fmtWonUnit(deposit)}`;
  return `월세 ${fmtWonUnit(deposit)}/${fmtWonUnit(monthly)}`;
};
const fmtSpecText = (sqm, mFee) => {
  const a = typeof sqm === "number" ? `${sqm}㎡` : null;
  const b = typeof mFee === "number" ? `관리비 ${fmtWonUnit(mFee)}만원` : null;
  if (a && b) return `${a} ${b}`;
  return a || b || "정보 없음";
};
const toErrorMessage = (e) => {
  try {
    if (e instanceof Error) return e.message || "오류가 발생했습니다.";
    if (typeof e === "string") return e;
    const s = JSON.stringify(e);
    return s || "오류가 발생했습니다.";
  } catch {
    return "오류가 발생했습니다.";
  }
};
const toNum = (v) => (typeof v === "number" ? v : (Number.isFinite(Number(v)) ? Number(v) : undefined));

/* 배열 응답에서 적절 항목 선택 */
const ID_TO_NAME = {
  "cc-01":"가재울아이파크 3단지",
  "cc-02":"DMC 파크뷰자이",
  "cc-03":"래미안 e편한세상 가재울",
  "cc-04":"홍은 래미안 에코포레",
};
function selectFromArray(arr, payloadId) {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  const safe = arr.filter((x) => x && typeof x === "object");
  if (!safe.length) return null;
  const byId = safe.find((x) => String(x?.id ?? "") === String(payloadId));
  if (byId) return byId;
  const name = ID_TO_NAME[payloadId];
  if (name) {
    const byName = safe.find((x) => (x?.latestName ?? x?.name) === name);
    if (byName) return byName;
  }
  return safe[0];
}
function normalizeData(raw) {
  if (!raw || typeof raw !== "object") return null;
  const n = { ...raw };
  ["latestMonthly","latestDeposit","latestMaintenanceFee","latestFloorAreaSqm","avgScore"].forEach((k) => {
    if (k in n && typeof n[k] !== "number") {
      const v = toNum(n[k]);
      if (v !== undefined) n[k] = v; else delete n[k];
    }
  });
  if (Array.isArray(n.checklists)) {
    n.checklists = n.checklists
      .filter((it) => it && typeof it === "object")
      .map((it) => ({
        ...it,
        monthly: toNum(it.monthly),
        deposit: toNum(it.deposit),
        maintenanceFee: toNum(it.maintenanceFee),
        floorAreaSqm: toNum(it.floorAreaSqm),
        score: toNum(it.score),
      }));
  } else {
    n.checklists = [];
  }
  return n;
}

/* ── 컴포넌트 ── */
export default function HomeDetailPage() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const fallbackItem = state?.item || {};

  const API_BASE = (import.meta.env?.VITE_API_BASE || "").replace(/\/+$/,"");
  const withBase = (p) => `${API_BASE}${p}`;

  const [menuOpen, setMenuOpen] = useState(false);
  const btnRef = useRef(null);
  const menuRef = useRef(null);
  const firstItemRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [data, setData] = useState(null);
  const [deleting, setDeleting] = useState(false);

  /* 데이터 로드 */
  useEffect(() => {
    const ac = new AbortController();

    const safeFetchJSON = async (url) => {
      try {
        const res = await fetch(url, {
          method: "GET",
          credentials: "include",
          headers: { Accept: "application/json" },
          signal: ac.signal,
        });
        if (!res.ok) return null;

        const text = await res.text();
        if (!text) return null;

        try {
          return JSON.parse(text);
        } catch {
          // HTML/텍스트 응답은 무시
          return null;
        }
      } catch {
        // 네트워크/Abort → null
        return null;
      }
    };

    const fetchChecklist = async (payloadId) => {
      const urls = [
        withBase(`/api/checklists/${encodeURIComponent(payloadId)}`),
        withBase(`/api/checklists?id=${encodeURIComponent(payloadId)}`),
        withBase(`/api/checklists`),
      ];

      let lastArray = null;
      for (const u of urls) {
        const json = await safeFetchJSON(u);
        if (!json) continue;

        if (Array.isArray(json)) {
          lastArray = json;
          const pick = selectFromArray(json, payloadId);
          if (pick) return pick;
          continue;
        }
        if (json && typeof json === "object") {
          return json;
        }
      }
      if (Array.isArray(lastArray) && lastArray.length) {
        return selectFromArray(lastArray, payloadId);
      }
      return null;
    };

    (async () => {
      if (!id) {
        if (!ac.signal.aborted) {
          setLoading(false);
          setErrorMsg("유효한 매물 ID가 없습니다.");
        }
        return;
      }
      if (!ac.signal.aborted) { setLoading(true); setErrorMsg(""); }

      const payload = await fetchChecklist(id);
      if (ac.signal.aborted) return;

      if (!payload) {
        setData(null);
        setErrorMsg("체크리스트 데이터를 불러오지 못했습니다.");
      } else {
        setData(normalizeData(payload));
        setErrorMsg("");
      }
      setLoading(false);
    })();

    return () => ac.abort();
  }, [id]); // API_BASE는 빌드 타임 값으로 가정

  /* 표시 값 */
  const DEFAULT_PHOTO = "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=1600&auto=format&fit=crop";
  const photo         = fallbackItem.사진 || DEFAULT_PHOTO;
  const aptNm         = (data?.latestName ?? data?.name ?? fallbackItem.aptNm) || "—";
  const address       = (data?.address ?? fallbackItem.address) || "—";
  const addressDetail = fallbackItem.addressDetail || "";

  const priceText = fmtPriceText(data?.latestDeposit, data?.latestMonthly) || (fallbackItem.price ?? "—");
  const specText  = fmtSpecText(data?.latestFloorAreaSqm, data?.latestMaintenanceFee) || (fallbackItem.spec ?? "—");
  const avgText   =
    typeof data?.avgScore === "number" ? data.avgScore.toFixed(1) :
    typeof fallbackItem.avg === "number" ? String(fallbackItem.avg) : "—";

  const checklists = Array.isArray(data?.checklists) ? data.checklists : [];
  const leftList  = checklists.filter((_, i) => i % 2 === 0);
  const rightList = checklists.filter((_, i) => i % 2 === 1);

  /* 메뉴 접근성 */
  useEffect(() => {
    const onDocClick = (e) => {
      if (!menuOpen) return;
      const t = e.target;
      if (menuRef.current && !menuRef.current.contains(t) &&
          btnRef.current && !btnRef.current.contains(t)) {
        setMenuOpen(false);
      }
    };
    const onKey = (e) => { if (e.key === "Escape") setMenuOpen(false); };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  useEffect(() => { if (menuOpen) firstItemRef.current?.focus(); }, [menuOpen]);

  const onMenuKeyDown = (e) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const items = menuRef.current?.querySelectorAll('button[role="menuitem"]');
    const list = items ? Array.from(items) : [];
    const idx = list.findIndex((el) => el === document.activeElement);
    const next = e.key === "ArrowDown" ? (idx + 1) % list.length : (idx - 1 + list.length) % list.length;
    if (list[next]) list[next].focus();
  };

  /* 삭제: DELETE /api/checklists/{checkId} */
  const onDelete = async () => {
    const checkId =
      (data && (data.id ?? data.checkId)) ??
      id ??
      (Array.isArray(data?.checklists) && data.checklists[0]?.id);

    if (!checkId) {
      window.alert("삭제할 checkId를 찾지 못했습니다.");
      return;
    }
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    setDeleting(true);
    setMenuOpen(false);
    try {
      const res = await fetch(
        withBase(`/api/checklists/${encodeURIComponent(checkId)}`),
        {
          method: "DELETE",
          credentials: "include",
          headers: { Accept: "application/json" },
        }
      );

      if (!res.ok) {
        let msg = `삭제 실패 (HTTP ${res.status})`;
        try {
          const text = await res.text();
          if (text) {
            try {
              const j = JSON.parse(text);
              if (j && typeof j === "object" && j.message) msg = `삭제 실패: ${j.message}`;
              else msg = `삭제 실패: ${text}`;
            } catch {
              msg = `삭제 실패: ${text}`;
            }
          }
        } catch { /* ignore */ }
        window.alert(msg);
        setDeleting(false);
        return;
      }

      window.alert("삭제가 완료되었습니다.");
      navigate("/listingpage", { replace: true });
    } catch (e) {
      // ← 여기서는 에러 객체를 실제로 사용하므로 no-unused-vars 경고 없음
      const msg = toErrorMessage(e);
      try { window.alert(msg); } catch { /* ignore */ }
    } finally {
      setDeleting(false);
    }
  };

  const onEdit = () => { setMenuOpen(false); /* navigator("/checklist") */ };

  /* 렌더 */
  return (
    <Wrap>
      <TopBar>
        <IconBtn aria-label="back" onClick={() => window.history.back()}><ChevronLeft/></IconBtn>
        <Title>상세보기</Title>
        <IconBtn aria-hidden />
      </TopBar>

      <Section>
        <HeroBox>
          <Hero src={photo} alt={aptNm} />
        </HeroBox>
      </Section>

      <Tabs>
        <TabLink to={`/homedetailpage/${id ?? ""}`} end>상세보기</TabLink>
        <TabLink to="/leasechecklistpage" end>집 계약 체크리스트</TabLink>
      </Tabs>

      {loading && <Loading>불러오는 중...</Loading>}
      {!loading && errorMsg && <ErrorBox>오류: {errorMsg}</ErrorBox>}

      <Card aria-busy={loading || deleting}>
        <HeadTitle>
          <HeadTitleText>{priceText}</HeadTitleText>
          <HeadTitleActions>
            <IconButton
              ref={btnRef}
              aria-label="옵션 열기"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-controls="card-menu"
              onClick={() => setMenuOpen((v) => !v)}
              disabled={deleting}
              title={deleting ? "삭제 중…" : "옵션"}
            >
              <GearIcon />
            </IconButton>
            {menuOpen && (
              <Menu id="card-menu" role="menu" ref={menuRef} onKeyDown={onMenuKeyDown}>
                <MenuItem ref={firstItemRef} role="menuitem" onClick={onEdit}>수정</MenuItem>
                <MenuDivider />
                <MenuItem role="menuitem" data-danger onClick={onDelete} disabled={deleting}>
                  {deleting ? "삭제 중…" : "삭제"}
                </MenuItem>
              </Menu>
            )}
          </HeadTitleActions>
        </HeadTitle>

        <RoomInfo>{specText}</RoomInfo>
        <RoomName>{aptNm}</RoomName>
        <RoomAdress>{address}</RoomAdress>
        {addressDetail ? <RoomAdressDetail>{addressDetail}</RoomAdressDetail> : null}
        <Average><StarIcon /> <b>평균 {avgText}</b></Average>
      </Card>

      <ListTitle>체크리스트</ListTitle>
      <ListCard>
        <ListCardLeft>
          {leftList.length === 0 && !loading && <EmptyHint>체크리스트가 없습니다.</EmptyHint>}
          {leftList.map((it) => (
            <ListMenu key={String(it?.id ?? it?.name ?? `L-${Math.random()}`)}>
              {it?.name ?? "항목"}<span>{typeof it?.score === "number" ? `${it.score}점` : "—"}</span>
            </ListMenu>
          ))}
        </ListCardLeft>
        <ListCardRight>
          {rightList.map((it) => (
            <ListMenu key={String(it?.id ?? it?.name ?? `R-${Math.random()}`)}>
              {it?.name ?? "항목"}<span>{typeof it?.score === "number" ? `${it.score}점` : "—"}</span>
            </ListMenu>
          ))}
        </ListCardRight>
      </ListCard>

      <MemoTitle>메모</MemoTitle>
      <MemoArea>
        <textarea placeholder="작성한 메모가 없습니다."></textarea>
      </MemoArea>
    </Wrap>
  );
}

/* ── styled-components ── */
const Wrap = styled.div`min-height:100dvh;background:${C.bg};color:${C.text};`;
const TopBar = styled.header`
  position:sticky;top:0;z-index:10;height:${S.headerH}px;
  display:grid;grid-template-columns:56px 1fr 56px;align-items:center;
  border-bottom:1px solid ${C.line};background:#fff;
`;
const Title = styled.div`justify-self:center;font-weight:800;`;
const IconBtn = styled.button`border:0;background:transparent;height:100%;display:grid;place-items:center;cursor:pointer;`;

const Section = styled.div`padding:12px ${S.padX}px 0;`;
const HeroBox = styled.div`border:1px solid ${C.line};border-radius:${R.img}px;overflow:hidden;background:#fff;`;
const Hero = styled.img`width:100%;aspect-ratio:16/10;object-fit:cover;display:block;`;

const Tabs = styled.nav`
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 10px ${S.padX}px 0;
  border-bottom: 1px solid ${C.line};
  background: #fff;
`;
const TabLink = styled(NavLink)`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 44px;
  font-weight: 700;
  color: ${C.sub};
  text-decoration: none;
  &::after { content:""; position:absolute; left:0; right:0; bottom:-1px; height:2px; background:transparent; border-radius:2px; }
  &[aria-current="page"] { color:${C.blue}; }
`;

const Loading = styled.div`margin:8px ${S.padX}px 0; color:${C.sub}; font-size:14px;`;
const ErrorBox = styled.div`
  margin:8px ${S.padX}px 0; padding:8px 10px; border:1px solid #fecaca;
  background:#fff1f2; color:#b91c1c; border-radius:8px; font-size:13px;
`;

const Card = styled.section`
  position:relative; margin:12px ${S.padX}px; padding:12px; background:#fff;
  border:1px solid ${C.line}; border-radius:${R.card}px; margin-top:5%;
`;
const HeadTitle = styled.h2`
  display:flex; align-items:center; gap:10px; margin:0; font-weight:800; letter-spacing:-0.2px;
  font-size:20px; line-height:1.25; color:${I.text}; padding-right:40px;
`;
const HeadTitleText = styled.span`min-width:0; flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;`;
const HeadTitleActions = styled.div`position:absolute; top:12px; right:12px; display:flex; align-items:center; gap:8px; z-index:2;`;

const IconButton = styled.button`
  display:inline-flex; align-items:center; justify-content:center; width:28px; height:28px;
  border:0; border-radius:8px; background:transparent; color:${C.sub}; cursor:pointer; &:hover{opacity:.85;} svg{display:block;}
`;
const Menu = styled.div`
  position:absolute; top:25px; right:0; width:96px; background:#fff; border:1px solid ${C.line};
  border-radius:10px; padding:6px 0; box-shadow:0 8px 24px rgba(0,0,0,.08); z-index:3;
`;
const MenuItem = styled.button`
  display:flex; width:100%; justify-content:center; align-items:center; padding:6px 10px;
  background:transparent; border:0; border-radius:8px; color:${C.text}; font-size:12px; cursor:pointer;
  &:hover{background:${C.soft};} &[data-danger]{color:#ef4444;}
  &:disabled{opacity:.6; cursor:not-allowed;}
`;
const MenuDivider = styled.hr`border:0; height:1px; background:${C.line}; margin:6px 8px;`;

const RoomInfo = styled.div`font-size:18px; font-weight:bold;`;
const RoomName = styled.div`font-size:16px;`;
const RoomAdress = styled.div`font-size:14px; color:gray;`;
const RoomAdressDetail = styled.div`font-size:14px; color:gray;`;
const Average = styled.div`display:flex; justify-content:flex-end; align-items:center; font-size:14px;`;

const ListTitle = styled.div`display:flex; margin:12px ${S.padX}px; padding:5px;`;
const ListCard = styled.div`
  display:grid; grid-template-columns:1fr 1fr; gap:16px; margin:0 ${S.padX}px 12px;
  @media (max-width:520px){ grid-template-columns:1fr; }
`;
const ListCommon = `
  min-height:15vh; border:1px solid ${C.line}; border-radius:${R.card}px; padding:14px;
  display:flex; flex-direction:column; gap:8px; box-sizing:border-box;
`;
const ListCardLeft  = styled.div`${ListCommon}`;
const ListCardRight = styled.div`${ListCommon}`;
const ListMenu = styled.div`display:flex; width:100%; justify-content:space-between; span{color:${C.blue}; font-weight:bold;}`;
const EmptyHint = styled.div`color:${C.sub}; font-size:13px; padding:4px 0;`;

const MemoTitle = styled.div`display:flex; margin:10px ${S.padX}px; padding:5px;`;
const MemoArea = styled.div`
  display:flex; justify-content:center;
  textarea{
    width:85%; height:10vh; margin-bottom:30%; border:1px solid ${C.line};
    border-radius:${R.card}px; padding:3%; color:#464A4D; resize:none;
  }
`;

/* icons */
function ChevronLeft(){
  return (
    <svg width="22" height="22" viewBox="0 0 24 24">
      <path d="M15 19l-7-7 7-7" stroke="#111827" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function GearIcon(props){
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M7.83403 5.33333C6.45322 5.33333 5.33403 6.45252 5.33403 7.83333C5.33403 9.21414 6.45322 10.3333 7.83403 10.3333C9.21483 10.3333 10.334 9.21414 10.334 7.83333C10.334 6.45252 9.21483 5.33333 7.83403 5.33333ZM6.33403 7.83333C6.33403 7.00481 7.0055 6.33333 7.83403 6.33333C8.66255 6.33333 9.33403 7.00481 9.33403 7.83333C9.33403 8.66186 8.66255 9.33333 7.83403 9.33333C7.0055 9.33333 6.33403 8.66186 6.33403 7.83333Z" fill="currentColor"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M6.83335 0.666016C6.58586 0.666016 6.37561 0.847069 6.33889 1.09182L6.05522 2.98218C5.92082 3.03098 5.78868 3.0852 5.65917 3.14495L4.12317 2.0099C3.92414 1.86282 3.64746 1.88347 3.47246 2.05846L2.05846 3.47246C1.88347 3.64746 1.86282 3.92414 2.0099 4.12317L3.14503 5.65927C3.08533 5.78888 3.03124 5.92097 2.98249 6.05517L1.09182 6.33889C0.847069 6.37561 0.666016 6.58586 0.666016 6.83335V8.83335C0.666016 9.08084 0.847069 9.29109 1.09182 9.32781L2.98218 9.61148C3.03098 9.74588 3.0852 9.87801 3.14495 10.0075L2.0099 11.5435C1.86282 11.7426 1.88347 12.0192 2.05846 12.1942L3.47246 13.6082C3.64746 13.7832 3.92414 13.8039 4.12317 13.6568L5.65927 12.5217C5.78888 12.5814 5.92097 12.6355 6.05517 12.6842L6.33889 14.5749C6.37561 14.8196 6.58586 15.0007 6.83335 15.0007H8.83335C9.08084 15.0007 9.29109 14.8196 9.32781 14.5749L9.61148 12.6845C9.74588 12.6357 9.87801 12.5815 10.0075 12.5217L11.5435 13.6568C11.7426 13.8039 12.0192 13.7832 12.1942 13.6082L13.6082 12.1942C13.7832 12.0192 13.8039 11.7426 13.6568 11.5435L12.5217 10.0074C12.5814 9.87782 12.6355 9.74572 12.6842 9.61153L14.5749 9.32781C14.8196 9.29109 15.0007 9.08084 15.0007 8.83335V6.83335C15.0007 6.58586 14.8196 6.37561 14.5749 6.33889L12.6845 6.05522C12.6357 5.92082 12.5815 5.78868 12.5218 5.65917L13.6568 4.12317C13.8039 3.92414 13.7832 3.64746 13.6082 3.47246L12.1942 2.05846C12.0192 1.88347 11.7426 1.86282 11.5435 2.0099L10.0074 3.14503C9.87782 3.08533 9.74572 3.03124 9.61153 2.98249L9.32781 1.09182C9.29109 0.847069 9.08084 0.666016 8.83335 0.666016H6.83335Z" fill="currentColor"/>
    </svg>
  );
}
function StarIcon(props){
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" {...props}>
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z" fill={C.star}/>
    </svg>
  );
}
