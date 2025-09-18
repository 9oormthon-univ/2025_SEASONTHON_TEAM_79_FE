// src/user/LeaseChecklistPage/MyLeaseChecklistPage.jsx
// 흰색 배경 통일 + 카드 테두리 O + 탭은 활성일 때만 밑줄
// 토글 기본 OFF, 전구 클릭 모달, 하단 버튼: 초기화/저장하기(수동 저장)

import React, { useEffect, useMemo, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { NavLink, useLocation, useParams } from "react-router-dom";

/* ===== 전역 배경 흰색 강제 ===== */
const GlobalStyle = createGlobalStyle`
  html, body, #root { background: #ffffff !important; }
`;

/* ===== 디자인 토큰 ===== */
const C = {
  bg: "#FFFFFF",
  card: "#FFFFFF",
  line: "#E7EDF5",
  text: "#0F172A",
  sub: "#6B7280",
  blue: "#6B8CFF",
  blueSoft: "#F3F6FF",
  overlay: "rgba(15, 23, 42, .5)",
};
const R = { card: 12, img: 12 };
const S = { headerH: 56, padX: 16, bottomPad: 84 };

/* ===== 체크리스트 데이터 ===== */
const COMMON = [
  { id: "c01", title: "중개사무소 및 확인설명서",
    what: "개설등록증·자격증 확인, 중개대상물 확인·설명서 교부/서명, 손해배상책임 보장여부(공제/보험)",
    why: "법정 서류로 임차인의 고지받은 내용 증거가 되며, 누락·허위 시 분쟁에서 입증자료가 됩니다." },
  { id: "c02", title: "등기부등본(당일 발급)",
    what: "소유자·주소 일치, 발급일자 당일/잔금일 아침 재확인",
    why: "실소유자와 계약하는지와 잔금 직전 변동 가능성을 차단하기 위해 당일 재확인이 필요합니다." },
  { id: "c03", title: "선순위 권리 확인",
    what: "근저당/저당·가압류·압류·가처분·전세권 등 선순위 내역·금액",
    why: "선순위 채권은 경매 시 보증금 회수 순위에 직접 영향을 주므로 합계가 크면 손실 위험이 큽니다." },
  { id: "c04", title: "건축물대장·토지대장 확인",
    what: "용도·면적·층수, 위반건축물 여부, 오피스텔 주거용 가능 여부",
    why: "불법 증축·용도 위반은 보증보험·전입신고 등에서 문제를 일으키고 행정처분 위험이 있습니다." },
  { id: "c05", title: "시세·안전비율 점검",
    what: "선순위 합계 + 내 보증금 ≤ 주택가액 80%(권고 70%)",
    why: "시세 대비 담보여력이 낮으면 깡통 위험이 커집니다." },
  { id: "c06", title: "당사자·대리권 확인 및 실명 입금",
    what: "임대인 본인 신분증 / 대리시 위임장·인감, 임대인 명의 계좌로 송금",
    why: "이중계약·사칭을 방지하고, 제3자 계좌 송금 리스크를 줄입니다." },
  { id: "c07", title: "표준계약서 사용 + 필수 특약",
    what: "국토부 표준계약서 사용, 하자보수·보증금 반환·변동 금지 등 특약",
    why: "표준양식과 특약으로 권리·의무를 명확히 해 분쟁을 예방합니다." },
  { id: "c08", title: "공과금·관리비 정산",
    what: "포함/불포함 명시, 정산기준(인도일 24:00), 계량기 검침 사진",
    why: "체납/이월 및 명의변경 과정에서의 분쟁을 예방하고 비용을 투명화합니다." },
  { id: "c09", title: "하자 점검 기록",
    what: "입주 전 사진·동영상, 수리기한·책임 주체 특약",
    why: "수선의무·원상복구 범위를 명확히 해 퇴거 시 분쟁을 방지합니다." },
  { id: "c10", title: "임대차 신고·전입신고·확정일자",
    what: "계약 30일내 신고(확정일자 자동), 입주 즉시 전입/확정일자",
    why: "전입으로 대항력을, 확정일자로 우선변제권을 확보합니다." },
  { id: "c11", title: "분쟁·사고 대비",
    what: "(전세) 보증보험 가입여부, 분쟁조정위/임차권등기명령 절차 숙지",
    why: "보증금 미반환 등 사고에 대비한 비상수단을 마련합니다." },
];

const MONTHLY = [
  { id: "m13", title: "임대료·증액 규정",
    what: "월세/보증금·납부일·연체이자, 5% 상한·갱신요구권 기재",
    why: "과도한 증액·갱신 거절을 예방하고 법정 권리를 적기에 행사하기 위함입니다." },
  { id: "m14", title: "관리비·주차·반려동물·소음",
    what: "규약 수령, 주차/반려동물 가능·추가비용·소음 정책",
    why: "생활상 분쟁과 예상치 못한 추가비용을 방지합니다." },
  { id: "m15", title: "원상복구 범위 합의",
    what: "못/선반/페인트 허용범위, 벽지·장판 감가 기준",
    why: "퇴거 시 과도한 원상복구 요구를 예방합니다." },
];

const JEONSE = [
  { id: "j21", title: "선순위+보증금 ≤ 주택가액 80%",
    what: "시세·실거래가 참고, 보수적 산정",
    why: "낙찰가 하락 시 손실을 최소화하기 위한 안전 기준입니다." },
  { id: "j22", title: "전세권 설정 vs 확정일자(+전입)",
    what: "상황에 따라 선택, 필요 시 병행",
    why: "전세권은 경매신청이 가능하고, 확정일자는 간편하므로 상황에 맞춘 선택이 필요합니다." },
  { id: "j23", title: "전세보증금 반환보증",
    what: "가입 가능여부·조건·임대인 협조 서류 확인",
    why: "최종 안전망 역할을 하며, 가입 불가 매물은 구조적 리스크 신호일 수 있습니다." },
  { id: "j24", title: "잔금일 당일 재확인·변동 금지 특약",
    what: "잔금 직전 등기부 재발급, 선순위 변동 시 해제·배액상환",
    why: "잔금 직전 담보 설정·이중계약 등 변동을 차단합니다." },
];

const DEFAULT_PHOTO =
  "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=1600&auto=format&fit=crop";

/* ===== 유틸 & API 헬퍼 ===== */
const toNum = (v) => (typeof v === "number" ? v : Number.isFinite(Number(v)) ? Number(v) : undefined);
const detectContractFromItem = (item) => {
  const t = String(item?.deal ?? item?.price ?? "").trim();
  if (/월세/.test(t)) return "monthly";
  if (/전세/.test(t)) return "jeonse";
  return null;
};

const API_BASE = (import.meta.env?.VITE_API_BASE || "").replace(/\/+$/, "");
const withBase = (p) => `${API_BASE}${p}`;
const getToken = () =>
  localStorage.getItem("auth_token") ||
  "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjMsIm5hbWUiOiJhZG1pbiIsImlhdCI6MTc1ODA4OTYxMywiZXhwIjoxNzU4Njk0NDEzfQ.Rg7kGFbRau7tpGb6WbQ1U71dYlk8jZtmtDdZoYmQ-_s";

/** 보호 경로 리소스를 Blob URL로 변환 (Authorization 헤더 포함) */
function useAuthedSrc(src) {
  const [out, setOut] = useState("");
  useEffect(() => {
    let revoke;
    (async () => {
      if (!src) { setOut(""); return; }
      if (/^(data:|blob:)/i.test(src)) { setOut(src); return; }
      if (/^https?:/i.test(src) && !/\/api\//.test(src)) { setOut(src); return; }
      const url = src.startsWith("/") ? withBase(src) : withBase("/" + src);
      try {
        const res = await fetch(url, {
          method: "GET",
          headers: { Authorization: `Bearer ${getToken()}` },
          credentials: "include",
        });
        if (!res.ok) { setOut(""); return; }
        const blob = await res.blob();
        const u = URL.createObjectURL(blob);
        setOut(u);
        revoke = () => URL.revokeObjectURL(u);
      } catch { setOut(""); }
    })();
    return () => { if (revoke) revoke(); };
  }, [src]);
  return out;
}

/* ====== NEW: 서버가 주는 계약 유형 읽기 ====== */
const mapContract = (v) => {
  const s = String(v ?? "").trim().toLowerCase();
  if (!s) return null;
  if (["jeonse","전세","deposit","full"].some((k) => s.includes(k))) return "jeonse";
  if (["monthly","월세","rent"].some((k) => s.includes(k))) return "monthly";
  return null;
};
function getContractTypeFromServer(raw) {
  // 우선순위: 최상위 → items 내 → 숫자값 보조 판별
  const top = mapContract(raw?.contractType ?? raw?.rentType);
  if (top) return top;
  const inItems = mapContract(raw?.items?.contractType ?? raw?.items?.rentType);
  if (inItems) return inItems;

  const m = toNum(raw?.items?.monthly);
  const d = toNum(raw?.items?.deposit);
  if (typeof m === "number" && m > 0) return "monthly";
  if (typeof d === "number" && (m == null || m === 0)) return "jeonse";
  return null;
}

/* ====== NEW: 단건 조회 /api/checklists/{checkId} ====== */
async function fetchChecklistById({ checkId, signal }) {
  const url = withBase(`/api/checklists/${encodeURIComponent(checkId)}?t=${Date.now()}`);
  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    signal,
    cache: "no-store",
  });
  if (!res.ok) {
    const msg =
      res.status === 401 ? "로그인이 필요합니다. (401)" :
      res.status === 403 ? "접근 권한이 없습니다. (403)" :
      res.status === 404 ? "해당 체크리스트를 찾을 수 없습니다. (404)" :
      `조회 실패 (HTTP ${res.status})`;
    throw new Error(msg);
  }
  const json = await res.json();
  return {
    raw: json,
    contract: getContractTypeFromServer(json),
    photos: Array.isArray(json?.photos) ? json.photos : [],
    imageUrl: json?.imageUrl || "",
    items: json?.items || {},
  };
}

/** (백업 경로) 페이지 API에서 checkId 레코드 찾기 */
async function fetchChecklistFromPagedAPI({ userId, checkId, signal, pageSize = 30, maxPages = 20 }) {
  let page = 0;
  while (page < maxPages) {
    const url = withBase(`/api/users/${encodeURIComponent(userId)}/checklists/page?page=${page}&size=${pageSize}&t=${Date.now()}`);
    const res = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      signal,
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`목록 조회 실패 (HTTP ${res.status})`);
    const dto = await res.json();
    const list = Array.isArray(dto?.content) ? dto.content : [];
    const found = list.find((it) => String(it?.checkId ?? it?.id) === String(checkId));
    if (found) return found;

    const totalPages = toNum(dto?.totalPages) ?? (list.length < pageSize ? page + 1 : page + 2);
    page += 1;
    if (signal?.aborted) return null;
    if (page >= totalPages) break;
  }
  return null;
}

/* ===== 메인 컴포넌트 ===== */
export default function LeaseChecklistPage() {
  // URL: /myleasechecklistpage/:id  혹은 state로 전달됨
  const { id: idParam, userId: paramUserId } = useParams();
  const location = useLocation();
  const item = location.state?.item;
  const idFromState = location.state?.id ?? item?.id ?? null;
  const theId = idParam ?? idFromState ?? null; // URL > state

  const [serverData, setServerData] = useState(null);
  const [contract, setContract] = useState(null); // 'monthly' | 'jeonse'
  const [checked, setChecked] = useState({});
  const [openCommon, setOpenCommon] = useState(true);
  const [openType, setOpenType] = useState(true);
  const [whyModal, setWhyModal] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  /* ===== 1) 우선 /api/checklists/{id} 에서 계약유형(contractType) 수신 ===== */
  useEffect(() => {
    let aborted = false;
    (async () => {
      try {
        setErrorMsg("");

        // checkId 없으면 상태 텍스트 기반 추론만
        if (!theId) {
          const det = detectContractFromItem(item) ?? "monthly";
          setContract(det);
          return;
        }

        // 1차: 단건 API에서 직접 판별(권장 경로)
        try {
          const byId = await fetchChecklistById({ checkId: theId, signal: undefined });
          if (aborted) return;
          setServerData(byId);
          const det = byId.contract ?? detectContractFromItem(item) ?? "monthly";
          setContract(det);
          return;
        } catch (e1) {
          // 2차: 페이지 API로 백업 조회 후 판별
          const userId =
            toNum(paramUserId) ??
            toNum(location.state?.userId) ??
            toNum(item?.userId);

          if (!userId) throw e1; // 사용자 ID 없으면 더 진행 불가 → 위 에러 노출

          const found = await fetchChecklistFromPagedAPI({ userId, checkId: theId, signal: undefined });
          if (aborted) return;

          if (!found) {
            setErrorMsg("목록에서 해당 체크리스트를 찾을 수 없습니다.");
            setContract(detectContractFromItem(item) ?? "monthly");
            return;
          }

          setServerData(found);
          const det = getContractTypeFromServer(found) ?? detectContractFromItem(item) ?? "monthly";
          setContract(det);
        }
      } catch (e) {
        if (!aborted) {
          setErrorMsg(e?.message || "데이터를 불러오지 못했습니다.");
          setContract(detectContractFromItem(item) ?? "monthly");
        }
      }
    })();
    return () => { aborted = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theId, paramUserId]);

  /* ===== 2) 사진 표시(서버 > state > 기본) — 보호경로 대응 ===== */
  const rawPhoto =
    (serverData?.photos?.[0]?.rawUrl) ||
    serverData?.imageUrl ||
    item?.image ||
    item?.사진 ||
    DEFAULT_PHOTO;
  const photo = useAuthedSrc(rawPhoto);

  /* ===== 3) 체크리스트 항목/저장 키 ===== */
  const activeItems = useMemo(
    () => (contract === "jeonse" ? [...COMMON, ...JEONSE] : [...COMMON, ...MONTHLY]),
    [contract]
  );
  const storageKey = useMemo(
    () => (contract && theId ? `leaseChecklist_v4_${contract}_${theId}` : null),
    [contract, theId]
  );

  useEffect(() => {
    if (!contract) return;
    try {
      const savedRaw = storageKey ? localStorage.getItem(storageKey) : null;
      const defaults = Object.fromEntries(activeItems.map((it) => [it.id, false]));
      if (!savedRaw) return setChecked(defaults);
      const saved = JSON.parse(savedRaw);
      setChecked({ ...defaults, ...(saved?.checked || {}) });
    } catch {
      const defaults = Object.fromEntries(activeItems.map((it) => [it.id, false]));
      setChecked(defaults);
    }
  }, [contract, storageKey, activeItems]);

  const onReset = () => {
    if (!contract) return;
    const empty = Object.fromEntries(activeItems.map((it) => [it.id, false]));
    setChecked(empty);
    if (storageKey) localStorage.removeItem(storageKey);
    alert("초기화되었습니다.");
  };
  const onSave = () => {
    if (!contract) return;
    if (storageKey) localStorage.setItem(storageKey, JSON.stringify({ checked }));
    alert("저장되었습니다.");
  };

  const setToggle = (id) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  const showWhy = (it) => setWhyModal({ title: it.title, what: it.what, why: it.why });

  const counts = useMemo(() => {
    const cntCommon = COMMON.reduce((n, it) => n + (checked[it.id] ? 1 : 0), 0);
    const totalCommon = COMMON.length;
    const TYPE = contract === "jeonse" ? JEONSE : MONTHLY;
    const cntType = TYPE.reduce((n, it) => n + (checked[it.id] ? 1 : 0), 0);
    const totalType = TYPE.length;
    return { cntCommon, totalCommon, cntType, totalType };
  }, [checked, contract]);

  return (
    <Wrap>
      <GlobalStyle />

      <TopBar>
        <BackBtn onClick={() => window.history.back()} aria-label="뒤로">
          <ChevronLeft />
        </BackBtn>
        <Title>집 계약 체크리스트</Title>
        <Spacer />
      </TopBar>

      {/* 상단 사진 */}
      <Section>
        <HeroBox>
          <Hero src={photo || DEFAULT_PHOTO} alt="room" />
        </HeroBox>
      </Section>

      {/* 탭 */}
      <Tabs>
        <TabLink
          to={theId ? `/myhomedetailpage/${theId}` : "/myhomedetailpage/"}
          state={theId ? undefined : { id: idFromState, item }}
          end
        >
          상세보기
        </TabLink>
        <TabLink
          to={theId ? `/myleasechecklistpage/${theId}` : "/myleasechecklistpage"}
          state={theId ? undefined : { id: idFromState, item }}
        >
          집 계약 체크리스트
        </TabLink>
      </Tabs>

      {errorMsg && (
        <Alert role="alert">오류: {errorMsg}</Alert>
      )}

      {/* 공통 */}
      <Card>
        <CardHead onClick={() => setOpenCommon((v) => !v)} role="button" aria-expanded={openCommon}>
          <GroupLeft>
            <ProgressCircle value={counts.cntCommon} total={counts.totalCommon} />
            <GroupTitle>공통</GroupTitle>
          </GroupLeft>
          <Chevron open={openCommon} />
        </CardHead>
        {openCommon && (
          <List>
            {COMMON.map((it) => (
              <Row key={it.id}>
                <Left>
                  <IconBtnSmall onClick={() => showWhy(it)} title="설명 보기">
                    <BulbIcon />
                  </IconBtnSmall>
                  <ItemTitle>{it.title}</ItemTitle>
                </Left>
                <Right>
                  <Switch
                    $on={!!checked[it.id]}
                    onClick={() => setToggle(it.id)}
                    aria-pressed={!!checked[it.id]}
                    title={it.what}
                  >
                    <Knob $on={!!checked[it.id]} />
                  </Switch>
                </Right>
              </Row>
            ))}
          </List>
        )}
      </Card>

      {/* 유형별 (전세/월세) */}
      <Card>
        <CardHead onClick={() => setOpenType((v) => !v)} role="button" aria-expanded={openType}>
          <GroupLeft>
            <ProgressCircle value={counts.cntType} total={counts.totalType} />
            <GroupTitle>{contract === "jeonse" ? "전세 전용" : "월세 전용"}</GroupTitle>
          </GroupLeft>
          <Chevron open={openType} />
        </CardHead>
        {openType && (
          <List>
            {(contract === "jeonse" ? JEONSE : MONTHLY).map((it) => (
              <Row key={it.id}>
                <Left>
                  <IconBtnSmall onClick={() => showWhy(it)} title="설명 보기">
                    <BulbIcon />
                  </IconBtnSmall>
                  <ItemTitle>{it.title}</ItemTitle>
                </Left>
                <Right>
                  <Switch
                    $on={!!checked[it.id]}
                    onClick={() => setToggle(it.id)}
                    aria-pressed={!!checked[it.id]}
                    title={it.what}
                  >
                    <Knob $on={!!checked[it.id]} />
                  </Switch>
                </Right>
              </Row>
            ))}
          </List>
        )}
      </Card>

      {/* 하단 버튼 */}
      <Bottom>
        <GhostBtn onClick={onReset}>초기화</GhostBtn>
        <PrimaryBtn onClick={onSave} disabled={!contract}>
          저장하기
        </PrimaryBtn>
      </Bottom>

      {/* 모달 */}
      {whyModal && (
        <ModalOverlay onClick={() => setWhyModal(null)}>
          <Modal role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>{whyModal.title}</ModalTitle>
              <CloseBtn aria-label="닫기" onClick={() => setWhyModal(null)}>×</CloseBtn>
            </ModalHeader>
            <ModalBody>
              <Bullet><strong>살펴야 할 사항:</strong> {whyModal.what}</Bullet>
              {whyModal.why && <Bullet><strong>이유:</strong> {whyModal.why}</Bullet>}
            </ModalBody>
            <ModalFooter>
              <ModalAction onClick={() => setWhyModal(null)}>확인</ModalAction>
            </ModalFooter>
          </Modal>
        </ModalOverlay>
      )}
    </Wrap>
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
  position: sticky;
  top: 0;
  z-index: 10;
  height: ${S.headerH}px;
  display: grid;
  grid-template-columns: 56px 1fr 56px;
  align-items: center;
  background: ${C.bg};
  border-bottom: 1px solid ${C.line};
`;
const BackBtn = styled.button`
  height: 100%;
  border: 0;
  background: transparent;
  display: grid;
  place-items: center;
  cursor: pointer;
`;
const Title = styled.div`
  justify-self: center;
  font-weight: 800;
`;
const Spacer = styled.div``;

const Section = styled.div`
  padding: 12px ${S.padX}px 0;
`;
const HeroBox = styled.div`border:0;border-radius:${R.img}px;overflow:hidden;background:${C.bg};`;
const Hero = styled.img`
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  display: block;
`;

const Tabs = styled.nav`
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 0 ${S.padX}px;
  background: ${C.bg};
`;
const TabLink = styled(NavLink)`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 0;
  font-weight: 800;
  color: ${C.sub};
  text-decoration: none !important;

  &::after {
    content: "";
    position: absolute;
    left: 50%;
    bottom: -2px;
    transform: translateX(-50%) scaleX(0);
    transform-origin: center;
    width: 88%;
    height: 2px;
    background: ${C.blue};
    border-radius: 2px;
    transition: transform .18s ease;
  }

  &.active, &[aria-current="page"] {
    color: ${C.blue};
  }
  &.active::after,
  &[aria-current="page"]::after {
    transform: translateX(-50%) scaleX(1);
  }
`;

const Card = styled.section`
  margin: 12px ${S.padX}px;
  background: ${C.card};
  border: 1px solid ${C.line};
  border-radius: ${R.card}px;
  overflow: hidden;
`;
const CardHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 12px;
  cursor: pointer;
  user-select: none;
`;
const GroupLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
const GroupTitle = styled.b`
  font-weight: 800;
`;

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 6px 12px 12px;
`;

const Row = styled.li`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 10px;
  padding: 12px 0;
  & + & {
    border-top: 1px solid ${C.line};
  }
`;
const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`;
const ItemTitle = styled.div`
  font-weight: 700;
  color: ${C.text};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const Right = styled.div``;

// 토글 스위치
const Switch = styled.button`
  position: relative;
  width: 46px;
  height: 28px;
  border-radius: 999px;
  border: 0;
  cursor: pointer;
  background: ${(p) => (p.$on ? C.blue : "#D1D5DB")};
  transition: background 0.2s ease;
`;
const Knob = styled.span`
  position: absolute;
  top: 3px;
  left: 3px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease;
  transform: translateX(${(p) => (p.$on ? "18px" : "0")});
`;

// 진행 원형
function ProgressCircle({ value, total }) {
  const pct = total === 0 ? 0 : Math.min(100, Math.round((value / total) * 100));
  return (
    <Prog aria-label={`완료 ${value}/${total}`}>
      <div className="ring" style={{ background: `conic-gradient(${C.blue} ${pct}%, #E5E7EB 0)` }} />
      <span className="txt">{value}/{total}</span>
    </Prog>
  );
}
const Prog = styled.div`
  position: relative;
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  .ring { position: absolute; inset: 0; border-radius: 50%; }
  .txt  { position: relative; z-index: 1; font-size: 10px; font-weight: 800; color: ${C.text};
          background: #fff; border-radius: 50%; width: 24px; height: 24px; display: grid; place-items: center; }
`;

/* 아이콘/버튼/모달 */
function ChevronLeft() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
      <path d="M15 19l-7-7 7-7" stroke="#111827" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function Chevron({ open }) {
  return (
    <span style={{ display: "inline-block", transform: open ? "rotate(180deg)" : "none", transition: "transform .15s ease" }}>
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
        <path d="M6 9l6 6 6-6" stroke="#6B7280" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
function BulbIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M9 21h6m-6-3h6M7 10a5 5 0 1 1 10 0c0 1.8-.9 3.1-2.1 4.2-.6.6-.9 1.4-.9 2.3H10c0-.9-.3-1.7-.9-2.3C7.9 13.1 7 11.8 7 10z"
        stroke={C.blue} strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}
const IconBtnSmall = styled.button`
  border: 0;
  background: transparent;
  width: 28px;
  height: 28px;
  cursor: pointer;
  border-radius: 50%;
  display: grid;
  place-items: center;
  transition: background 0.15s ease;
  &:hover { background: ${C.blueSoft}; }
`;

const Alert = styled.div`
  margin: 12px ${S.padX}px 0;
  padding: 10px 12px;
  border: 1px solid #fecaca;
  background: #fff1f2;
  color: #b91c1c;
  border-radius: 10px;
  font-size: 13px;
`;

/* 하단 고정 버튼 */
const Bottom = styled.div`
  position: sticky;
  bottom: 0;
  z-index: 5;
  background: ${C.bg};
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 12px ${S.padX}px calc(12px + env(safe-area-inset-bottom));
  border-top: 1px solid ${C.line};
`;
const GhostBtn = styled.button`
  height: 48px;
  border-radius: 14px;
  border: 1px solid ${C.blue};
  color: ${C.blue};
  background: ${C.bg};
  font-weight: 800;
  cursor: pointer;
`;
const PrimaryBtn = styled.button`
  height: 48px;
  border-radius: 14px;
  border: 0;
  background: ${C.blue};
  color: #fff;
  font-weight: 800;
  cursor: pointer;
`;

/* 모달 */
const ModalOverlay = styled.div`
  position: fixed; inset: 0; background: ${C.overlay};
  display: grid; place-items: center; z-index: 1000; padding: 20px;
`;
const Modal = styled.div`
  width: 100%; max-width: 520px; background: #fff;
  border-radius: 16px; border: 1px solid ${C.line};
  box-shadow: 0 10px 30px rgba(0,0,0,.12);
  display: flex; flex-direction: column; overflow: hidden;
`;
const ModalHeader = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  padding: 14px 16px; border-bottom: 1px solid ${C.line};
`;
const ModalTitle = styled.h3` margin: 0; font-size: 16px; font-weight: 800; color: ${C.text}; `;
const CloseBtn = styled.button`
  width: 32px; height: 32px; border: 0; background: transparent;
  border-radius: 8px; cursor: pointer; font-size: 20px; line-height: 1; color: ${C.sub};
  &:hover{ background:${C.blueSoft}; }
`;
const ModalBody = styled.div` padding: 16px; color: ${C.text}; font-size: 14px; line-height: 1.6; `;
const Bullet = styled.p`
  position: relative; margin: 0 0 10px 0; padding-left: 14px;
  &::before { content: "•"; position: absolute; left: 0; color: ${C.sub}; }
`;
const ModalFooter = styled.div` display: flex; justify-content: flex-end; gap: 8px; padding: 12px 16px; border-top: 1px solid ${C.line}; `;
const ModalAction = styled.button` height: 40px; padding: 0 16px; border-radius: 10px; border: 0; cursor: pointer; font-weight: 800; background: ${C.blue}; color: #fff; `;
