// src/components/SimpleToggleTab.jsx
import { useState } from "react";
import styled from "styled-components";

const ToggleContainer = styled.div`
  display: inline-flex;
  background: #efefef;
  border-radius: 100px;
  padding: 6px 10px 6px 10px;
  gap: 12px;
  position: relative;
  width: 112px;
  height: 40px;
`;

const ToggleOption = styled.button`
  flex: 1;
  border: none;
  background: transparent;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s ease;
  position: relative;
  align-items: center;
  line-height: 20px;
  z-index: 2;

  color: ${(props) => (props.$active ? "#FFFFFF" : "#808080")};
`;

const ActiveBackground = styled.div`
  position: absolute;
  width: 56px;
  height: 32px;
  top: 4px;
  left: ${(props) => (props.$activeIndex === 0 ? "4px" : "50%")};
  background: #3299FF;
  border-radius: 20px;
  border: 2px solid #3299ff;
  transition: all 0.25s ease;
  z-index: 1;
`;

export default function ToggleTab({ leftOption = "월세", rightOption = "전세", defaultValue = 0, onChange }) {
  const [activeIndex, setActiveIndex] = useState(defaultValue);

  const handleToggle = (index) => {
    setActiveIndex(index);
    onChange?.(index, index === 0 ? leftOption : rightOption);
  };

  return (
    <ToggleContainer>
      <ActiveBackground $activeIndex={activeIndex} />

      <ToggleOption $active={activeIndex === 0} onClick={() => handleToggle(0)}>
        {leftOption}
      </ToggleOption>

      <ToggleOption $active={activeIndex === 1} onClick={() => handleToggle(1)}>
        {rightOption}
      </ToggleOption>
    </ToggleContainer>
  );
}
