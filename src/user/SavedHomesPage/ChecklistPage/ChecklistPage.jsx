import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ChecklistHeader from "./ChecklistHeader";
import PhotoSection from "./PhotoSection";
import BasicInfoSection from "./BasicInfoSection";
import RatingSection from "./RatingSection";
import ToggleSection from "./ToggleSection";
import RecordingSection from "./RecordingSection";
import MemoSection from "./MemoSection";

/* ===== Layout ===== */
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
  font-family: Andika, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
`;

const ContentArea = styled.div`
  padding: 0 16px;
  padding-bottom: 24px;
  box-sizing: border-box;
  overflow-x: hidden;
`;

const GlobalWrapper = styled.div`
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
`;

const SaveButton = styled.button`
  width: 100%;
  height: 50px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(59,130,246,0.3);
  transition: all 0.2s ease;

  &:hover {
    background: #2563eb;
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(59,130,246,0.4);
  }
  &:active {
    transform: translateY(0);
  }
`;

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
  return (
    <SummarySection>
      <SummaryTitle>요약내용</SummaryTitle>
      <SummaryContent>{summary || "500자까지 요약내용이 기록됩니다."}</SummaryContent>
    </SummarySection>
  );
}

/* ===== Page ===== */
export default function ChecklistPage() {
  const navigate = useNavigate();

  const [checklistData, setChecklistData] = useState({
    photos: [],
    buildingName: "",
    address: "",
    ratings: {
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
    recording: null,
    summary: "",
    memo: "",
  });
  const [rentType, setRentType] = useState("월세");

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
  };

  const handleDataChange = (section, data) => {
    setChecklistData((prev) => ({
      ...prev,
      [section]:
        typeof data === "object" && data !== null
          ? { ...prev[section], ...data }
          : data,
    }));
  };

  const handleRentTypeChange = (_index, value) => setRentType(value);

  return (
    <GlobalWrapper>
      <ChecklistContainer>
        <ChecklistHeader title="체크리스트" onBack={handleBack} />

        <ContentWrapper>
          <TabSection>
            <Tab>정보</Tab>
          </TabSection>

          <ContentArea>
            <PhotoSection
              photos={checklistData.photos}
              onChange={(photos) => handleDataChange("photos", photos)}
            />

            <BasicInfoSection
              buildingName={checklistData.buildingName}
              address={checklistData.address}
              leftOption="월세"
              rightOption="전세"
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
      </ChecklistContainer>
    </GlobalWrapper>
  );
}
