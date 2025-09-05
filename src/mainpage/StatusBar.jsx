// src/components/StatusBar.jsx (개발용)
import styled from "styled-components";

const StatusBarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: transparent;
  font-size: 14px;
  font-weight: 600;
  color: #000;
  height: 48px;
  angle: 0 deg;
  opacity: 1;
  background-color : #FFFFFF;

  /* 프로덕션에서는 숨김 */
  ${process.env.NODE_ENV === "production" && "display: none;"}
`;

const TimeDisplay = styled.div`
  font-weight: 600;
`;

const StatusIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  span {
    font-size: 12px;
  }
`;

export default function StatusBar() {
  const currentTime = new Date().toLocaleTimeString("ko-KR", {
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <StatusBarContainer>
      <TimeDisplay>{currentTime}</TimeDisplay>
      <StatusIcons>
        <span>●●●●</span>
        <span>📶</span>
        <span>🔋</span>
      </StatusIcons>
    </StatusBarContainer>
  );
}
