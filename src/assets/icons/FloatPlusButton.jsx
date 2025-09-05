import styled from "styled-components";

const ButtonContainer = styled.button`
  position: relative;
  width: 54px;
  height: 54px;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;

  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
  
  @media (min-width: 480px) {
    width: calc(54px * (480 / 390));
    height: calc(54px * (480 / 390));
  }

  svg {
    width: 100%;
    height: 100%;
  }
`;

const FloatingButtonIcon = ({ onClick, ...props }) => (
  <ButtonContainer onClick={onClick} {...props}>
    <svg 
      width="54" 
      height="54" 
      viewBox="15 -5 64 64"
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%' }}
    >
      <g filter="url(#filter0_d_499_2369)">
        <ellipse cx="47.4804" cy="26" rx="27.04" ry="26" fill="url(#paint0_linear_499_2369)"/>
      </g>
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M36.5879 25.75C36.5879 19.8358 41.3868 15 47.2558 15C53.1249 15 57.9238 19.8358 57.9238 25.75C57.9238 31.6642 53.1249 36.5 47.2558 36.5C41.3868 36.5 36.5879 31.6642 36.5879 25.75ZM47.2558 16.5C42.2089 16.5 38.0764 20.6642 38.0764 25.75C38.0764 30.8358 42.2089 35 47.2558 35C52.3028 35 56.4352 30.8358 56.4352 25.75C56.4352 20.6642 52.3028 16.5 47.2558 16.5Z" 
        fill="white"
      />
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M46.5116 29.75V21.75H48.0001V29.75H46.5116Z" 
        fill="white"
      />
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M43.2864 25H51.2253V26.5H43.2864V25Z" 
        fill="white"
      />
      <defs>
        <filter 
          id="filter0_d_499_2369" 
          x="0.44043" 
          y="-16" 
          width="94.0801" 
          height="92" 
          filterUnits="userSpaceOnUse" 
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feColorMatrix 
            in="SourceAlpha" 
            type="matrix" 
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" 
            result="hardAlpha"
          />
          <feOffset dy="4"/>
          <feGaussianBlur stdDeviation="10"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix 
            type="matrix" 
            values="0 0 0 0 0.196078 0 0 0 0 0.6 0 0 0 0 1 0 0 0 0.3 0"
          />
          <feBlend 
            mode="normal" 
            in2="BackgroundImageFix" 
            result="effect1_dropShadow_499_2369"
          />
          <feBlend 
            mode="normal" 
            in="SourceGraphic" 
            in2="effect1_dropShadow_499_2369" 
            result="shape"
          />
        </filter>
        <linearGradient 
          id="paint0_linear_499_2369" 
          x1="30.5804" 
          y1="6.90625" 
          x2="64.5182" 
          y2="50.814" 
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.201923" stopColor="#3299FF"/>
          <stop offset="1" stopColor="#004FFF"/>
        </linearGradient>
      </defs>
    </svg>
  </ButtonContainer>
);

export default FloatingButtonIcon;