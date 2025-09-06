import styled from "styled-components";

const RatingContainer = styled.section`
  padding: 24px 0;
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

const RatingTitle = styled.p`
  font-family: Andika;
  font-size: 16px;
  font-weight: 700;
  color: #17191a;
  margin: 0;
`;

const RatingValue = styled.span`
  font-family: Andika;
  font-size: 16px;
  font-weight: 700;
  color: #3b82f6;
  min-width: 32px;
  text-align: right;
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
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 6px;
    background: linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%);
    border-radius: 3px;
    z-index: -1;
    
    /* 현재 값에 따라 width 동적 계산 */
    width: ${(props) => {
      if (!props.value || props.value === 0) return '0%';
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

export default function RatingSection({ ratings, onChange }) {
  const handleRatingChange = (key, value) => {
    const numValue = parseFloat(value);
    onChange({
      ...ratings,
      [key]: numValue,
    });
  };

  // 실시간으로 값 표시하는 함수
  const formatRatingValue = (value) => {
    if (value === 0) return "0점";
    return `${value.toFixed(1)}점`;
  };

  return (
    <RatingContainer>
      {ratingItems.map((item) => {
        const currentValue = ratings[item.key] || 0;

        return (
          <RatingItem key={item.key}>
            <RatingHeader>
              <RatingTitle>{item.label}</RatingTitle>
              <RatingValue>{formatRatingValue(currentValue)}</RatingValue>
            </RatingHeader>
            <SliderContainer>
              <SliderLabel>0점</SliderLabel>
              <SliderWrapper>
                <Slider
                  type="range"
                  min="0"
                  max="5"
                  step="0.1"
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
    </RatingContainer>
  );
}
