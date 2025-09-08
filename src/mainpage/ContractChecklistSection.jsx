// src/components/ContractChecklistSection.jsx
import styled from "styled-components";
import mainlogo from "../assets/mainlogo.png";

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

  img {
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
  marign-right: 16px;

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

export default function ContractChecklistSection({ userName, onChecklistClick, isLoggedIn }) {
  return (
    <SectionContainer>
      <ChecklistWrapper>
        <TextWrapper>
          <LogoButton>
            <img src={mainlogo} alt="Logo" />
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
          <ChecklistButton>
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
