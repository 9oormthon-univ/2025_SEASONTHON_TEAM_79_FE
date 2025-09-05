// src/components/ContractChecklistSection.jsx
import styled from "styled-components";
import mainlogo from "../assets/mainlogo.png";

const SectionContainer = styled.section`
  padding: 0 16px;
  background-color: #ffffff;

  @media (min-width: 391px) {
    padding: 0 calc(20px + (100vw - 390px) * 0.1); /* 점진적으로 패딩 증가 */
  }
`;

// 전체 래퍼
const ChecklistWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 480px;
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

  img {
    width: 100%;
    height: 100%;
  }
`;

const TextArea = styled.div`
  height: 44px;
  p {
    font-family: Font Family/Font Family;
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
`;

// 버튼 컨테이너 (348px width, gap 34px)
const ButtonContainer = styled.div`
  display: flex;
  gap: 16px;
  width: 356px;
  height: 100px;
  text-align: center;
  `;

// 개별 버튼 (157px × 100px)
const RecordButton = styled.button`
  flex: 1;
  width: 177px;
  height: 100px;
  border-radius: 16px;
  border: none;
  background: linear-gradient(135deg, #3299ff 0%, #004fff 100%);
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-4px);
  }
`;
const ChecklistButton = styled.button`
  flex: 1;
  width: 177px;
  height: 100px;
  border-radius: 16px;
  border: 1px solid #3299ff;
  background: #ffffff;
  color: #464a4d;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
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
  justify-content: center;

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
  text-align: center;
`;

export default function ContractChecklistSection({ userName, onChecklistClick }) {
  return (
    <SectionContainer>
      <ChecklistWrapper>
        <TextWrapper>
          <LogoButton>
            <img src={mainlogo} alt="Logo" />
          </LogoButton>
          <TextArea>
            <p>
              반갑습니다. <span className="highlight">{userName}</span>님
            </p>
            <span>편리하게 필수 자취리스트를 체크하세요</span>
          </TextArea>
        </TextWrapper>

        {/* 버튼 영역 */}
        <ButtonContainer>
          {/* 체크리스트 버튼 */}
          <RecordButton onClick={onChecklistClick}>
            <RecordButtonIcon>
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M21 33V28.3875L30.8625 18.5625L35.475 23.1375L25.6125 33H21ZM23.25 30.75H24.675L29.2125 26.175L28.5375 25.4625L27.825 24.7875L23.25 29.325V30.75ZM6 33V3H21L30 12V16.5H27V13.5H19.5V6H9V30H18V33H6ZM28.5375 25.4625L27.825 24.7875L29.2125 26.175L28.5375 25.4625Z"
                  fill="white"
                />
              </svg>
            </RecordButtonIcon>
            <ButtonText>매물기록하기</ButtonText>
          </RecordButton>

          {/* 최근 계약 리스트 버튼 */}
          <ChecklistButton>
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
            <ButtonText>최근 계약 체크리스트</ButtonText>
          </ChecklistButton>
        </ButtonContainer>
      </ChecklistWrapper>
    </SectionContainer>
  );
}
