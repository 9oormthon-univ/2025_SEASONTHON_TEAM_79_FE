import styled from "styled-components";
import { useState } from "react";
import { checkItemsData } from "./RecordingSection/utils/checkItemsData";

const RatingContainer = styled.section`
  padding-top: 24px;
`;

const RatingItem = styled.div`
  margin-bottom: 24px;
`;

const RatingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const RatingTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RatingTitle = styled.p`
  font-family: Andika;
  font-size: 16px;
  font-weight: 700;
  color: #17191a;
  margin: 0;
`;
// 전구 아이콘 버튼
const InfoButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s ease;

  &:hover {
    background: rgba(59, 130, 246, 0.1);
  }

  svg {
    width: 16px;
    height: 16px;
    color: #6b7280;
  }
`;

const RatingValue = styled.span`
  font-family: Andika;
  font-size: 16px;
  font-weight: 700;
  color: #3b82f6;
  background: #f4f7ff;
  min-width: 32px;
  text-align: right;
`;

// 전구 팝업 관련 스타일
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  max-width: 320px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const ModalTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ModalTitle = styled.h3`
  font-family: Andika;
  font-size: 18px;
  font-weight: 700;
  color: #000000;
  margin: 0;
`;

const CheckIcon = styled.div`
  display: flex;
  align-items: center;
`;

// X 버튼
const CloseButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #6b7280;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
    color: #374151;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const ModalContent = styled.div`
  margin-bottom: 0;
`;

const CheckItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 29px;
  font-size: 16px;
  line-height: 1.5;

  &:last-child {
    margin-bottom: 0;
  }
`;

const CheckText = styled.div`
  color: #4b5563;
  flex: 1;
  font-weight: 400;
`;

// 점수 부분 스타일링
const ScoreText = styled.span`
  font-weight: 700;
  color: #464a4d;
`;

const NormalText = styled.span`
  font-weight: 400;
  color: #464a4d;
`;

const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  height: 40px;
`;

const SliderLabel = styled.span`
  font-size: 14px;
  color: #6b7280;
  width: 24px;
  text-align: center;
  font-weight: 500;
`;

const SliderWrapper = styled.div`
  display: flex;
  flex: 1;
  position: relative;
  height: 6px;
`;

const Slider = styled.input`
  width: 100%;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  outline: none;
  -webkit-appearance: none;
  position: relative;
  z-index: 2;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 6px;
    background: #0073e6;
    border-radius: 3px;
    z-index: -1;

    /* 현재 값에 따라 width 동적 계산 */
    width: ${(props) => {
      if (!props.value || props.value === 0) return "0%";
      const percentage = (parseFloat(props.value) / parseFloat(props.max)) * 100;
      return `${percentage}%`;
    }};
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    background: #ffffff;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid #ffffff;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
    position: relative;
    z-index: 1;
  }

  &::-webkit-slider-thumb:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background: #3b82f6;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid #ffffff;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
    position: relative;
    z-index: 1;
  }

  &::-moz-range-track {
    height: 6px;
    background: #e5e7eb;
    border-radius: 3px;
    border: none;
  }

  /* Firefox에서 진행 바 표시 */
  &::-moz-range-progress {
    height: 6px;
    background: linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%);
    border-radius: 3px;
    border: none;
  }
`;

// 점수 부분을 파싱하는 함수
const parseScoreText = (text) => {
  // "5점:", "4점:", "3점:" 등을 찾아서 분리
  const scoreMatch = text.match(/^(\d+점:?\s*)(.*)/);

  if (scoreMatch) {
    return {
      score: scoreMatch[1], // "5점: "
      description: scoreMatch[2], // 나머지 설명
    };
  }

  return {
    score: "",
    description: text,
  };
};

const ratingItems = [
  { key: "lighting", label: "채광 및 전망" },
  { key: "waterPressure", label: "수압 및 배수" },
  { key: "soundproofing", label: "청결 및 곰팡이" },
  { key: "structure", label: "옵션 및 구조" },
  { key: "security", label: "보안 및 시설" },
  { key: "noise", label: "소음" },
  { key: "environment", label: "주변 환경" },
  { key: "waste", label: "분리수거" },
];

const popupIcon = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5.63199 13.9096C3.97949 12.6129 2.91699 10.5971 2.91699 8.33333C2.91699 4.42125 6.08824 1.25 10.0003 1.25C13.9124 1.25 17.0837 4.42125 17.0837 8.33333C17.0837 10.5971 16.0216 12.6129 14.3687 13.9096C14.2467 14.3965 14.1117 14.88 13.9637 15.3596C13.8362 15.7754 13.4907 16.0775 13.0578 16.1229C12.4774 16.1833 11.4987 16.25 10.0003 16.25C8.50199 16.25 7.52324 16.1833 6.94283 16.1229C6.50991 16.0775 6.16449 15.7754 6.03699 15.3592C5.91741 14.9704 5.76616 14.4508 5.63199 13.9096Z"
      stroke="#464A4D"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.87012 16.1125C6.9547 16.6583 7.04262 17.155 7.11595 17.5475C7.22012 18.0996 7.61262 18.5429 8.16803 18.6267C8.60387 18.6929 9.20928 18.75 10.0001 18.75C10.7522 18.75 11.3701 18.6983 11.8405 18.6367C12.5005 18.55 12.963 18.0008 13.0347 17.3387L13.1685 16.1054M14.1668 7.91667C14.1668 5.61542 12.3014 3.75 10.0001 3.75"
      stroke="#464A4D"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const InfoModal = ({ isOpen, onClose, title, items }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitleWrapper>
            <CheckIcon>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.333 8.16602L11.6663 19.8327L5.83301 13.9993" stroke="#0073E6" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </CheckIcon>
            <ModalTitle>{title}</ModalTitle>
          </ModalTitleWrapper>

          {/* X 버튼 */}
          <CloseButton onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </CloseButton>
        </ModalHeader>

        <ModalContent>
          {items.map((item, index) => {
            const { score, description } = parseScoreText(item);

            return (
              <CheckItem key={index}>
                <CheckText>
                  {score && <ScoreText>{score}</ScoreText>}
                  <NormalText>{description}</NormalText>
                </CheckText>
              </CheckItem>
            );
          })}
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default function RatingSection({ ratings, onChange }) {
  const [modalInfo, setModalInfo] = useState({ isOpen: false, title: "", items: [] });
  const handleRatingChange = (key, value) => {
    const numValue = parseFloat(value);
    onChange({
      ...ratings,
      [key]: numValue,
    });
  };

  const handleInfoClick = (key) => {
    const checkData = checkItemsData[key];
    if (checkData) {
      setModalInfo({
        isOpen: true,
        title: checkData.title,
        items: checkData.items,
      });
    }
  };

  const closeModal = () => {
    setModalInfo({ isOpen: false, title: "", items: [] });
  };
  return (
    <RatingContainer>
      {ratingItems.map((item) => {
        const currentValue = ratings[item.key] || 0;

        return (
          <RatingItem key={item.key}>
            <RatingHeader>
              <RatingTitleWrapper>
                <RatingTitle>{item.label}</RatingTitle>
                <InfoButton onClick={() => handleInfoClick(item.key, item.label)}>{popupIcon}</InfoButton>
              </RatingTitleWrapper>
              <RatingValue>{currentValue}점</RatingValue>
            </RatingHeader>
            <SliderContainer>
              <SliderLabel>0점</SliderLabel>
              <SliderWrapper>
                <Slider
                  type="range"
                  min="0"
                  max="5"
                  step="1"
                  value={currentValue}
                  onChange={(e) => handleRatingChange(item.key, e.target.value)}
                  onInput={(e) => handleRatingChange(item.key, e.target.value)} // 실시간 업데이트
                />
              </SliderWrapper>
              <SliderLabel>5점</SliderLabel>
            </SliderContainer>
          </RatingItem>
        );
      })}

      {/* 평가 기준 아이콘 */}
      <InfoModal isOpen={modalInfo.isOpen} onClose={closeModal} title={modalInfo.title} items={modalInfo.items} />
    </RatingContainer>
  );
}
