// src/assets/icons/CurvedBackground.jsx
import styled from "styled-components";

const SvgWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const CurvedBackground = (props) => {
  return (
    <SvgWrapper>
      <svg 
        viewBox="0 0 390 86" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        {/* 🎯 곡선 배경 (상단 테두리만) */}
        <path
          d="M146.423 0.5C153.422 0.5 159.641 4.30007 161.787 9.96289C166.378 22.0658 177.903 31.8301 193.96 31.8301C210.053 31.8301 223.764 22.0417 228.332 9.96289L228.546 9.4375C230.869 4.0663 236.916 0.5 243.696 0.5H390.5V86H-0.5V0.5H146.423Z"
          fill="white"
          stroke="#E8EEF2"
          strokeWidth="1"
          {...props}
        />
        {/* 🎯 상단 곡선 테두리만 (하단 테두리 제거) */}
        <path
          d="M146.423 0.5C153.422 0.5 159.641 4.30007 161.787 9.96289C166.378 22.0658 177.903 31.8301 193.96 31.8301C210.053 31.8301 223.764 22.0417 228.332 9.96289L228.546 9.4375C230.869 4.0663 236.916 0.5 243.696 0.5H390.5"
          stroke="#E8EEF2"
          strokeWidth="1"
          fill="none"
        />
        {/* 🎯 좌측 테두리 */}
        <line x1="-0.5" y1="0.5" x2="-0.5" y2="86" stroke="#E8EEF2" strokeWidth="1"/>
        {/* 🎯 우측 테두리 */}
        <line x1="390.5" y1="0.5" x2="390.5" y2="86" stroke="#E8EEF2" strokeWidth="1"/>
      </svg>
    </SvgWrapper>
  );
};

export default CurvedBackground;