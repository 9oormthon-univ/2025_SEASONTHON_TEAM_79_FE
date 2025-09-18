import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ChecklistHeader from "./ChecklistHeader";
import PhotoSection from "./PhotoSection";
import BasicInfoSection from "./BasicInfoSection";
import RatingSection from "./RatingSection";
import ToggleSection from "./ToggleSection";
import RecordingSection from "./RecordingSection/RecordingSectionPage";
import MemoSection from "./MemoSection";
import SummaryProgressModal from "./SummaryProgressModal";

import { updateChecklistAPI } from "./RecordingSection/utils/audioAPI";

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
  * {
    box-sizing: border-box;
  }
`;

const FixedButtonBar = styled.div`
  position: fixed;
  bottom: 0;
  z-index: 900;
  transform: translateX(-50%);
  margin: 16px auto 0;
  width: 100%;
  left: 50%;
  max-width: 390px;
  padding: 16px;
`;

const SaveButton = styled.button`
  width: 100%;
  height: 50px;
  background: ${(props) => (props.$hasInput ? "#0073E6" : "#d1d5db")};
  color: ${(props) => (props.$hasInput ? "white" : "#9ca3af")};
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: ${(props) => (props.$hasInput ? "pointer" : "default")};
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => (props.$hasInput ? "#2563eb" : "#d1d5db")};
    transform: ${(props) => (props.$hasInput ? "translateY(-1px)" : "none")};
    box-shadow: ${(props) => (props.$hasInput ? "0 6px 16px rgba(59, 130, 246, 0.4)" : "0 2px 4px rgba(0, 0, 0, 0.1)")};
  }
  &:active {
    transform: ${(props) => (props.$hasInput ? "translateY(0)" : "none")};
  }
`;

/* ===== 요약 내용 ===== */
const SummarySection = styled.section`
  margin: 40px 0;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
`;

const SummaryHeader = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 16px 18.5px;
  background: #ffffff;
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  color: #000;
  font-family: Andika;
`;

const SummaryContent = styled.div`
  background: #fff;
  padding: ${(props) => (props.$isVisible ? "16px 20px" : "0 20px")};
  max-height: ${(props) => (props.$isVisible ? "500px" : "0")};
  overflow: hidden;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 400;
  line-height: 180%;
  color: #464a4d;
`;

const ArrowIcon = styled.div`
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
  transform: ${(props) => (props.$isVisible ? "rotate(180deg)" : "rotate(0deg)")};
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 16px;
    height: 16px;
    fill: #6b7280;
  }
`;

// SVG 아이콘 컴포넌트
const ChevronDownIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M19.4977 7.9888L12.0007 15.2968L4.50372 7.9888C4.36978 7.85796 4.18997 7.7847 4.00272 7.7847C3.81548 7.7847 3.63567 7.85796 3.50172 7.9888C3.43687 8.05235 3.38534 8.1282 3.35017 8.21191C3.31499 8.29561 3.29687 8.3855 3.29688 8.4763C3.29687 8.5671 3.31499 8.65699 3.35017 8.7407C3.38534 8.82441 3.43687 8.90025 3.50172 8.9638L11.4772 16.7398C11.6173 16.8763 11.8051 16.9527 12.0007 16.9527C12.1963 16.9527 12.3842 16.8763 12.5242 16.7398L20.4997 8.9653C20.565 8.90171 20.617 8.82567 20.6524 8.74169C20.6878 8.6577 20.7061 8.56746 20.7061 8.4763C20.7061 8.38514 20.6878 8.2949 20.6524 8.21092C20.617 8.12693 20.565 8.05089 20.4997 7.9873C20.3658 7.85646 20.186 7.7832 19.9987 7.7832C19.8115 7.7832 19.6317 7.85646 19.4977 7.9873V7.9888Z"
      fill="#464A4D"
    />
  </svg>
);

function SummaryAccordion({ summary, isVisible, onToggle }) {
  return (
    <SummarySection>
      <SummaryHeader onClick={onToggle}>
        <span>요약내용</span>
        <ArrowIcon $isVisible={isVisible}>
          <ChevronDownIcon />
        </ArrowIcon>
      </SummaryHeader>
      <SummaryContent $isVisible={isVisible}>{summary || "500자까지 요약내용이 기록됩니다."}</SummaryContent>
    </SummarySection>
  );
}

/* ===== Page ===== */
export default function ChecklistPage() {
  const navigate = useNavigate();

  const [checklistData, setChecklistData] = useState({
    photos: [],
    name: "",
    address: "",
    detailAddress: "",
    deposit: "",
    monthlyRent: "",
    maintenanceFee: "",
    area: "",
    roomStructure: "ONE_ROOM", // 🔥 중복 제거, 기본값 유지
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
    recordings: [],
    summary: "",
    memo: "",
  });
  const [rentType, setRentType] = useState("월세");
  const [isVisible, setIsVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [checklistId, setChecklistId] = useState(null); // 🔥 요약 후 받은 ID 저장
  const [summaryProgress, setSummaryProgress] = useState({
    isProcessing: false,
    status: "idle",
  });
  const [hasSummary, setHasSummary] = useState(false);

  // 입력 데이터가 있는지 확인하는 함수
  const hasInputData = useMemo(() => {
    const { photos, name, address, deposit, monthlyRent, maintenanceFee, area, ratings, toggles, recordings, memo } = checklistData;

    if (photos && photos.some((photo) => photo !== null && photo !== undefined)) return true;
    if (name?.trim() || address.trim()) return true;
    if (deposit.trim() || monthlyRent.trim() || maintenanceFee.trim() || area.trim()) return true;
    if (Object.values(ratings).some((rating) => rating > 0)) return true;
    if (Object.values(toggles).some((toggle) => toggle === true)) return true;
    if (recordings && recordings.length > 0) return true;
    if (memo.trim()) return true;

    return false;
  }, [checklistData]);

  // 🔥 저장 버튼 텍스트 함수
  const getSaveButtonText = () => {
    if (isSaving) return "저장 중...";
    if (!checklistId) return "저장하기";
    return "저장하기";
  };

  // 🔥 저장 버튼 비활성화 조건
  const isSaveButtonDisabled = isSaving || !hasInputData;

  const handleBack = () => navigate(-1);

  // 🔥 저장하기 함수 - PUT 요청으로 변경
  const handleSave = async () => {
    if (isSaveButtonDisabled) return;

    setIsSaving(true);

    try {
      // 임시로 딜레이를 주어 저장 중 상태를 보여줌
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("✅ 체크리스트 저장 완료");

      // 홈으로 이동
      navigate("/");
      // console.log("🔄 체크리스트 수정 시작..., ID:", checklistId);

      // // 🔥 PUT 요청으로 기존 체크리스트 수정
      // const result = await updateChecklistAPI(checklistData, rentType, checklistId);

      // console.log("✅ 체크리스트 수정 완료:", result);

      // alert(`체크리스트가 성공적으로 수정되었습니다!`);

      // // 상세 페이지로 이동하거나 목록으로 이동
      // // navigate("/userrecord");
    } catch (error) {
      console.error("❌ 수정 실패:", error);
      alert(`수정에 실패했습니다.\n${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDataChange = (section, data) => {
    setChecklistData((prev) => ({
      ...prev,
      [section]: section === "photos" ? data : typeof data === "object" && data !== null && !Array.isArray(data) ? { ...prev[section], ...data } : data,
    }));
  };

  const handleRentTypeChange = (_index, value) => setRentType(value);

  // 요약 시작 핸들러
  const handleSummaryStart = () => {
    console.log("🎤 요약 처리 시작 - 로딩 애니메이션 표시");
    setSummaryProgress({
      isProcessing: true,
      status: "loading",
    });
  };

  // 🔥 요약 완료/실패 핸들러
  const handleSummaryComplete = (summaryData, isSuccess = true) => {
    if (isSuccess) {
      console.log("✅ 요약 처리 완료 - 성공 애니메이션 표시");

      // 성공 애니메이션 표시
      setSummaryProgress({
        isProcessing: true,
        status: "success",
      });

      // 2초 후 모달 닫고 결과 표시
      setTimeout(() => {
        setSummaryProgress({
          isProcessing: false,
          status: "idle",
        });

        // 🔥 체크리스트 ID 저장 (중요!)
        setChecklistId(summaryData.checklistId);

        // 요약 결과 상태 업데이트
        setChecklistData((prev) => ({
          ...prev,
          summary: summaryData.summary,
          photos:
            summaryData.photos?.map((serverPhoto) => ({
              file: null,
              preview: null,
              caption: serverPhoto.caption,
              uploaded: true,
              id: serverPhoto.id,
              filename: serverPhoto.filename,
              contentType: serverPhoto.contentType,
              size: serverPhoto.size,
              createdAt: serverPhoto.createdAt,
              rawUrl: serverPhoto.rawUrl,
            })) || prev.photos,
        }));

        setHasSummary(true);
        setIsVisible(true); // 요약 아코디언 자동으로 열기
      }, 2000);
    } else {
      // 실패 처리
      console.error("❌ 요약 처리 실패");
      setSummaryProgress({
        isProcessing: false,
        status: "idle",
      });
    }
  };

  const handleSummaryToggle = () => {
    if (hasSummary) {
      setIsVisible((prev) => !prev);
    }
  };

  return (
    <GlobalWrapper>
      <ChecklistContainer>
        <ChecklistHeader title="체크리스트" onBack={handleBack} />

        <ContentWrapper>
          <TabSection>
            <Tab>정보</Tab>
          </TabSection>

          <ContentArea>
            <PhotoSection photos={checklistData.photos} onChange={(photos) => handleDataChange("photos", photos)} />

            <BasicInfoSection
              name={checklistData.name}
              address={checklistData.address}
              detailAddress={checklistData.detailAddress}
              deposit={checklistData.deposit}
              monthlyRent={checklistData.monthlyRent}
              maintenanceFee={checklistData.maintenanceFee}
              area={checklistData.area}
              roomStructure={checklistData.roomStructure}
              leftOption="월세"
              rightOption="전세"
              defaultValue={rentType === "월세" ? 0 : 1}
              onToggleChange={handleRentTypeChange}
              onChange={(field, value) => setChecklistData((prev) => ({ ...prev, [field]: value }))}
            />

            <RatingSection ratings={checklistData.ratings} onChange={(ratings) => handleDataChange("ratings", ratings)} />

            <ToggleSection toggles={checklistData.toggles} onChange={(toggles) => handleDataChange("toggles", toggles)} />

            <RecordingSection
              recording={checklistData.recordings}
              onChange={(recordings) => handleDataChange("recordings", recordings)}
              checklistId={checklistId}
              checklistData={checklistData}
              rentType={rentType}
              onSummaryStart={handleSummaryStart}
              onSummaryComplete={handleSummaryComplete}
            />

            {/* 요약이 완료된 경우에만 아코디언 표시 */}
            {hasSummary && <SummaryAccordion summary={checklistData.summary} isVisible={isVisible} onToggle={handleSummaryToggle} />}

            <MemoSection memo={checklistData.memo} onChange={(memo) => handleDataChange("memo", memo)} />
          </ContentArea>
        </ContentWrapper>

        {/* 🔥 저장 버튼 수정 */}
        <FixedButtonBar>
          <SaveButton data-save-button type="button" onClick={handleSave} $hasInput={!isSaveButtonDisabled} $saving={isSaving} disabled={isSaveButtonDisabled}>
            {getSaveButtonText()}
          </SaveButton>
        </FixedButtonBar>

        <SummaryProgressModal isVisible={summaryProgress.isProcessing} status={summaryProgress.status} />
      </ChecklistContainer>
    </GlobalWrapper>
  );
}
