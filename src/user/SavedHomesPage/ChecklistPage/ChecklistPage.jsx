<<<<<<< HEAD
import { useState } from "react";
=======
import { useState, useEffect } from "react";
>>>>>>> bc186fb (메인페이지 수정, 체크리스트 구현, 나의 상세보기 구현)
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ChecklistHeader from "./ChecklistHeader";
import PhotoSection from "./PhotoSection";
import BasicInfoSection from "./BasicInfoSection";
import RatingSection from "./RatingSection";
import ToggleSection from "./ToggleSection";
import RecordingSection from "./RecordingSection";
import MemoSection from "./MemoSection";
<<<<<<< HEAD

/* ===== Layout ===== */
=======
import StatusBar from "../../../mainpage/StatusBar";
import ToggleTab from "./ToggleTab";

>>>>>>> bc186fb (메인페이지 수정, 체크리스트 구현, 나의 상세보기 구현)
const ChecklistContainer = styled.div`
  min-height: 100vh;
  background: #ffffff;
  overflow-x: hidden;
  width: 100%;
  position: relative;
`;

const ContentWrapper = styled.div`
  padding: 0;
  margin: 0 auto;
  max-width: 390px;
  width: 100%;
  overflow-x: hidden;
`;

const TabSection = styled.div`
  border-bottom: 2px solid #17191a;
  width: 100%;
  height: 56px;
  justify-content: center;
  align-items: center;
  display: flex;
  padding: 0 16px;
`;

const Tab = styled.span`
  border: none;
  background: none;
  font-size: 18px;
  font-weight: 700;
  color: #111827;
<<<<<<< HEAD
  font-family: Andika, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
=======
  font-family: Andika;
>>>>>>> bc186fb (메인페이지 수정, 체크리스트 구현, 나의 상세보기 구현)
`;

const ContentArea = styled.div`
  padding: 0 16px;
<<<<<<< HEAD
  padding-bottom: 24px;
=======
  padding-bottom: 100px;
>>>>>>> bc186fb (메인페이지 수정, 체크리스트 구현, 나의 상세보기 구현)
  box-sizing: border-box;
  overflow-x: hidden;
`;

const GlobalWrapper = styled.div`
<<<<<<< HEAD
  * { box-sizing: border-box; }
`;

/* ===== Sticky 저장 바 ===== */
const StickyButtonBar = styled.div`
  position: sticky;
  bottom: 0;
  z-index: 10;
  margin: 16px auto 0;
  width: 100%;
  max-width: 390px;
  padding: 16px;
  background: linear-gradient(
    to top,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, 1) 70%,
    rgba(255, 255, 255, 0.9) 85%,
    rgba(255, 255, 255, 0) 100%
  );
  backdrop-filter: blur(8px);
  box-shadow: 0 -2px 12px rgba(0,0,0,.04);
=======
  * {
    box-sizing: border-box;
  }
`;

// 하단 고정 버튼 컨테이너
const FixedButtonContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 390px;
  padding: 16px;
  background: linear-gradient(to top, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 70%, rgba(255, 255, 255, 0.9) 85%, rgba(255, 255, 255, 0) 100%);
  backdrop-filter: blur(10px);
  z-index: 1000;
  pointer-events: none; /* 배경은 클릭 방지 */
>>>>>>> bc186fb (메인페이지 수정, 체크리스트 구현, 나의 상세보기 구현)
`;

const SaveButton = styled.button`
  width: 100%;
  height: 50px;
<<<<<<< HEAD
  background: #3b82f6;
=======
  background: ${(props) => (props.disabled ? "#9ca3af" : "#3b82f6")};
>>>>>>> bc186fb (메인페이지 수정, 체크리스트 구현, 나의 상세보기 구현)
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
<<<<<<< HEAD
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(59,130,246,0.3);
  transition: all 0.2s ease;

  &:hover {
    background: #2563eb;
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(59,130,246,0.4);
  }
  &:active {
=======
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  box-shadow: ${(props) => (props.disabled ? "none" : "0 4px 12px rgba(59, 130, 246, 0.3)")};
  transition: all 0.2s ease;
  pointer-events: auto; /* 버튼은 클릭 가능 */

  &:hover:not(:disabled) {
    background: #2563eb;
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
  }

  &:active:not(:disabled) {
>>>>>>> bc186fb (메인페이지 수정, 체크리스트 구현, 나의 상세보기 구현)
    transform: translateY(0);
  }
`;

<<<<<<< HEAD
/* ===== 요약 ===== */
const SummarySection = styled.section` margin: 32px 0; `;
const SummaryTitle = styled.p`
  font-family: Andika, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  font-size: 16px; font-weight: 700; color: #000; margin: 0 0 8px 0;
`;
const SummaryContent = styled.div`
  background: #f8f9fa; padding: 16px; border-radius: 8px; border: 1px solid #e9ecef;
  min-height: 60px; font-size: 14px; color: #6c757d; line-height: 1.5; height: 118px;
`;
function SummaryContentSection({ summary }) {
=======
// 요약내용 섹션 스타일
const SummarySection = styled.section`
  margin: 32px 0;
`;

const SummaryTitle = styled.p`
  font-family: Andika;
  font-size: 16px;
  font-weight: 700;
  color: #000000;
  margin: 0 0 8px 0;
`;

const SummaryContent = styled.div`
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  min-height: 60px;
  font-size: 14px;
  color: #6c757d;
  line-height: 1.5;
  height: 118px;
`;

// 요약내용 컴포넌트
function SummaryContentSection({ summary, onChange }) {
>>>>>>> bc186fb (메인페이지 수정, 체크리스트 구현, 나의 상세보기 구현)
  return (
    <SummarySection>
      <SummaryTitle>요약내용</SummaryTitle>
      <SummaryContent>{summary || "500자까지 요약내용이 기록됩니다."}</SummaryContent>
    </SummarySection>
  );
}

<<<<<<< HEAD
/* ===== Page ===== */
export default function ChecklistPage() {
  const navigate = useNavigate();

=======
export default function ChecklistPage() {
  const navigate = useNavigate();
  const [isButtonVisible, setIsButtonVisible] = useState(true);

  // 체크리스트 데이터 상태
>>>>>>> bc186fb (메인페이지 수정, 체크리스트 구현, 나의 상세보기 구현)
  const [checklistData, setChecklistData] = useState({
    photos: [],
    buildingName: "",
    address: "",
    ratings: {
<<<<<<< HEAD
      lighting: 0,
      waterPressure: 0,
      soundproofing: 0,
      structure: 0,
      security: 0,
      noise: 0,
      environment: 0,
      waste: 0,
    },
    toggles: { elevator: false, veranda: false, pets: false },
=======
      lighting: 0, // 채광 및 전망
      waterPressure: 0, // 수압 및 배수
      soundproofing: 0, // 청결 및 곰팡이
      structure: 0, // 옵션 및 구조
      security: 0, // 보안 및 시설
      noise: 0, // 소음
      environment: 0, // 주변 환경
      waste: 0, // 분리수거
    },
    toggles: {
      elevator: false,
      veranda: false,
      pets: false,
    },
>>>>>>> bc186fb (메인페이지 수정, 체크리스트 구현, 나의 상세보기 구현)
    recording: null,
    summary: "",
    memo: "",
  });
  const [rentType, setRentType] = useState("월세");

<<<<<<< HEAD
  const handleBack = () => navigate(-1);

  const handleSave = () => {
    // 클릭 피드백
    const btn = document.querySelector("[data-save-button]");
    if (btn) {
      btn.style.transform = "scale(0.95)";
      setTimeout(() => (btn.style.transform = "scale(1)"), 160);
    }

    // 저장(더미)
    console.log("체크리스트 저장:", { ...checklistData, rentType });

    // 입력이 비어도 기본값으로 이동
    const item = {
      aptNm: checklistData.buildingName || "미정",
      address: checklistData.address || "주소 미입력",
      사진: checklistData.photos?.[0] || "",
    };

    navigate("/homedetailpage", { state: { item }, replace: true });
=======
  // 스크롤 이벤트로 버튼 표시/숨김 (옵션)
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateButtonVisibility = () => {
      const scrollY = window.scrollY;
      lastScrollY = scrollY;
      ticking = false;
    };
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSave = () => {
    console.log("체크리스트 저장:", checklistData);

    // 저장 애니메이션 효과
    const button = document.querySelector("[data-save-button]");
    if (button) {
      button.style.transform = "scale(0.95)";
      setTimeout(() => {
        button.style.transform = "scale(1)";
      }, 150);
    }

    alert("저장되었습니다!");
>>>>>>> bc186fb (메인페이지 수정, 체크리스트 구현, 나의 상세보기 구현)
  };

  const handleDataChange = (section, data) => {
    setChecklistData((prev) => ({
      ...prev,
<<<<<<< HEAD
      [section]:
        typeof data === "object" && data !== null
          ? { ...prev[section], ...data }
          : data,
    }));
  };

  const handleRentTypeChange = (_index, value) => setRentType(value);
=======
      [section]: typeof data === "object" ? { ...prev[section], ...data } : data,
    }));
  };

  const handleRentTypeChange = (index, value) => {
    setRentType(value);
    console.log("선택된 옵션:", value);
  };

  const isSaveDisabled = !checklistData.buildingName.trim() || !checklistData.address.trim();
>>>>>>> bc186fb (메인페이지 수정, 체크리스트 구현, 나의 상세보기 구현)

  return (
    <GlobalWrapper>
      <ChecklistContainer>
<<<<<<< HEAD
        <ChecklistHeader title="체크리스트" onBack={handleBack} />

        <ContentWrapper>
=======
        <StatusBar />
        <ChecklistHeader title="체크리스트" onBack={handleBack} />

        <ContentWrapper>
          {/* 정보 탭 */}
>>>>>>> bc186fb (메인페이지 수정, 체크리스트 구현, 나의 상세보기 구현)
          <TabSection>
            <Tab>정보</Tab>
          </TabSection>

          <ContentArea>
<<<<<<< HEAD
            <PhotoSection
              photos={checklistData.photos}
              onChange={(photos) => handleDataChange("photos", photos)}
            />

=======
            {/* 사진 추가 섹션 */}
            <PhotoSection photos={checklistData.photos} onChange={(photos) => handleDataChange("photos", photos)} />

            {/* 기본 정보 섹션 */}
>>>>>>> bc186fb (메인페이지 수정, 체크리스트 구현, 나의 상세보기 구현)
            <BasicInfoSection
              buildingName={checklistData.buildingName}
              address={checklistData.address}
              leftOption="월세"
              rightOption="전세"
<<<<<<< HEAD
              defaultValue={rentType === "월세" ? 0 : 1}
              onToggleChange={handleRentTypeChange}
              onChange={(field, value) =>
                setChecklistData((prev) => ({ ...prev, [field]: value }))
              }
            />

            <RatingSection
              ratings={checklistData.ratings}
              onChange={(ratings) => handleDataChange("ratings", ratings)}
            />

            <ToggleSection
              toggles={checklistData.toggles}
              onChange={(toggles) => handleDataChange("toggles", toggles)}
            />

            <RecordingSection
              recording={checklistData.recording}
              onChange={(recording) => handleDataChange("recording", recording)}
            />

            <SummaryContentSection summary={checklistData.summary} />

            <MemoSection
              memo={checklistData.memo}
              onChange={(memo) => handleDataChange("memo", memo)}
            />
          </ContentArea>
        </ContentWrapper>

        {/* 항상 보이는 sticky 저장 바 */}
        <StickyButtonBar>
          <SaveButton
            data-save-button
            type="button"
            onClick={handleSave}
          >
            저장하기
          </SaveButton>
        </StickyButtonBar>
=======
              defaultValue={0}
              onToggleChange={handleRentTypeChange}
              onChange={(field, value) => {
                setChecklistData((prev) => ({
                  ...prev,
                  [field]: value,
                }));
              }}
            />

            {/* 월세/전세 토글
            <div style={{ margin: "24px 0", display: "flex", justifyContent: "flex-start" }}>
              <ToggleTab leftOption="월세" rightOption="전세" defaultValue={0} onToggleChange={handleRentTypeChange} />
            </div> */}

            {/* 평점 섹션들 */}
            <RatingSection ratings={checklistData.ratings} onChange={(ratings) => handleDataChange("ratings", ratings)} />

            {/* 토글 섹션 */}
            <ToggleSection toggles={checklistData.toggles} onChange={(toggles) => handleDataChange("toggles", toggles)} />

            {/* 녹음 섹션 */}
            <RecordingSection recording={checklistData.recording} onChange={(recording) => handleDataChange("recording", recording)} />

            {/* 요약내용 섹션 */}
            <SummaryContentSection summary={checklistData.summary} onChange={(summary) => handleDataChange("summary", summary)} />

            {/* 메모 섹션 */}
            <MemoSection memo={checklistData.memo} onChange={(memo) => handleDataChange("memo", memo)} />
          </ContentArea>
        </ContentWrapper>

        {/* 하단 고정 저장 버튼 */}
        {isButtonVisible && (
          <FixedButtonContainer>
            <SaveButton data-save-button onClick={handleSave} disabled={isSaveDisabled}>
              저장하기
            </SaveButton>
          </FixedButtonContainer>
        )}
>>>>>>> bc186fb (메인페이지 수정, 체크리스트 구현, 나의 상세보기 구현)
      </ChecklistContainer>
    </GlobalWrapper>
  );
}
