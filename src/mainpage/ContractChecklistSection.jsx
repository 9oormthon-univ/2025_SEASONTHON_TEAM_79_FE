// src/components/ContractChecklistSection.jsx
import styled from "styled-components";

const SectionContainer = styled.section`
  padding: 0 16px;
  background-color: #ffffff;
  overflow-x: hidden;
`;

// 전체 래퍼
const ChecklistWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
`;

// 텍스트 영역
const TextWrapper = styled.div`
  display: flex;
  width: 100%;
  gap: 20px;
`;

const LogoButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  width: 36px;
  height: 36px;
  top: 60px;
  left: 16px;
  opacity: 1;
  margin: 4px 0 4px 0;

  svg {
    width: 100%;
    height: 100%;
  }
`;

const TextArea = styled.div`
  height: 44px;
  p {
    font-size: 16px;
    font-weight: 700;
    color: #000000;
    margin: 0;
    line-height: 1.4;
    letter-spacing: 0px;
  }

  p .highlight {
    font-weight: 700;
    color: #3299ff;
  }

  span {
    font-weight: 400;
  }

  ${(props) =>
    props.centered &&
    `
    display: flex;
    align-items: center;
  `}
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 16px;
  width: 100%;
  height: 100px;
  text-align: center;
`;

const RecordButton = styled.button`
  flex: 1;
  min-width: 0;
  height: 100px;
  border-radius: 16px;
  border: none;
  background: linear-gradient(135deg, #3299ff 0%, #004fff 100%);
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-4px);
  }
`;
const ChecklistButton = styled.button`
  flex: 1;
  min-width: 0;
  height: 100px;
  border-radius: 16px;
  border: 1px solid #e8eef2;
  background: #ffffff;
  color: #464a4d;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-4px);
  }
`;

// 버튼 내 아이콘 영역
const RecordButtonIcon = styled.div`
  width: 36px;
  height: 36px;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  margin-left: auto;
  margin-right: 16px;

  svg {
    width: 100%;
    height: 100%;
  }
`;
const ChecklistButtonIcon = styled.div`
  width: 36px;
  height: 36px;
  top: 20px;
  left: 63px;
  angle: 0 deg;
  opacity: 1;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  marign-right: 16px;

  svg {
    width: 100%;
    height: 100%;
  }
`;

// 버튼 텍스트
const ButtonText = styled.span`
  font-family: Andika;
  font-weight: 700;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0;
  text-align: left;
  margin-left: 16px;
  height: 20px;
  color: #ffffff;
`;
const SubButtonText = styled.span`
  height: 20px;
  font-family: Andika;
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  letter-spacing: 0;
  text-align: left;
  margin-left: 16px;
  height: 20px;
  color: #e5e5e5;
`;

const CheckButtonText = styled.span`
  font-family: Andika;
  font-weight: 700;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0;
  text-align: left;
  margin-left: 16px;
  height: 20px;
  color: #464a4d;
`;

const CheckSubButtonText = styled.span`
  height: 20px;
  font-family: Andika;
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  letter-spacing: 0;
  text-align: left;
  margin-left: 16px;
  height: 20px;
  color: #757b80;
`;

export default function ContractChecklistSection({ userName, onChecklistClick, onLeaseChecklistClick, isLoggedIn }) {
  const MainLogo = (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M35.46 16.74L19.26 0.54C18.54 -0.18 17.46 -0.18 16.74 0.54L0.54 16.74C-0.18 17.46 -0.18 18.54 0.54 19.26C1.26 19.98 2.34 19.98 3.06 19.26L3.6 18.72V32.4C3.6 34.38 5.22 36 7.2 36H12.6V25.2C12.6 22.14 14.94 19.8 18 19.8C21.06 19.8 23.4 22.14 23.4 25.2V36H28.8C30.78 36 32.4 34.38 32.4 32.4V18.72L32.94 19.26C33.3 19.62 33.84 19.8 34.2 19.8C34.56 19.8 35.1 19.8 35.46 19.26C36.18 18.54 36.18 17.46 35.46 16.74Z"
        fill="#0073E6"
      />
      <path
        d="M17.9996 18C22.1748 18 25.5596 21.3847 25.5596 25.56L25.5596 36L10.4396 36L10.4396 25.56C10.4396 21.3847 13.8243 18 17.9996 18Z"
        fill="#F4F7FF"
      />
      <g clip-path="url(#clip0_1099_10502)">
        <path
          d="M13.6667 22.2083C13.6667 22.1531 13.6447 22.1001 13.6056 22.061C13.5666 22.0219 13.5136 22 13.4583 22C13.4031 22 13.3501 22.0219 13.311 22.061C13.2719 22.1001 13.25 22.1531 13.25 22.2083V31.7917C13.25 31.8469 13.2719 31.8999 13.311 31.939C13.3501 31.9781 13.4031 32 13.4583 32C13.5136 32 13.5666 31.9781 13.6056 31.939C13.6447 31.8999 13.6667 31.8469 13.6667 31.7917V22.2083ZM8.45833 23.25C8.51359 23.25 8.56658 23.2719 8.60565 23.311C8.64472 23.3501 8.66667 23.4031 8.66667 23.4583V30.5417C8.66667 30.5969 8.64472 30.6499 8.60565 30.689C8.56658 30.7281 8.51359 30.75 8.45833 30.75C8.40308 30.75 8.35009 30.7281 8.31102 30.689C8.27195 30.6499 8.25 30.5969 8.25 30.5417V23.4583C8.25 23.4031 8.27195 23.3501 8.31102 23.311C8.35009 23.2719 8.40308 23.25 8.45833 23.25ZM7.20833 25.3333C7.26359 25.3333 7.31658 25.3553 7.35565 25.3944C7.39472 25.4334 7.41667 25.4864 7.41667 25.5417V28.4583C7.41667 28.5136 7.39472 28.5666 7.35565 28.6056C7.31658 28.6447 7.26359 28.6667 7.20833 28.6667C7.15308 28.6667 7.10009 28.6447 7.06102 28.6056C7.02195 28.5666 7 28.5136 7 28.4583V25.5417C7 25.4864 7.02195 25.4334 7.06102 25.3944C7.10009 25.3553 7.15308 25.3333 7.20833 25.3333ZM9.70833 24.9167C9.76359 24.9167 9.81658 24.9386 9.85565 24.9777C9.89472 25.0168 9.91667 25.0697 9.91667 25.125V28.875C9.91667 28.9303 9.89472 28.9832 9.85565 29.0223C9.81658 29.0614 9.76359 29.0833 9.70833 29.0833C9.65308 29.0833 9.60009 29.0614 9.56102 29.0223C9.52195 28.9832 9.5 28.9303 9.5 28.875V25.125C9.5 25.0697 9.52195 25.0168 9.56102 24.9777C9.60009 24.9386 9.65308 24.9167 9.70833 24.9167ZM11.1667 26.375C11.1667 26.3197 11.1447 26.2668 11.1056 26.2277C11.0666 26.1886 11.0136 26.1667 10.9583 26.1667C10.9031 26.1667 10.8501 26.1886 10.811 26.2277C10.7719 26.2668 10.75 26.3197 10.75 26.375V27.625C10.75 27.6803 10.7719 27.7332 10.811 27.7723C10.8501 27.8114 10.9031 27.8333 10.9583 27.8333C11.0136 27.8333 11.0666 27.8114 11.1056 27.7723C11.1447 27.7332 11.1667 27.6803 11.1667 27.625V26.375ZM12.2083 24.9167C12.2636 24.9167 12.3166 24.9386 12.3556 24.9777C12.3947 25.0168 12.4167 25.0697 12.4167 25.125V28.875C12.4167 28.9303 12.3947 28.9832 12.3556 29.0223C12.3166 29.0614 12.2636 29.0833 12.2083 29.0833C12.1531 29.0833 12.1001 29.0614 12.061 29.0223C12.0219 28.9832 12 28.9303 12 28.875V25.125C12 25.0697 12.0219 25.0168 12.061 24.9777C12.1001 24.9386 12.1531 24.9167 12.2083 24.9167ZM14.7083 23.6667C14.7636 23.6667 14.8166 23.6886 14.8556 23.7277C14.8947 23.7668 14.9167 23.8197 14.9167 23.875V30.125C14.9167 30.1803 14.8947 30.2332 14.8556 30.2723C14.8166 30.3114 14.7636 30.3333 14.7083 30.3333C14.6531 30.3333 14.6001 30.3114 14.561 30.2723C14.5219 30.2332 14.5 30.1803 14.5 30.125V23.875C14.5 23.8197 14.5219 23.7668 14.561 23.7277C14.6001 23.6886 14.6531 23.6667 14.7083 23.6667ZM16.1667 25.5417C16.1667 25.4864 16.1447 25.4334 16.1056 25.3944C16.0666 25.3553 16.0136 25.3333 15.9583 25.3333C15.9031 25.3333 15.8501 25.3553 15.811 25.3944C15.7719 25.4334 15.75 25.4864 15.75 25.5417V28.4583C15.75 28.5136 15.7719 28.5666 15.811 28.6056C15.8501 28.6447 15.9031 28.6667 15.9583 28.6667C16.0136 28.6667 16.0666 28.6447 16.1056 28.6056C16.1447 28.5666 16.1667 28.5136 16.1667 28.4583V25.5417Z"
          fill="#0073E6"
        />
      </g>
      <g clip-path="url(#clip1_1099_10502)">
        <path
          d="M23.6667 22.2083C23.6667 22.1531 23.6447 22.1001 23.6056 22.061C23.5666 22.0219 23.5136 22 23.4583 22C23.4031 22 23.3501 22.0219 23.311 22.061C23.2719 22.1001 23.25 22.1531 23.25 22.2083V31.7917C23.25 31.8469 23.2719 31.8999 23.311 31.939C23.3501 31.9781 23.4031 32 23.4583 32C23.5136 32 23.5666 31.9781 23.6056 31.939C23.6447 31.8999 23.6667 31.8469 23.6667 31.7917V22.2083ZM18.4583 23.25C18.5136 23.25 18.5666 23.2719 18.6056 23.311C18.6447 23.3501 18.6667 23.4031 18.6667 23.4583V30.5417C18.6667 30.5969 18.6447 30.6499 18.6056 30.689C18.5666 30.7281 18.5136 30.75 18.4583 30.75C18.4031 30.75 18.3501 30.7281 18.311 30.689C18.2719 30.6499 18.25 30.5969 18.25 30.5417V23.4583C18.25 23.4031 18.2719 23.3501 18.311 23.311C18.3501 23.2719 18.4031 23.25 18.4583 23.25ZM17.2083 25.3333C17.2636 25.3333 17.3166 25.3553 17.3556 25.3944C17.3947 25.4334 17.4167 25.4864 17.4167 25.5417V28.4583C17.4167 28.5136 17.3947 28.5666 17.3556 28.6056C17.3166 28.6447 17.2636 28.6667 17.2083 28.6667C17.1531 28.6667 17.1001 28.6447 17.061 28.6056C17.0219 28.5666 17 28.5136 17 28.4583V25.5417C17 25.4864 17.0219 25.4334 17.061 25.3944C17.1001 25.3553 17.1531 25.3333 17.2083 25.3333ZM19.7083 24.9167C19.7636 24.9167 19.8166 24.9386 19.8556 24.9777C19.8947 25.0168 19.9167 25.0697 19.9167 25.125V28.875C19.9167 28.9303 19.8947 28.9832 19.8556 29.0223C19.8166 29.0614 19.7636 29.0833 19.7083 29.0833C19.6531 29.0833 19.6001 29.0614 19.561 29.0223C19.5219 28.9832 19.5 28.9303 19.5 28.875V25.125C19.5 25.0697 19.5219 25.0168 19.561 24.9777C19.6001 24.9386 19.6531 24.9167 19.7083 24.9167ZM21.1667 26.375C21.1667 26.3197 21.1447 26.2668 21.1056 26.2277C21.0666 26.1886 21.0136 26.1667 20.9583 26.1667C20.9031 26.1667 20.8501 26.1886 20.811 26.2277C20.7719 26.2668 20.75 26.3197 20.75 26.375V27.625C20.75 27.6803 20.7719 27.7332 20.811 27.7723C20.8501 27.8114 20.9031 27.8333 20.9583 27.8333C21.0136 27.8333 21.0666 27.8114 21.1056 27.7723C21.1447 27.7332 21.1667 27.6803 21.1667 27.625V26.375ZM22.2083 24.9167C22.2636 24.9167 22.3166 24.9386 22.3556 24.9777C22.3947 25.0168 22.4167 25.0697 22.4167 25.125V28.875C22.4167 28.9303 22.3947 28.9832 22.3556 29.0223C22.3166 29.0614 22.2636 29.0833 22.2083 29.0833C22.1531 29.0833 22.1001 29.0614 22.061 29.0223C22.0219 28.9832 22 28.9303 22 28.875V25.125C22 25.0697 22.0219 25.0168 22.061 24.9777C22.1001 24.9386 22.1531 24.9167 22.2083 24.9167ZM24.7083 23.6667C24.7636 23.6667 24.8166 23.6886 24.8556 23.7277C24.8947 23.7668 24.9167 23.8197 24.9167 23.875V30.125C24.9167 30.1803 24.8947 30.2332 24.8556 30.2723C24.8166 30.3114 24.7636 30.3333 24.7083 30.3333C24.6531 30.3333 24.6001 30.3114 24.561 30.2723C24.5219 30.2332 24.5 30.1803 24.5 30.125V23.875C24.5 23.8197 24.5219 23.7668 24.561 23.7277C24.6001 23.6886 24.6531 23.6667 24.7083 23.6667ZM26.1667 25.5417C26.1667 25.4864 26.1447 25.4334 26.1056 25.3944C26.0666 25.3553 26.0136 25.3333 25.9583 25.3333C25.9031 25.3333 25.8501 25.3553 25.811 25.3944C25.7719 25.4334 25.75 25.4864 25.75 25.5417V28.4583C25.75 28.5136 25.7719 28.5666 25.811 28.6056C25.8501 28.6447 25.9031 28.6667 25.9583 28.6667C26.0136 28.6667 26.0666 28.6447 26.1056 28.6056C26.1447 28.5666 26.1667 28.5136 26.1667 28.4583V25.5417Z"
          fill="#0073E6"
        />
      </g>
      <defs>
        <clipPath id="clip0_1099_10502">
          <rect width="10" height="10" fill="white" transform="translate(7 22)" />
        </clipPath>
        <clipPath id="clip1_1099_10502">
          <rect width="10" height="10" fill="white" transform="translate(17 22)" />
        </clipPath>
      </defs>
    </svg>
  );
  return (
    <SectionContainer>
      <ChecklistWrapper>
        <TextWrapper>
          <LogoButton>
            {MainLogo}
          </LogoButton>

          {isLoggedIn ? (
            <TextArea>
              <p>
                반갑습니다. <span className="highlight">{userName}</span>님
              </p>
              <span>편리하게 필수 자취리스트를 체크하세요</span>
            </TextArea>
          ) : (
            <TextArea centered>
              <p>로그인 후 기록을 시작해보세요.</p>
            </TextArea>
          )}
        </TextWrapper>

        {/* 버튼 영역 */}
        <ButtonContainer>
          {/* 체크리스트 버튼 */}
          <RecordButton onClick={onChecklistClick}>
            <ButtonText>매물기록하기</ButtonText>
            <SubButtonText>AI 음성메모로 편리하게! </SubButtonText>
            <RecordButtonIcon>
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M1.5 17.625C1.5 8.75368 8.75368 1.5 17.625 1.5C26.4963 1.5 33.75 8.75368 33.75 17.625C33.75 26.4963 26.4963 33.75 17.625 33.75C8.75368 33.75 1.5 26.4963 1.5 17.625ZM17.625 3.75C9.99632 3.75 3.75 9.99632 3.75 17.625C3.75 25.2537 9.99632 31.5 17.625 31.5C25.2537 31.5 31.5 25.2537 31.5 17.625C31.5 9.99632 25.2537 3.75 17.625 3.75Z"
                  fill="white"
                />
                <path fillRule="evenodd" clipRule="evenodd" d="M16.5 23.625V11.625H18.75V23.625H16.5Z" fill="white" />
                <path fillRule="evenodd" clipRule="evenodd" d="M11.625 16.5H23.625V18.75H11.625V16.5Z" fill="white" />
              </svg>
            </RecordButtonIcon>
          </RecordButton>

          {/* 최근 계약 리스트 버튼 */}
          <ChecklistButton onClick={onLeaseChecklistClick}>
            <CheckButtonText>계약 시 체크리스트</CheckButtonText>
            <CheckSubButtonText>최근 조회 목록 </CheckSubButtonText>
            <ChecklistButtonIcon>
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 8.25L4.821 10.5L11.25 4.5" stroke="#3299FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path opacity="0.5" d="M3 18.75L4.821 21L11.25 15" stroke="#3299FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 29.25L4.821 31.5L11.25 25.5" stroke="#3299FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M33 28.5H18" stroke="#3299FF" strokeWidth="2" strokeLinecap="round" />
                <path opacity="0.5" d="M33 18H18" stroke="#3299FF" strokeWidth="2" strokeLinecap="round" />
                <path d="M33 7.5H18" stroke="#3299FF" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </ChecklistButtonIcon>
          </ChecklistButton>
        </ButtonContainer>
      </ChecklistWrapper>
    </SectionContainer>
  );
}
