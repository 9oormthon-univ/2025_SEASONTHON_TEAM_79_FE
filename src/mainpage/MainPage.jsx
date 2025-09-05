import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "./Header";
//import StatusBar from "./StatusBar";
import ContractChecklistSection from "./ContractChecklistSection";
import RecommendedPropertiesSection from "./RecommendedPropertiesSection";

const SHELL_MAX_WIDTH = 512;

const MainPageContainer = styled.div`
  min-height: 100%;
  background: linear-gradient(167.18deg, #FFFFFF 13.79%, #EBF2FA 100.61%);
  width: min(100%, ${SHELL_MAX_WIDTH - 30}px);
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

export default function MainPage() {
  const navigate = useNavigate();

  // 상태 관리
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 데이터 로딩
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 사용자 데이터
        const userData = localStorage.getItem("user");
        let parsedUser = userData
          ? JSON.parse(userData)
          : {
              id: 1,
              name: "김땡땡",
              email: "test@example.com",
            };

        if (!userData) {
          localStorage.setItem("user", JSON.stringify(parsedUser));
        }
        setUser(parsedUser);

        // 추천 매물 데이터
        const propertiesData = await fetchRecommendedProperties();
        setProperties(propertiesData);

        console.log("데이터 로딩 완료:", propertiesData.length, "개 매물");
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const fetchRecommendedProperties = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            location: "대구시 수성구 범어동",
            name: "센텀힐스테이트",
            rating: 4.8,
            size: "112m²",
            fee: "관리비 10만원",
            deposit: "전세 1억",
            image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=200&h=200&fit=crop&crop=center",
            isBookmarked: false,
          },
          {
            id: 2,
            location: "서울시 강남구 도곡동",
            name: "롯데캐슬",
            rating: 4.8,
            size: "33m²",
            fee: "관리비 5만원",
            deposit: "월세 300/84",
            image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=200&h=200&fit=crop&crop=center",
            isBookmarked: true,
          },
          {
            id: 3,
            location: "경기도 성남시 분당구 정자동",
            name: "위례자이",
            rating: 4.8,
            size: "95m²",
            fee: "관리비 5만원",
            deposit: "월세 1000/55",
            image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200&h=200&fit=crop&crop=center",
            isBookmarked: false,
          },
          {
            id: 4,
            location: "서울시 영등포구 여의도동",
            name: "더샵센트럴시티",
            rating: 4.6,
            size: "84m²",
            fee: "관리비 8만원",
            deposit: "전세 8억",
            image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=200&h=200&fit=crop&crop=center",
            isBookmarked: true,
          },
        ]);
      }, 1500); // 1.5초 로딩 시간
    });
  };

  // 재시도 함수
  const handleRetry = () => {
    window.location.reload();
  };

  // 이벤트 핸들러들
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

  const handlePropertyClick = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  const handleViewAll = () => {
    navigate("/properties");
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
      {/* 개발용 상태바 (프로덕션에서는 제거) */}
      {/*process.env.NODE_ENV === "development" && <StatusBar />*/}

      <ContentWrapper>
        {/* 헤더 */}
        <Header onLogout={handleLogout} />

        {/* 계약 체크리스트 섹션 */}
        <ContractChecklistSection userName={user?.name || "김땡땡님"} onChecklistClick={handleChecklistClick} onOtherActionClick={handleSearchClick} />

        {/* 지역 추천 매물 섹션 */}
        <RecommendedPropertiesSection
          properties={properties}
          onPropertyClick={handlePropertyClick}
          onViewAll={handleViewAll}
        />
      </ContentWrapper>
    </MainPageContainer>
  );
}
