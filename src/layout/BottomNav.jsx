import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";

//svg파일 컴포넌트화
import CurvedBackground from "../assets/icons/CurvedBackground";
import HomeIcon from "../assets/icons/HomeIcon";
import CheckListIcon from "../assets/icons/CheckListIcon";
import StarIcon from "../assets/icons/StarIcon";
import MapIcon from "../assets/icons/MapIcon";
import FloatingButtonIcon from "../assets/icons/FloatPlusButton";

// 전체 컨테이너 (총 114px 높이)
const BottomNavContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 114px; /* 52(곡선) + 28(top) + 34(인디케이터) = 114px */
  background: transparent;
  
  @media (min-width: 480px) {
    height: calc(114px * (480 / 390));
  }
`;

const CurvedBackgroundWrapper = styled.div`
  position: absolute;
  top: 28px;
  left: 50%;
  transform: translateX(-50%);
  width: 390px;
  height: 86px; /* 52(곡선) + 34(인디케이터) */
  z-index: 1;

  svg {
    width: 100%;
    height: 100%;
    display: block;
  }
  
  @media (min-width: 480px) {
    width: 480px;
    height: calc(86px * (480 / 390));
    top: calc(28px * (480 / 390));
  }
`;

const NavItemsWrapper = styled.div`
  position: absolute;
  top: 28px;
  left: 0;
  right: 0;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
  
  @media (min-width: 480px) {
    top: calc(28px * (480 / 390));
    height: calc(52px * (480 / 390));
  }
`;

const NavGrid = styled.div`
  display: grid;
  grid-template-columns: 77.4px 77.4px 77.4px 77.4px 77.4px;
  width: 390px;
  height: 52px;
  align-items: center;
  justify-items: center;
  
  @media (min-width: 480px) {
    grid-template-columns: 
      calc(77.4px * (480 / 390)) 
      calc(77.4px * (480 / 390)) 
      calc(54px * (480 / 390)) 
      calc(77.4px * (480 / 390)) 
      calc(77.4px * (480 / 390));
    width: 480px;
    height: calc(52px * (480 / 390));
  }
`;

const NavItem = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 77.4px;
  height: 52px;
  gap: 4px;
  border: none;
  background: none;
  cursor: pointer;
  transition: all 0.2s ease;

  svg {
    width: 24px;
    height: 24px;
    color: ${(props) => (props.$active ? "#3299FF" : "#9CA3AF")};
    transition: color 0.2s ease;
  }

  span {
    font-family: "Pretendard", sans-serif;
    font-size: 10px;
    font-weight: 400;
    line-height: 1.2;
    color: ${(props) => (props.$active ? "#3299FF" : "#9CA3AF")};
    transition: color 0.2s ease;
    text-align: center;
  }
  
  /* 반응형 */
  
  @media (min-width: 480px) {
    width: calc(77.4px * (480 / 390));
    height: calc(52px * (480 / 390));
    
    svg {
      width: calc(24px * (480 / 390));
      height: calc(24px * (480 / 390));
    }
    
    span {
      font-size: calc(10px * (480 / 390));
    }
  }
`;

const FloatingButtonWrapper = styled.div`
  position: absolute;
  top: -28px;
  left: 50%;
  transform: translateX(-50%);
  width: 54px;
  height: 52px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  
  filter: drop-shadow(0 2px 8px rgba(50, 153, 255, 0.3));
  
  svg, button {
    width: 54px !important;
    height: 54px !important;
  }
  
  /* 반응형 */
  @media (min-width: 480px) {
    width: calc(54px * (480 / 390));
    height: calc(52px * (480 / 390));
    
    svg, button {
      width: calc(54px * (480 / 390)) !important;
      height: calc(54px * (480 / 390)) !important;
    }
  }
`;

// 홈 인디케이터 (top: 80px, 높이 34px)
const HomeIndicatorArea = styled.div`
  position: absolute;
  top: 80px;
  left: 0;
  right: 0;
  width: 100%;
  height: 34px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
  
  @media (min-width: 480px) {
    top: calc(80px * (480 / 390));
    height: calc(34px * (480 / 390));
  }
`;

const navItems = [
  { key: "home", icon: HomeIcon, label: "홈", path: "/" },
  { key: "userrecord", icon: StarIcon, label: "나의기록", path: "/userrecord" },
  { key: "checklist", icon: CheckListIcon, label: "둘러보기", path: "/checklist" },
  { key: "mypage", icon: MapIcon, label: "마이페이지", path: "/mypage" },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = () => {
    const path = location.pathname;
    const activeItem = navItems.find((item) => item.path === path);
    return activeItem?.key || "home";
  };

  const handleNavClick = (item) => {
    navigate(item.path);
  };

  const handleFloatingClick = () => {
    navigate("/checklist");
  };

  const activeTab = getActiveTab();

  return (
    <BottomNavContainer>
      <CurvedBackgroundWrapper>
        <CurvedBackground />
      </CurvedBackgroundWrapper>
      
      {/* 네비게이션 아이템들 */}
      <NavItemsWrapper>
        <NavGrid>
          {/* 첫 두 개 아이템 */}
          {navItems.slice(0, 2).map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.key;
            
            return (
              <NavItem key={item.key} $active={isActive} onClick={() => handleNavClick(item)}>
                <IconComponent $active={isActive}/>
                <span>{item.label}</span>
              </NavItem>
            );
          })}
          
          {/* 가운데 플로팅 버튼 공간 */}
          <div></div>
          
          {/* 나머지 두 개 아이템 */}
          {navItems.slice(2).map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.key;
            
            return (
              <NavItem key={item.key} $active={isActive} onClick={() => handleNavClick(item)}>
                <IconComponent $active={isActive}/>
                <span>{item.label}</span>
              </NavItem>
            );
          })}
        </NavGrid>
        
        {/* 플로팅 버튼 */}
        <FloatingButtonWrapper>
          <FloatingButtonIcon onClick={handleFloatingClick} />
        </FloatingButtonWrapper>
      </NavItemsWrapper>

      {/* 홈 인디케이터 */}
      <HomeIndicatorArea />
    </BottomNavContainer>
  );
}