// src/layout/Layout.jsx
import styled from "styled-components";
import { Outlet, useLocation } from "react-router-dom";
import BottomNav from "./BottomNav";

const SHELL_MAX_WIDTH = 480; // 큰 화면에서 중앙 고정폭 (원하면 414/430/520 등으로 조절)

const Frame = styled.div`
  width: 100%;
  min-height: 100dvh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background: #ffffff;

  @media (min-width: 768px) {
    max-width: ${SHELL_MAX_WIDTH}px;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
    margin: 16px auto;
    overflow: hidden;
  }
`;

const Body = styled.main`
  flex: 1;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  background: #ffffff;

  /* 하단 안전영역(아이폰) + 바텀탭 높이 고려 */
  padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 72px);
`;

/* 바텀탭이 스크롤되지 않도록 Frame의 자식으로 두고 Body만 스크롤 */
const FooterBar = styled.footer`
  position: sticky;
  bottom: 0;
  z-index: 5;
  background: #fff;

  padding-bottom: env(safe-area-inset-bottom, 0px);
`;

export default function Layout() {
  const location = useLocation();

  //바텀 네비게이션을 숨길 페이지들
  const hideBottomNavPages = ["/login", "/signup", "/find-id", "/find-password","/checklist"];
  const showBottomNav = !hideBottomNavPages.includes(location.pathname);
  return (
    <>
      <Frame>
        <Body $hasBottomNav={showBottomNav}>
          <Outlet />
        </Body>
        {showBottomNav && (
          <FooterBar>
            <BottomNav />
          </FooterBar>
        )}
      </Frame>
    </>
  );
}
