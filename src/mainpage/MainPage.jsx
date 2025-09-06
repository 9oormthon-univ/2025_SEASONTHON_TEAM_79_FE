import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "./Header";
import StatusBar from "./StatusBar";
import ContractChecklistSection from "./ContractChecklistSection";
import RecommendedPropertiesSection from "./RecommendedPropertiesSection";

const MainPageContainer = styled.div`
  min-height: 100%;
  background: #FFFFFF;
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

export default function MainPage() {
  const navigate = useNavigate();

  // 상태 관리
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 데이터 로딩
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 임시 로그인 설정 - API 연동 전까지만 사용
        const tempUser = {
          id: 1,
          name: "김땡땡",
          email: "test@example.com"
        };
        const tempToken = "temp_token_12345";
        
        // localStorage에 임시 데이터 저장
        localStorage.setItem("user", JSON.stringify(tempUser));
        localStorage.setItem("token", tempToken);

        // 사용자 데이터 확인
        const userData = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        // 실제 로그인 상태 확인 (token과 userData 모두 있어야 로그인 상태)
        const loggedIn = !!(userData && token);
        setIsLoggedIn(loggedIn);

        if (loggedIn) {
          // 로그인된 경우에만 사용자 데이터 설정
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);

          // 추천 매물 데이터 로드
          const propertiesData = await fetchRecommendedProperties();
          setProperties(propertiesData);

          console.log("데이터 로딩 완료:", propertiesData.length, "개 매물");
        } else {
          // 로그인되지 않은 경우 빈 배열로 설정
          setProperties([]);
        }
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
            location: "서울시 서대문구 남가좌동 29-1",
            name: "명지힐하우스",
            rating: 4.7,
            size: "33m²",
            fee: "관리비 5만원",
            deposit: "월세 300/84",
            image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=200&h=200&fit=crop&crop=center",
            isBookmarked: false,
          },
          {
            id: 2,
            location: "서울시 서대문구 남가좌동",
            name: "삼성쉐르빌",
            rating: 4.6,
            size: "66m²",
            fee: "관리비 5만원",
            deposit: "월세 1000/55",
            image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=200&h=200&fit=crop&crop=center",
            isBookmarked: true,
          },
          {
            id: 3,
            location: "서울시 서대문구 남가좌동 41",
            name: "남가좌동 명지힐하우스",
            rating: 4.7,
            size: "112m²",
            fee: "관리비 5만원",
            deposit: "월세 30/20",
            image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200&h=200&fit=crop&crop=center",
            isBookmarked: false,
          },
          {
            id: 4,
            location: "서울시 서대문구 남가좌동",
            name: "센텀힐스테이트",
            rating: 4.5,
            size: "112㎡",
            fee: "관리비 10만원",
            deposit: "전세 1억",
            image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=200&h=200&fit=crop&crop=center",
            isBookmarked: true,
          },
          {
            id: 5,
            location: "서울시 서대문구 남가좌동",
            name: "명지대1가길 25",
            rating: 4.4,
            size: "95㎡",
            fee: "관리비 5만원",
            deposit: "전세 5000만원",
            image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=200&h=200&fit=crop&crop=center",
            isBookmarked: true,
          },
        ]);
      }, 1000); // 1.5초 로딩 시간
    });
  };

  // 재시도 함수
  const handleRetry = () => {
    window.location.reload();
  };

  const handleLogin = () => {
    navigate("/");
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
      <StatusBar />

      <ContentWrapper>
        {/* 헤더 */}
        <Header onLogout={isLoggedIn ? handleLogout : undefined} onLogin={!isLoggedIn ? handleLogin : undefined} isLoggedIn={isLoggedIn} />

        {/* 계약 체크리스트 섹션 */}
        <ContractChecklistSection userName={user?.name || "김땡땡님"} onChecklistClick={handleChecklistClick} onOtherActionClick={handleSearchClick} isLoggedIn={isLoggedIn} />

        {/* 지역 추천 매물 섹션 */}
        <RecommendedPropertiesSection properties={properties} onPropertyClick={handlePropertyClick} onViewAll={handleViewAll} isLoggedIn={isLoggedIn}/>
      </ContentWrapper>
    </MainPageContainer>
  );
}
