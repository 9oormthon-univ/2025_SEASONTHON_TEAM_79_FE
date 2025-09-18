// src/layout/Layout.jsx
import styled from "styled-components";
import { Outlet, useLocation } from "react-router-dom";
import BottomNav from "./BottomNav";

const SHELL_MAX_WIDTH = 480;

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

  /* 바텀탭 있을 때만 여백 */
  padding-bottom: ${(p) =>
    p.$hasBottomNav
      ? "calc(env(safe-area-inset-bottom, 0px) + 72px)"
      : "env(safe-area-inset-bottom, 0px)"};
`;

const FooterBar = styled.footer`
  position: sticky;
  bottom: 0;
  z-index: 5;
  background: #fff;
  padding-bottom: env(safe-area-inset-bottom, 0px);
`;

export default function Layout() {
  const location = useLocation();

  // ✅ 이 두 경로에서만 BottomNav 숨김
  const path = location.pathname.replace(/\/+$/, ""); // 뒤 슬래시 정규화
  const hideRoutes = ["/map", "/listingpage"];
  const showBottomNav = !hideRoutes.includes(path);

  return (
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
  );
}
