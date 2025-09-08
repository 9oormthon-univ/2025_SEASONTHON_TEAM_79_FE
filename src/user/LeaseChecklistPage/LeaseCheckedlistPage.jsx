// LeaseCheckedlistPage.jsx
import React, { useEffect, useState } from "react";
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

/** ===== 체크리스트 데이터 (풀버전) ===== */
const COMMON = [
  { id:"c1", title:"최신 등기부등본(등기사항증명서) 확인",
    what:"소유자 성명·주민(사업자)번호 일부, 주소 일치 / 발급일자(당일 또는 잔금일 아침 재확인)",
    why:"실제 소유자와 계약하는지, 잔금 직전 변동 가능성을 확인하기 위해 당일 재발급 필요." },
  { id:"c2", title:"근저당·저당 등 선순위 권리 확인",
    what:"등기부등본 내 근저당권, 저당권, 가압류, 압류, 가처분, 전세권 등 선순위 권리 내역과 금액, 채권자 확인",
    why:"선순위 채권은 경매 시 보증금 회수 순위에 직접 영향. 선순위 합계가 크면 보증금 손실 위험 급증." },
  { id:"c3", title:"건축물대장·(필요시) 토지대장 확인",
    what:"주용도(주택/근린 등), 면적·층수, 불법 증축 여부(‘위반건축물’ 표시), 오피스텔이면 주거용 사용 가능 여부",
    why:"불법 증축·용도 위반은 확정일자·보증보험·전입신고 등에서 문제 발생 가능. 추후 강제철거/과태료·분쟁 위험." },
  { id:"c4", title:"시세·안전비율 점검 (깡통전세·과도한 보증금 방지)",
    what:"주변 실거래/호가, 선순위 채권합계 + 내 보증금 ≤ 주택가액의 80% 이내(보수적으로 70% 권고)",
    why:"낙찰가가 시세의 80% 내외로 형성되는 일이 많아, 보증금 손실 위험 급증." },
  { id:"c5", title:"중개사무소·중개대상물 확인설명서",
    what:"개설등록증, 중개사 자격증, 확인·설명서 교부 및 서명, 손해배상책임 보장여부 확인",
    why:"법정 서류로서 임차인의 고지받은 내용 증거가 됨. 누락·허위 시 분쟁 시 입증자료." },
  { id:"c6", title:"당사자·대리권 확인 및 실명 입금",
    what:"임대인 본인 신분증, 대리인인 경우 위임장·인감증명서 / 임대인 명의 계좌로 송금",
    why:"이중계약·사칭 방지. 현금거래·제3자 계좌 송금은 분쟁 시 불리." },
  { id:"c7", title:"표준계약서 사용 + 필수 특약",
    what:"국토부 주택임대차 표준계약서 양식 사용. 필수 특약 추가",
    why:"표준양식은 분쟁을 줄이고, 임차인 권리 보호 조항이 체계화되어 있음." },
  { id:"c8", title:"공과금·관리비 정산 기준 명시",
    what:"포함/불포함 항목, 정산 기준일, 계량기 검침치 사진 첨부",
    why:"체납/이월 분쟁 예방. 신규 명의변경 등 실무문제 방지." },
  { id:"c9", title:"하자 점검 기록",
    what:"입주 전 상태사진·동영상, 수리기한·책임 주체를 특약에 명시",
    why:"임대인의 수선의무 범위와 원상복구 범위를 명확히 하여 분쟁 예방." },
  { id:"c10", title:"임대차 신고·전입신고·확정일자",
    what:"계약 후 30일 이내 임대차 신고, 입주 즉시 전입신고, 확정일자",
    why:"대항력·우선변제권 확보. 지연 시 과태료 가능." },
  { id:"c11", title:"분쟁·사고 대비",
    what:"전세보증금 반환보증 가입 여부 확인, 임대차분쟁조정위 절차 숙지",
    why:"보증금 미반환 등에 대비한 안전장치." }
];

const MONTHLY = [
  { id:"m13", title:"임대료·증액 규정 확인",
    what:"월세·보증금 금액과 납부일, 연체이자율, 갱신요구권 기재",
    why:"불합리한 증액 요구·갱신 거절 예방." },
  { id:"m14", title:"관리비·주차·반려동물·소음 등 생활조건",
    what:"관리규약, 층간소음, 반려동물 여부, 주차 가능 여부",
    why:"생활상 분쟁 및 추가비용 방지." },
  { id:"m15", title:"원상복구 범위 합의",
    what:"못·선반·페인트 등 설치 허용 범위, 감가처리 기준",
    why:"퇴거 시 과도한 원상복구 요구 예방." }
];

const DEFAULT_PHOTO =
  "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=1600&auto=format&fit=crop";

export default function LeaseChecklistPage() {
  const location = useLocation();
  const item = location.state?.item;

  // 상태
  const [contract, setContract] = useState("monthly");
  const [enabled, setEnabled] = useState(true);
  const [openIds, setOpenIds] = useState(() => new Set());
  const [checked, setChecked] = useState(
    Object.fromEntries([...COMMON, ...MONTHLY].map((it) => [it.id, false]))
  );
  const [whyModal, setWhyModal] = useState(null);

  // 메모(임시 기본값)
  const [memo, setMemo] = useState(
    "임시 메모) 1차 방문 예정: 3/18(월) 오후 2시\n- 채광 남동향 확인\n- 보일러 연식 확인\n- 엘리베이터 소음 체크"
  );

  // ✅ 음성 샘플(업로드 없이 표시용)
  const SAMPLE_AUDIO = {
    name: "현장_녹음_2025-03-05.m4a",
    meta: "M4A · 02:34 · 1.8MB",
    duration: "02:34",
  };
  const [showPreview, setShowPreview] = useState(false);

  // 저장/복원
  const KEY = "leaseChecklist_monthly";
  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) {
        const { enabled: e, checked: ck } = JSON.parse(saved);
        if (typeof e === "boolean") setEnabled(e);
        if (ck && typeof ck === "object") setChecked(ck);
      }
    } catch (err) {
      console.warn("restore failed", err);
    }
  }, []);

  const onSave = () => {
    setEnabled(true);
    localStorage.setItem(KEY, JSON.stringify({ enabled: true, checked, contract }));
    alert("저장되었습니다.");
  };

  const onReset = () => {
    setEnabled(true);
    setChecked(Object.fromEntries([...COMMON, ...MONTHLY].map((it) => [it.id, false])));
    setOpenIds(new Set());
    setWhyModal(null);
    setContract("monthly");
    setMemo(
      "임시 메모) 1차 방문 예정: 3/18(월) 오후 2시\n- 채광 남동향 확인\n- 보일러 연식 확인\n- 엘리베이터 소음 체크"
    );
    localStorage.removeItem(KEY);
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

      {/* 탭 */}
      <Tabs>
        <TabLink to="/homedetailpage" end>상세보기</TabLink>
        <TabLink to="/leasechecklistpage">집 계약 체크리스트</TabLink>
      </Tabs>

      {/* 체크리스트 */}
      <Card>
        <CardHead>
          <HeadLeft>
            <TipIcon />
            <HeadTitle>살펴야 할 사항</HeadTitle>
          </HeadLeft>
        </CardHead>

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
        </List>
      </Card>

      {/* ✅ 음성 샘플 표시(업로드 없이) */}
      <Card>
        <CardHead>
          <HeadLeft>
            <AudioIcon />
            <HeadTitle>현장 녹음 (샘플)</HeadTitle>
          </HeadLeft>
        </CardHead>

        {/* 파일 타일 */}
        <FileRow>
          <FileBadge>m4a</FileBadge>
          <div>
            <FileName>{SAMPLE_AUDIO.name}</FileName>
            <FileMeta>{SAMPLE_AUDIO.meta}</FileMeta>
          </div>
          <FileActions>
            <PreviewBtn type="button" onClick={() => setShowPreview(true)}>듣기</PreviewBtn>
            <GhostSmall type="button" onClick={() => alert("샘플 UI입니다 :)")}>삭제</GhostSmall>
          </FileActions>
        </FileRow>

        {/* 가짜 오디오 썸네일/파형 */}
        <AudioMock onClick={() => setShowPreview(true)}>
          <PlayGlyph />
          <MiniWave />
          <TimeBadge>{SAMPLE_AUDIO.duration}</TimeBadge>
        </AudioMock>

        <SmallHint style={{ marginTop: 8 }}>
          * 샘플 UI입니다. 실제 업로드/재생 없이 레이아웃만 보여줍니다.
        </SmallHint>
      </Card>

      {/* 메모(임시 데이터 기본값) */}
      <Card>
        <CardHead>
          <HeadLeft>
            <NoteIcon />
            <HeadTitle>메모</HeadTitle>
          </HeadLeft>
        </CardHead>
        <MemoArea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="현장 방문 시 체크할 사항이나 주요 특징을 적어두세요."
          rows={6}
        />
        <HelperRow>
          <SmallHint>임시 저장: 페이지 벗어나면 사라질 수 있어요.</SmallHint>
        </HelperRow>
      </Card>

      {/* 하단 고정 버튼 */}
      <Bottom>
        <GhostBtn onClick={onReset}>초기화</GhostBtn>
        <PrimaryBtn onClick={onSave}>저장하기</PrimaryBtn>
      </Bottom>

      {/* ✅ 샘플 미리듣기 모달(가짜 오디오 플레이어 UI) */}
      {showPreview && (
        <ModalOverlay onClick={() => setShowPreview(false)}>
          <Modal role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>미리듣기 — {SAMPLE_AUDIO.name}</ModalTitle>
              <CloseBtn aria-label="닫기" onClick={() => setShowPreview(false)}>×</CloseBtn>
            </ModalHeader>
            <ModalBody>
              <MockAudio>
                <Waveform />
                <ControlBar>
                  <Progress><ProgressFill style={{ width: "35%" }} /></Progress>
                  <TimeText>00:50 / {SAMPLE_AUDIO.duration}</TimeText>
                  <CtlButtons>
                    <CtlBtn>⏯</CtlBtn>
                    <CtlBtn>⏪</CtlBtn>
                    <CtlBtn>⏩</CtlBtn>
                    <CtlBtn>🔈</CtlBtn>
                    <CtlBtn>⚙️</CtlBtn>
                  </CtlButtons>
                </ControlBar>
              </MockAudio>
              <SmallHint style={{ marginTop: 8 }}>
                * 데모 전용 UI입니다. 실제 오디오 재생은 구현하지 않았습니다.
              </SmallHint>
            </ModalBody>
            <ModalFooter>
              <ModalAction onClick={() => setShowPreview(false)}>닫기</ModalAction>
            </ModalFooter>
          </Modal>
        </ModalOverlay>
      )}

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
          <IconBtnSmall onClick={onShowWhy}><TipIcon /></IconBtnSmall>
          <ExpandBtn onClick={onToggleOpen}><ChevronDown $open={open} /></ExpandBtn>
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
  position: sticky;
  top: 0;
  z-index: 10;
  height: ${S.headerH}px;
  display: grid;
  grid-template-columns: 56px 1fr 56px;
  align-items: center;
  border-bottom: 1px solid ${C.line};
  background: #fff;
`;
const Title = styled.div`justify-self:center;font-weight:800;`;
const IconBtn = styled.button`
  border: 0;
  background: transparent;
  height: 100%;
  display: grid;
  place-items: center;
  cursor: pointer;
`;

const Section = styled.div`padding:12px ${S.padX}px 0;`;
const HeroBox = styled.div`
  border: 1px solid ${C.line};
  border-radius: ${R.img}px;
  overflow: hidden;
  background: #fff;
`;
const Hero = styled.img`
  width: 100%;
  aspect-ratio: 16/10;
  object-fit: cover;
  display: block;
`;

const Tabs = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 10px ${S.padX}px 0;
  border-bottom: 1px solid ${C.line};
  background: #fff;
`;
const TabLink = styled(NavLink)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0;
  font-weight: 700;
  color: ${C.sub};
  text-decoration: none;
  position: relative;
  cursor: pointer;

  &.active { color: ${C.blue}; }
`;

const Card = styled.section`
  margin: 12px ${S.padX}px;
  padding: 12px;
  background: #fff;
  border: 1px solid ${C.line};
  border-radius: ${R.card}px;
`;
const CardHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
`;
const HeadLeft = styled.div`display:inline-flex;align-items:center;gap:8px;`;
const HeadTitle = styled.b`font-weight:800;`;

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const GroupLabel = styled.li`
  margin: 10px 2px 2px;
  font-size: 12px;
  font-weight: 800;
  color: ${C.sub};
`;

const Item = styled.li`
  border: 1px solid ${C.line};
  border-radius: 12px;
  background: #fff;
`;
const ItemHead = styled.div`
  display: grid;
  grid-template-columns: 36px 1fr auto;
  align-items: center;
  gap: 6px;
  padding: 10px;
`;

const CheckWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const CheckBox = styled.button`
  width: 22px;
  height: 22px;
  border-radius: 6px;
  border: 1.5px solid ${(p) => (p.$on ? C.blue : C.line)};
  background: ${(p) => (p.$on ? C.blue : "#fff")};
  display: flex;
  align-items: center;
  justify-content: center;
`;
const ItemTitle = styled.div`
  font-weight: 800;
  color: ${(p) => (p.$dim ? "#9AA0A6" : C.text)};
`;
const BtnGroup = styled.div`display:flex;gap:4px;`;
const IconBtnSmall = styled.button`
  border: 0;
  background: transparent;
  width: 26px;
  height: 26px;
  cursor: pointer;
  border-radius: 50%;
  &:hover { background: ${C.soft}; }
`;
const ExpandBtn = styled.button`
  border: 0;
  background: transparent;
  width: 26px;
  height: 26px;
  cursor: pointer;
`;

const ItemBody = styled.div`
  border-top: 1px dashed ${C.line};
  background: ${C.soft};
  padding: 10px;
`;
const Row = styled.div`display:grid;grid-template-columns:110px 1fr;gap:8px;`;
const RowKey = styled.div`font-size:13px;font-weight:800;color:${C.sub};`;
const RowVal = styled.div`font-size:14px;`;

/* 하단 버튼 */
const Bottom = styled.div`
  position: sticky;
  bottom: 0;
  background: #fff;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 10px;
  border-top: 1px solid ${C.line};
`;
const GhostBtn = styled.button`
  height: 48px;
  border-radius: 14px;
  border: 1px solid ${C.blue};
  color: ${C.blue};
  background: #fff;
  font-weight: 800;
`;
const PrimaryBtn = styled.button`
  height: 48px;
  border-radius: 14px;
  border: 0;
  background: ${C.blue};
  color: #fff;
  font-weight: 800;
`;

/* 모달 */
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: ${C.overlay};
  display: grid;
  place-items: center;
  z-index: 1000;
  padding: 20px;
`;
const Modal = styled.div`
  width: 100%;
  max-width: 560px;
  background: #fff;
  border-radius: 16px;
  border: 1px solid ${C.line};
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;
const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid ${C.line};
`;
const ModalTitle = styled.h3`margin:0;font-size:16px;font-weight:800;`;
const CloseBtn = styled.button`
  width: 32px;
  height: 32px;
  border: 0;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  font-size: 20px;
  line-height: 1;
  color: ${C.sub};
  &:hover { background: ${C.soft}; }
`;
const ModalBody = styled.div`
  padding: 16px;
  color: ${C.text};
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
`;
const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid ${C.line};
`;
const ModalAction = styled.button`
  height: 40px;
  padding: 0 16px;
  border-radius: 10px;
  border: 0;
  cursor: pointer;
  font-weight: 800;
  background: ${C.blue};
  color: #fff;
`;

/* ===== 음성 샘플 UI 스타일 ===== */
const FileRow = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 10px;
  align-items: center;
  padding: 10px;
  border: 1px solid ${C.line};
  border-radius: 12px;
  background: #fff;
  margin-bottom: 10px;
`;
const FileBadge = styled.div`
  min-width: 44px;
  height: 28px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
  color: #1e40af;
  background: #e0ebff;
  border: 1px solid #cfe0ff;
  text-transform: uppercase;
`;
const FileName = styled.div`
  font-weight: 800;
  color: ${C.text};
  font-size: 14px;
  line-height: 1.2;
`;
const FileMeta = styled.div`
  font-size: 12px;
  color: ${C.sub};
  margin-top: 4px;
`;
const FileActions = styled.div`
  display: inline-flex;
  gap: 6px;
`;
const PreviewBtn = styled.button`
  height: 32px;
  padding: 0 12px;
  border-radius: 10px;
  border: 0;
  background: ${C.blue};
  color: #fff;
  font-weight: 800;
  cursor: pointer;
`;
const GhostSmall = styled.button`
  height: 32px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid ${C.line};
  background: #fff;
  color: ${C.sub};
  font-weight: 800;
  cursor: pointer;
`;

/* 인라인 오디오 미리보기(파형 박스) */
const AudioMock = styled.div`
  position: relative;
  width: 100%;
  height: 88px;
  border-radius: 12px;
  border: 1px solid ${C.line};
  background: #0b1020;
  display: grid;
  place-items: center;
  cursor: pointer;
  overflow: hidden;
`;
const PlayGlyph = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255,255,255,.9);
  display: grid;
  place-items: center;
  box-shadow: 0 6px 16px rgba(0,0,0,.18);
  &:before {
    content: "";
    display: block;
    margin-left: 3px;
    width: 0; height: 0;
    border-left: 14px solid #111827;
    border-top: 9px solid transparent;
    border-bottom: 9px solid transparent;
  }
`;
const MiniWave = styled.div`
  position: absolute;
  inset: 0;
  opacity: .45;
  background:
    repeating-linear-gradient(
      90deg,
      rgba(255,255,255,.6) 0 2px,
      rgba(255,255,255,.08) 2px 10px
    );
  mask-image: linear-gradient(180deg, rgba(0,0,0,0) 0%, #000 30%, #000 70%, rgba(0,0,0,0) 100%);
`;
const TimeBadge = styled.div`
  position: absolute;
  right: 10px;
  bottom: 10px;
  height: 24px;
  padding: 0 8px;
  border-radius: 6px;
  background: rgba(0,0,0,.55);
  color: #fff;
  font-size: 12px;
  font-weight: 800;
`;

/* 모달 속 가짜 오디오 플레이어 */
const MockAudio = styled.div`
  border: 1px solid ${C.line};
  border-radius: 12px;
  overflow: hidden;
  background: #0b1020;
`;
const Waveform = styled.div`
  height: 140px;
  background:
    linear-gradient(180deg, rgba(255,255,255,.12), rgba(255,255,255,0)) 0 0/100% 50% no-repeat,
    repeating-linear-gradient(90deg, rgba(255,255,255,.6) 0 3px, rgba(255,255,255,.06) 3px 12px);
`;
/* 공용 하단 컨트롤바 */
const ControlBar = styled.div`
  padding: 10px 12px 12px 12px;
  background: #0b1020;
  border-top: 1px solid rgba(255,255,255,.06);
`;
const Progress = styled.div`
  height: 6px;
  background: rgba(255,255,255,.15);
  border-radius: 999px;
  overflow: hidden;
`;
const ProgressFill = styled.div`
  height: 100%;
  background: ${C.blue};
  border-radius: 999px;
`;
const TimeText = styled.div`
  margin-top: 8px;
  font-size: 12px;
  color: rgba(255,255,255,.75);
`;
const CtlButtons = styled.div`
  margin-top: 8px;
  display: flex;
  gap: 6px;
`;
const CtlBtn = styled.button`
  height: 30px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,.12);
  background: rgba(255,255,255,.04);
  color: #fff;
  font-weight: 700;
  cursor: default;
`;

/* 메모 */
const MemoArea = styled.textarea`
  width: 95%;
  margin-top: 8px;
  border: 1px solid ${C.line};
  border-radius: 12px;
  padding: 12px;
  font-size: 14px;
  color: ${C.text};
  background: ${C.soft};
  resize: vertical;
`;
const HelperRow = styled.div`
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
`;
const SmallHint = styled.span`
  font-size: 12px;
  color: ${C.sub};
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
function AudioIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path d="M12 14a3 3 0 0 0 3-3V7a3 3 0 0 0-6 0v4a3 3 0 0 0 3 3Zm7-3a7 7 0 0 1-14 0M12 21v-3" stroke={C.blue} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function NoteIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path d="M8 7h8M8 11h8M8 15h5" stroke={C.blue} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 3h10l4 4v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" stroke={C.blue} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
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
