// LeaseChecklistPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { NavLink, useLocation } from "react-router-dom";

/* 디자인 토큰 */
const C = {
  bg: "#fff",
  line: "#E7EDF5",
  soft: "#F8FAFF",
  text: "#0F172A",
  sub: "#6B7280",
  blue: "#3299FF",
  overlay: "rgba(14,18,27,.5)",
};
const R = { img: 12, card: 12, pill: 999 };
const S = { headerH: 56, padX: 16, bottomPad: 88 };

/** ===== 체크리스트 데이터 (공통/월세/전세) ===== */
const COMMON = [
  { id: "c1",  title: "최신 등기부등본 확인", what: "소유자·주소 일치, 발급일자(당일 재확인)", why: "실소유자와 계약 및 잔금 직전 변동 리스크 점검" },
  { id: "c2",  title: "선순위 권리(근저당 등) 확인", what: "근저당·가압류·전세권 등 선순위 내역/금액", why: "선순위 합계가 크면 보증금 손실 위험 증가" },
  { id: "c3",  title: "건축물대장/토지대장 확인", what: "용도·면적·위반건축물 여부", why: "용도위반/불법증축은 보증보험·전입 등 문제" },
  { id: "c4",  title: "시세·안전비율 점검", what: "선순위+내보증금 ≤ 주택가액 80%(권고 70%)", why: "낙찰가/시세 대비 보증금 손실 위험 관리" },
  { id: "c5",  title: "중개대상물 확인설명서/자격확인", what: "확인·설명서 교부·서명, 보장여부 확인", why: "분쟁 시 입증자료" },
  { id: "c6",  title: "당사자·대리권 확인/실명입금", what: "임대인 신분증, 대리시 위임장·인감, 임대인 계좌 송금", why: "이중계약·사칭 방지" },
  { id: "c7",  title: "표준계약서 + 필수 특약", what: "국토부 표준양식 사용·필수 특약 기재", why: "분쟁 예방·임차인 권리 보호" },
  { id: "c8",  title: "공과금·관리비 정산 기준", what: "포함/불포함·정산일·계량기 사진", why: "체납/이월 분쟁 예방" },
  { id: "c9",  title: "하자 점검 기록", what: "입주 전 사진/동영상, 수리기한·책임특약", why: "수선의무·원복범위 명확화" },
  { id: "c10", title: "신고/전입/확정일자", what: "임대차 신고 30일내, 전입 즉시, 확정일자", why: "대항력·우선변제권 확보" },
  { id: "c11", title: "분쟁·사고 대비", what: "보증보험 가입여부·분쟁조정위 숙지", why: "보증금 미반환 대비" },
];

const MONTHLY = [
  { id: "m13", title: "임대료·증액 규정", what: "월세/보증금·납부일·연체이자·갱신요구권", why: "과도한 증액·갱신 거절 예방" },
  { id: "m14", title: "관리비·주차·반려동물·소음", what: "관리규약/주차/반려 여부/소음", why: "생활 분쟁·추가비용 방지" },
  { id: "m15", title: "원상복구 범위 합의", what: "못/선반/페인트 허용·감가 기준", why: "퇴거 시 과도한 원복 요구 예방" },
];

const JEONSE = [
  { id: "j21", title: "전세보증보험 가입", what: "가입 가능여부·특약 기재(임대인 협조 의무)", why: "보증금 미반환 리스크 큰 편" },
  { id: "j22", title: "전세대출 요건/실행 일정", what: "은행/보증기관 조건·실행일과 잔금일 일치", why: "잔금일 대출 미실행 리스크" },
  { id: "j23", title: "전세가율 점검(보수적)", what: "전세가율↓, 시세 급락·경매낙찰가 고려", why: "깡통전세 리스크 최소화" },
  { id: "j24", title: "임차권등기명령/전출 전략", what: "분쟁 시 임차권등기·전출 타이밍", why: "대항력·우선변제권 유지" },
];

const DEFAULT_PHOTO =
  "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=1600&auto=format&fit=crop";

/* ===== 유틸 ===== */
const toNum = (v) => {
  if (typeof v === "number") return v;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};

const detectContractFromItem = (item) => {
  const t = String(item?.deal ?? item?.price ?? "").trim();
  if (/월세/.test(t)) return "monthly";
  if (/전세/.test(t)) return "jeonse";
  return null;
};

const ID_TO_NAME = {
  "cc-01": "가재울아이파크 3단지",
  "cc-02": "DMC 파크뷰자이",
  "cc-03": "래미안 e편한세상 가재울",
  "cc-04": "홍은 래미안 에코포레",
};

function selectFromArray(arr, payloadId) {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  const byId = arr.find((x) => String(x?.id ?? "") === String(payloadId));
  if (byId) return byId;
  const name = ID_TO_NAME[payloadId];
  if (name) {
    const byName = arr.find((x) => (x?.latestName ?? x?.name) === name);
    if (byName) return byName;
  }
  return arr[0];
}

/* ===== 메인 컴포넌트 ===== */
export default function LeaseChecklistPage() {
  const location = useLocation();
  const item = location.state?.item;
  const idFromState = location.state?.id ?? item?.id ?? null;

  const [contract, setContract] = useState(null); // 'monthly' | 'jeonse'
  const [enabled, setEnabled] = useState(true);
  const [openIds, setOpenIds] = useState(() => new Set());
  const [checked, setChecked] = useState({});
  const [loading, setLoading] = useState(true);

  // 백엔드에서 계약 유형 판별
  useEffect(() => {
    const ac = new AbortController();
    const API_BASE = (import.meta.env?.VITE_API_BASE || "").replace(/\/+$/, "");
    const withBase = (p) => `${API_BASE}${p}`;

    async function fetchOne(pid) {
      const urls = [
        withBase(`/api/checklists/${encodeURIComponent(pid)}`),
        withBase(`/api/checklists?id=${encodeURIComponent(pid)}`),
        withBase(`/api/checklists`),
      ];
      let lastArray = null;

      for (const u of urls) {
        try {
          const res = await fetch(u, {
            method: "GET",
            credentials: "include",
            headers: { Accept: "application/json" },
            signal: ac.signal,
          });
          if (!res.ok) continue;
          const text = await res.text();
          if (!text) continue;
          let json;
          try { json = JSON.parse(text); } catch { continue; }

          if (Array.isArray(json)) {
            lastArray = json;
            const pick = selectFromArray(json, pid);
            if (pick) return pick;
            continue;
          }
          if (json && typeof json === "object") return json;
        } catch {
          // 다음 URL 폴백
        }
      }
      if (Array.isArray(lastArray) && lastArray.length) {
        return selectFromArray(lastArray, pid);
      }
      return null;
    }

    (async () => {
      setLoading(true);
      let detected = null;

      if (idFromState) {
        const payload = await fetchOne(idFromState);
        if (payload) {
          const monthly = toNum(payload.latestMonthly);
          const deposit = toNum(payload.latestDeposit);
          if (typeof monthly === "number" && monthly > 0) detected = "monthly";
          else if (typeof deposit === "number" && deposit > 0) detected = "jeonse";
        }
      }

      if (!detected) detected = detectContractFromItem(item);
      if (!detected) detected = "monthly";

      if (!ac.signal.aborted) setContract(detected);
      if (!ac.signal.aborted) setLoading(false);
    })();

    return () => ac.abort();
  }, [idFromState, item]);

  // 활성 항목(공통 + 유형별)
  const activeItems = useMemo(
    () => (contract === "jeonse" ? [...COMMON, ...JEONSE] : [...COMMON, ...MONTHLY]),
    [contract]
  );

  const storageKey = (type) => `leaseChecklist_${type}`;

  // 계약유형 확정되면 해당 유형 저장값 복원
  useEffect(() => {
    if (!contract) return;
    try {
      const saved = localStorage.getItem(storageKey(contract));
      const seed = Object.fromEntries(activeItems.map((it) => [it.id, false]));
      if (!saved) {
        setChecked(seed);
        setEnabled(true);
        setOpenIds(new Set());
        return;
      }
      const parsed = JSON.parse(saved);
      const baseChecked = parsed && typeof parsed.checked === "object" ? parsed.checked : {};
      const restored = { ...seed, ...baseChecked };
      setChecked(restored);
      if (typeof parsed.enabled === "boolean") setEnabled(parsed.enabled);
      setOpenIds(new Set());
    } catch {
      const seed = Object.fromEntries(activeItems.map((it) => [it.id, false]));
      setChecked(seed);
      setEnabled(true);
      setOpenIds(new Set());
    }
  }, [contract, activeItems]);

  // 이벤트 핸들러
  const onSave = () => {
    if (!contract) return;
    setEnabled(true);
    localStorage.setItem(
      storageKey(contract),
      JSON.stringify({ enabled: true, checked, contract })
    );
    alert("저장되었습니다.");
  };

  const onReset = () => {
    if (!contract) return;
    setEnabled(true);
    const empty = Object.fromEntries(activeItems.map((it) => [it.id, false]));
    setChecked(empty);
    setOpenIds(new Set());
    localStorage.removeItem(storageKey(contract));
  };

  const toggleCheck = (id) => {
    if (!enabled) return;
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleOpen = (id) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const [whyModal, setWhyModal] = useState(null);
  const showWhy = (it) => setWhyModal({ title: it.title, why: it.why });

  return (
    <Wrap>
      <TopBar>
        <IconBtn aria-label="back" onClick={() => window.history.back()}>
          <ChevronLeft />
        </IconBtn>
        <Title>집 계약 체크리스트</Title>
        <IconBtn aria-hidden />
      </TopBar>

      {/* 매물 사진 */}
      <Section>
        <HeroBox>
          <Hero src={item?.사진 || DEFAULT_PHOTO} alt="room" />
        </HeroBox>
      </Section>

      {/* 탭 (상세보기는 id가 있으면 /:id로 이동) */}
      <Tabs>
        <TabLink to={idFromState ? `/homedetailpage/${idFromState}` : "/homedetailpage"} end>
          상세보기
        </TabLink>
        <TabLink to="/leasechecklistpage">집 계약 체크리스트</TabLink>
      </Tabs>

      {/* 본문 */}
      <Card>
        <CardHead>
          <HeadLeft>
            <TipIcon />
            <HeadTitle>살펴야 할 사항</HeadTitle>
          </HeadLeft>
          <TypeBadge title="백엔드 판별 결과">
            {loading ? "판별 중…" : contract === "jeonse" ? "전세" : "월세"}
          </TypeBadge>
        </CardHead>

        {/* 공통 */}
        <List>
          <GroupLabel>공통 체크리스트</GroupLabel>
          {COMMON.map((it) => (
            <ChecklistItem
              key={it.id}
              item={it}
              enabled={enabled}
              open={openIds.has(it.id)}
              checked={!!checked[it.id]}
              onToggleCheck={() => toggleCheck(it.id)}
              onToggleOpen={() => toggleOpen(it.id)}
              onShowWhy={() => showWhy(it)}
            />
          ))}

          {/* 유형별 */}
          {contract === "jeonse" ? (
            <>
              <GroupLabel>전세 전용</GroupLabel>
              {JEONSE.map((it) => (
                <ChecklistItem
                  key={it.id}
                  item={it}
                  enabled={enabled}
                  open={openIds.has(it.id)}
                  checked={!!checked[it.id]}
                  onToggleCheck={() => toggleCheck(it.id)}
                  onToggleOpen={() => toggleOpen(it.id)}
                  onShowWhy={() => showWhy(it)}
                />
              ))}
            </>
          ) : (
            <>
              <GroupLabel>월세 전용</GroupLabel>
              {MONTHLY.map((it) => (
                <ChecklistItem
                  key={it.id}
                  item={it}
                  enabled={enabled}
                  open={openIds.has(it.id)}
                  checked={!!checked[it.id]}
                  onToggleCheck={() => toggleCheck(it.id)}
                  onToggleOpen={() => toggleOpen(it.id)}
                  onShowWhy={() => showWhy(it)}
                />
              ))}
            </>
          )}
        </List>
      </Card>

      {/* 하단 고정 버튼 */}
      <Bottom>
        <GhostBtn onClick={onReset}>초기화</GhostBtn>
        <PrimaryBtn onClick={onSave}>저장하기</PrimaryBtn>
      </Bottom>

      {whyModal && (
        <ModalOverlay onClick={() => setWhyModal(null)}>
          <Modal role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>왜? — {whyModal.title}</ModalTitle>
              <CloseBtn aria-label="닫기" onClick={() => setWhyModal(null)}>×</CloseBtn>
            </ModalHeader>
            <ModalBody>{whyModal.why}</ModalBody>
            <ModalFooter>
              <ModalAction onClick={() => setWhyModal(null)}>확인</ModalAction>
            </ModalFooter>
          </Modal>
        </ModalOverlay>
      )}
    </Wrap>
  );
}

/* ===== ChecklistItem ===== */
function ChecklistItem({
  item,
  enabled,
  open,
  checked,
  onToggleCheck,
  onToggleOpen,
  onShowWhy,
}) {
  return (
    <Item>
      <ItemHead>
        <CheckWrap>
          <CheckBox $on={checked} disabled={!enabled} onClick={onToggleCheck}>
            {checked && <CheckIcon />}
          </CheckBox>
        </CheckWrap>
        <ItemTitle $dim={!enabled}>{item.title}</ItemTitle>
        <BtnGroup>
          <IconBtnSmall onClick={onShowWhy} title="왜 확인해야 하나요?">
            <TipIcon />
          </IconBtnSmall>
          <ExpandBtn onClick={onToggleOpen} title="설명 보기">
            <ChevronDown $open={open} />
          </ExpandBtn>
        </BtnGroup>
      </ItemHead>
      {open && (
        <ItemBody>
          <Row>
            <RowKey>살펴야 할 사항</RowKey>
            <RowVal>{item.what}</RowVal>
          </Row>
        </ItemBody>
      )}
    </Item>
  );
}

/* ===== styled-components ===== */
const Wrap = styled.div`
  min-height: 100dvh;
  background: ${C.bg};
  color: ${C.text};
  padding-bottom: calc(${S.bottomPad}px + env(safe-area-inset-bottom));
`;

const TopBar = styled.header`
  position: sticky; top: 0; z-index: 10; height: ${S.headerH}px;
  display: grid; grid-template-columns: 56px 1fr 56px; align-items: center;
  border-bottom: 1px solid ${C.line}; background: #fff;
`;
const Title = styled.div`justify-self:center;font-weight:800;`;
const IconBtn = styled.button`
  border: 0; background: transparent; height: 100%;
  display: grid; place-items: center; cursor: pointer;
`;

const Section = styled.div`padding:12px ${S.padX}px 0;`;
const HeroBox = styled.div`
  border: 1px solid ${C.line}; border-radius: ${R.img}px; overflow: hidden; background: #fff;
`;
const Hero = styled.img`width:100%; aspect-ratio:16/10; object-fit:cover; display:block;`;

const Tabs = styled.div`
  display: grid; grid-template-columns: 1fr 1fr;
  padding: 10px ${S.padX}px 0; border-bottom: 1px solid ${C.line}; background: #fff;
`;
const TabLink = styled(NavLink)`
  display:flex; justify-content:center; align-items:center; padding:10px 0;
  font-weight:700; color:${C.sub}; text-decoration:none; position:relative; cursor:pointer;
  &.active, &[aria-current="page"]{ color:${C.blue}; }
`;

const Card = styled.section`
  margin: 12px ${S.padX}px; padding: 12px; background: #fff;
  border: 1px solid ${C.line}; border-radius: ${R.card}px;
`;
const CardHead = styled.div`
  display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap;
`;
const HeadLeft = styled.div`display:inline-flex; align-items:center; gap:8px;`;
const HeadTitle = styled.b`font-weight:800;`;
const TypeBadge = styled.span`
  padding: 4px 10px; border-radius: 999px; border: 1px solid ${C.line};
  background: #fff; color: ${C.text}; font-size: 12px; font-weight: 800;
`;

const List = styled.ul`
  list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:10px;
`;
const GroupLabel = styled.li`
  margin: 10px 2px 2px; font-size:12px; font-weight:800; color:${C.sub};
`;

const Item = styled.li`border:1px solid ${C.line}; border-radius:12px; background:#fff;`;
const ItemHead = styled.div`
  display:grid; grid-template-columns:36px 1fr auto; align-items:center; gap:6px; padding:10px;
`;
const CheckWrap = styled.div`display:flex; align-items:center; justify-content:center;`;
const CheckBox = styled.button`
  width:22px; height:22px; border-radius:6px;
  border:1.5px solid ${(p)=> (p.$on ? C.blue : C.line)};
  background:${(p)=> (p.$on ? C.blue : "#fff")};
  display:flex; align-items:center; justify-content:center;
`;
const ItemTitle = styled.div`font-weight:800; color:${(p)=> (p.$dim ? "#9AA0A6" : C.text)};`;
const BtnGroup = styled.div`display:flex; gap:4px;`;
const IconBtnSmall = styled.button`
  border:0; background:transparent; width:26px; height:26px; cursor:pointer; border-radius:50%;
  &:hover{ background:${C.soft}; }
`;
const ExpandBtn = styled.button`border:0; background:transparent; width:26px; height:26px; cursor:pointer;`;

const ItemBody = styled.div`border-top:1px dashed ${C.line}; background:${C.soft}; padding:10px;`;
const Row = styled.div`display:grid; grid-template-columns:110px 1fr; gap:8px;`;
const RowKey = styled.div`font-size:13px; font-weight:800; color:${C.sub};`;
const RowVal = styled.div`font-size:14px;`;

const Bottom = styled.div`
  position: sticky; bottom: 0; background:#fff; display:grid;
  grid-template-columns: 1fr 1fr; gap:12px; padding:10px; border-top:1px solid ${C.line};
`;
const GhostBtn = styled.button`
  height:48px; border-radius:14px; border:1px solid ${C.blue}; color:${C.blue}; background:#fff; font-weight:800;
`;
const PrimaryBtn = styled.button`
  height:48px; border-radius:14px; border:0; background:${C.blue}; color:#fff; font-weight:800;
`;

const ModalOverlay = styled.div`
  position:fixed; inset:0; background:${C.overlay}; display:grid; place-items:center; z-index:1000; padding:20px;
`;
const Modal = styled.div`
  width:100%; max-width:560px; background:#fff; border-radius:16px; border:1px solid ${C.line};
  box-shadow:0 10px 30px rgba(0,0,0,.12); display:flex; flex-direction:column; overflow:hidden;
`;
const ModalHeader = styled.div`
  display:flex; justify-content:space-between; align-items:center; padding:14px 16px; border-bottom:1px solid ${C.line};
`;
const ModalTitle = styled.h3`margin:0; font-size:16px; font-weight:800;`;
const CloseBtn = styled.button`
  width:32px; height:32px; border:0; background:transparent; border-radius:8px; cursor:pointer;
  font-size:20px; line-height:1; color:${C.sub};
  &:hover{ background:${C.soft}; }
`;
const ModalBody = styled.div`padding:16px; color:${C.text}; font-size:14px; line-height:1.6; white-space:pre-wrap;`;
const ModalFooter = styled.div`display:flex; justify-content:flex-end; gap:8px; padding:12px 16px; border-top:1px solid ${C.line};`;
const ModalAction = styled.button`
  height:40px; padding:0 16px; border-radius:10px; border:0; cursor:pointer; font-weight:800; background:${C.blue}; color:#fff;
`;

/* icons */
function ChevronLeft() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24">
      <path d="M15 19l-7-7 7-7" stroke="#111827" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function TipIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path d="M9 21h6m-6-3h6M7 10a5 5 0 1 1 10 0c0 1.8-.9 3.1-2.1 4.2-.6.6-.9 1.4-.9 2.3H10c0-.9-.3-1.7-.9-2.3C7.9 13.1 7 11.8 7 10z" stroke={C.blue} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function ChevronDown({ $open }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" style={{ transform: $open ? "rotate(180deg)" : "none", transition: "transform .15s" }}>
      <path d="M6 9l6 6 6-6" stroke="#6B7280" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24">
      <path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
