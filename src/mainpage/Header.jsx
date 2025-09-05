import styled from "styled-components";

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  border-width: 1px;
  background-color: #ffffff;

  border-bottom: 1px solid #e8eef2;
`;

const LogoButton = styled.button`
  /* 폰트 정의 */
  @font-face {
    font-family: "YeogiOttaeJalnanGothic";
    src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_231029@1.1/JalnanGothic.woff") format("woff");
    font-weight: normal;
    font-display: swap;
  }
  width: 60px;
  height: 24px;

  background: none;
  border: none;
  padding: 0;
  margin-left: 16px; /* left 대신 margin 사용 */
  cursor: pointer;

  font-family: "YeogiOttaeJalnanGothic", "Noto Sans KR", sans-serif;
  font-weight: 400;
  font-size: 20px;
  line-height: 100%;
  letter-spacing: 0%;
  color: #3299ff;

  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  white-space: nowrap;

  &:hover {
    opacity: 0.8;
    transform: scale(1.02);
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  border: none;
  width: 80;
  height: 60;
  left: 310px;
  angle: 0 deg;
  opacity: 1;
  padding-right: 16px;
  background-color: transparent;

  font-weight: 700;
  font-size: 16px;
  leading-trim: NONE;
  line-height: 24px;
  letter-spacing: 0px;
  text-align: right;
  vertical-align: middle;
`;

export default function Header({ onLogout }) {
  const goHome = () => {
    window.location.href = "/";
  };

  return (
    <HeaderContainer>
      <LogoButton onClick={goHome}>자취췍</LogoButton>
      <LogoutButton onClick={onLogout}>로그아웃</LogoutButton>
    </HeaderContainer>
  );
}
