import styled from "styled-components";

const ToggleContainer = styled.section`
  margin: 24px 0;
`;

const ToggleItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
`;

const ToggleLabel = styled.span`
  font-family: Andika;
  font-size: 16px;
  font-weight: 400;
  color: #17191a;
`;

const CheckboxWrapper = styled.div`
  position: relative;
  width: 28px;
  height: 28px;
  cursor: pointer;
`;

// 숨겨진 실제 checkbox
const HiddenCheckbox = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

// 커스텀 체크박스 스타일
const CustomCheckbox = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 28px;
  height: 28px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  transition: all 0.2s ease;
`;

// SVG 아이콘 - 중첩 제거하고 직접 path 사용
const CheckIcon = styled.svg`
  width: 28px;
  height: 28px;
  transition: all 0.15s ease;

  path {
    stroke: ${(props) => (props.$checked ? "#3b82f6" : "#A4ADB2")};
    strokeWidth: 1.66667;
    strokeLinecap: round;
    strokeLinejoin: round;
    fill: none;
    opacity: ${(props) => (props.$checked ? 1 : 0.5)};
    transition: all 0.2s ease;
  }
`;

const toggleItems = [
  { key: "elevator", label: "엘리베이터" },
  { key: "veranda", label: "베란다" },
  { key: "pets", label: "반려동물" },
];

export default function ToggleSection({ toggles, onChange }) {
  const handleToggle = (key) => {
    onChange({
      ...toggles,
      [key]: !toggles[key],
    });
  };

  return (
    <ToggleContainer>
      {toggleItems.map((item) => (
        <ToggleItem key={item.key}>
          <ToggleLabel>{item.label}</ToggleLabel>
          <CheckboxWrapper onClick={() => handleToggle(item.key)}>
            <HiddenCheckbox 
              type="checkbox" 
              checked={toggles[item.key]} 
              onChange={() => handleToggle(item.key)} 
            />
            <CustomCheckbox>
              <CheckIcon 
                $checked={toggles[item.key]}
                viewBox="0 0 28 28" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M23.334 8.16602L11.6673 19.8327L5.83398 13.9993"
                />
              </CheckIcon>
            </CustomCheckbox>
          </CheckboxWrapper>
        </ToggleItem>
      ))}
    </ToggleContainer>
  );
}