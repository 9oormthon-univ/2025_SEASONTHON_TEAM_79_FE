import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "./Header";
import StatusBar from "./StatusBar";
import ContractChecklistSection from "./ContractChecklistSection";
import RecommendedPropertiesSection from "./RecommendedPropertiesSection";

// 더미 데이터 생성 함수
const generateDummyProperties = () => {
  const dummyData = [
    {
      id: "dummy_1",
      checkId: "check_1",
      location: "서울 강남구 역삼동 123-45",
      name: "역삼 센트럴 오피스텔",
      roomType: "원룸",
      rating: 4.2,
      size: "24m²",
      fee: "관리비 10만원",
      deposit: "월세 1000만/80만",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=200&h=200&fit=crop&crop=center"
    },
    {
      id: "dummy_2", 
      checkId: "check_2",
      location: "서울 마포구 홍대입구역 근처",
      name: "홍대 프리미엄 레지던스",
      roomType: "투룸",
      rating: 3.8,
      size: "32m²",
      fee: "관리비 15만원", 
      deposit: "전세 2억 5000만원",
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=200&h=200&fit=crop&crop=center"
    },
    {
      id: "dummy_3",
      checkId: "check_3", 
      location: "서울 송파구 잠실동 567-89",
      name: "잠실 리버뷰 아파트",
      roomType: "3개이상",
      rating: 4.5,
      size: "45m²",
      fee: "관리비 20만원",
      deposit: "월세 2000만/120만",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200&h=200&fit=crop&crop=center"
    },
    {
      id: "dummy_4",
      checkId: "check_4",
      location: "서울 성동구 성수동 234-56", 
      name: "성수 모던 스튜디오",
      roomType: "원룸",
      rating: 4.0,
      size: "28m²", 
      fee: "관리비 8만원",
      deposit: "월세 500만/70만",
      image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=200&h=200&fit=crop&crop=center"
    },
    {
      id: "dummy_5",
      checkId: "check_5",
      location: "서울 용산구 이태원동 345-67",
      name: "이태원 글로벌 빌라",
      roomType: "투룸", 
      rating: 3.9,
      size: "38m²",
      fee: "관리비 12만원",
      deposit: "전세 1억 8000만원",
      image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=200&h=200&fit=crop&crop=center"
    }
  ];

  return dummyData;
};

const MainPageContainer = styled.div`
  min-height: 100%;
  background: #ffffff;
  overflow-x: hidden;
`;

const ContentWrapper = styled.div`
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  font-size: 18px;
  color: #666;
`;

const ErrorMessage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 50vh;
  gap: 16px;

  button {
    padding: 8px 16px;
    background: #3299ff;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
  }
`;

export default function MainPage() {
  const navigate = useNavigate();

  // 상태 관리
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 더미 데이터 로딩 함수
  const loadDummyData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 사용자 데이터 확인
      const userData = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      // 실제 로그인 상태 확인
      const loggedIn = !!(userData && token);
      setIsLoggedIn(loggedIn);

      if (loggedIn) {
        // 로그인된 경우 사용자 데이터 설정
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } else {
        // 로그인되지 않은 경우 더미 사용자 설정
        setUser({ name: "김지후" });
        setIsLoggedIn(true); // 더미 데이터 확인을 위해 true로 설정
      }

      // 더미 데이터 로딩 (로딩 시뮬레이션)
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const dummyProperties = generateDummyProperties();
      setProperties(dummyProperties);
      
      console.log("더미 매물 데이터 로딩 완료:", dummyProperties.length, "개 매물");

    } catch (error) {
      console.error("더미 데이터 로딩 실패:", error);
      setError("데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 데이터 로딩
  useEffect(() => {
    loadDummyData();
  }, []);

  // 재시도 함수
  const handleRetry = () => {
    loadDummyData();
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    console.log("로그아웃");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleChecklistClick = () => {
    navigate("/checklist");
  };

  const handleSearchClick = () => {
    console.log("매물 검색 클릭");
    navigate("/search");
  };

  const handlePropertyClick = (property) => {
    const checkId = property.checkId || property.id;

    console.log("🏠 매물 클릭:", {
      매물명: property.name,
      체크리스트ID: checkId,
      주소: property.location,
    });

    // 상세 페이지로 네비게이션
    navigate(`/homedetailpage`, {
      state: {
        item: {
          checkId: checkId,
          aptNm: property.name,
          address: property.location,
        },
      },
    });
  };

  const handleViewAll = () => {
    navigate("/properties");
  };

  const handleLeaseChecklistClick = () => {
    navigate("/leasechecklistpage");
  };

  if (loading) {
    return (
      <MainPageContainer>
        <LoadingSpinner>매물 정보를 불러오는 중입니다</LoadingSpinner>
      </MainPageContainer>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <MainPageContainer>
        <ErrorMessage>
          <div>{error}</div>
          <button onClick={handleRetry}>다시 시도</button>
        </ErrorMessage>
      </MainPageContainer>
    );
  }

  return (
    <MainPageContainer>
      {/* 개발용 상태바 */}
      <StatusBar />

      <ContentWrapper>
        {/* 헤더 */}
        <Header 
          onLogout={isLoggedIn ? handleLogout : undefined} 
          onLogin={!isLoggedIn ? handleLogin : undefined} 
          isLoggedIn={isLoggedIn} 
        />

        {/* 계약 체크리스트 섹션 */}
        <ContractChecklistSection
          userName={user?.name || "김지후"}
          onChecklistClick={handleChecklistClick}
          onOtherActionClick={handleSearchClick}
          onLeaseChecklistClick={handleLeaseChecklistClick}
          isLoggedIn={isLoggedIn}
        />

        {/* 지역 추천 매물 섹션 */}
        <RecommendedPropertiesSection 
          properties={properties} 
          onPropertyClick={handlePropertyClick} 
          onViewAll={handleViewAll} 
          isLoggedIn={isLoggedIn} 
        />
      </ContentWrapper>
    </MainPageContainer>
  );
}