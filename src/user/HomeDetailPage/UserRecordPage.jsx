import styled from "styled-components";
import StatusBar from "../../mainpage/StatusBar";
import ChecklistHeader from "../SavedHomesPage/ChecklistPage/ChecklistHeader";
import UserRecordlist from "./UserRecordlist";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ===== API 함수 ===== */
const fetchUserChecklistsAPI = async () => {
  try {
    const token = localStorage.getItem("token");

    const BACK_API_URL = import.meta.env.VITE_BACKEND_API_URL;
    const response = await fetch(`${BACK_API_URL}/api/checklists/mine`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("체크리스트 조회 실패:", error);
    throw error;
  }
};

const UserRecordPageContainer = styled.div`
  min-height: 100%;
  background: #ffffff;
  width: 100%;
  overflow-x: hidden;
`;

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: #ffffff;
  overflow-x: auto;
`;

const FilterButton = styled.button`
  align-items: center;
  background: none;
  border: 1px solid #e8eef2;
  border-radius: 24px;
  background: ${(props) => (props.$isActive ? "#0073E6" : "#FFFFFF")};
  font-size: 14px;
  color: ${(props) => (props.$isActive ? "#FFFFFF" : "#464A4D")};
  font-weight: 700;
  line-height: 20px;
  cursor: pointer;
  padding: 8px 16px;
  margin: 4px;
  width: 21%;
  min-width: 80px;
  flex-shrink: 0;
  text-align: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => (props.$isActive ? "#0056CC" : "#F8F9FA")};
  }
`;

/* ===== 로딩/에러 UI ===== */
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 16px;
  color: #6b7280;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
  padding: 20px;
  text-align: center;
`;

const ErrorMessage = styled.p`
  font-size: 16px;
  color: #ef4444;
  margin-bottom: 16px;
`;

const RetryButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #2563eb;
  }
`;

const EmptyContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 16px;
  color: #9ca3af;
`;

export default function UserRecordPage() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [sortOrder, setSortOrder] = useState("rating_desc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  //유저 아이디값
  const userId = localStorage.getItem("userId");

  const sortOptions = [
    { value: "rating_desc", label: "별점순" },
    { value: "recent", label: "최신순" },
  ];

  // 이미지 URL 처리 함수
  const getImageUrl = (photos) => {
    if (!photos || !Array.isArray(photos) || photos.length === 0) {
      return null; // 기본 이미지는 컴포넌트에서 처리
    }

    const firstPhoto = photos[0];

    // rawUrl이 있으면 사용
    if (firstPhoto.rawUrl) {
      // rawUrl이 절대 경로인지 확인
      if (firstPhoto.rawUrl.startsWith("http")) {
        return firstPhoto.rawUrl;
      } else {
        // 상대 경로라면 백엔드 URL과 결합
        const BACK_API_URL = import.meta.env.VITE_BACKEND_API_URL;
        return `${BACK_API_URL}${firstPhoto.rawUrl}`;
      }
    }

    // rawUrl이 없으면 filename으로 URL 구성 시도
    if (firstPhoto.filename) {
      const BACK_API_URL = import.meta.env.VITE_BACKEND_API_URL;
      return `${BACK_API_URL}/api/files/${firstPhoto.filename}`;
    }

    return null;
  };

  //데이터 가공
  const transformApiData = (apiData) => {
    return apiData.map((item) => {

      const imageUrl = getImageUrl(item.photos);

      return {
        id: item.id,
        location: item.address || "주소 정보 없음",
        name: item.aptNm || "매물명 없음",
        rating: Number(item.avgScore || 0).toFixed(1),
        size: `${item.floorAreaSqm || 0}평`,
        fee: `관리비 ${(item.maintenanceFee || 0).toLocaleString()}만원`,
        deposit:
          item.monthly > 0
            ? `월세 ${(item.deposit || 0).toLocaleString()}/${(item.monthly || 0).toLocaleString()}`
            : `전세 ${(item.deposit || 0).toLocaleString()}만원`,
        image: imageUrl, // URL 문자열로 전달
        hasImage: !!imageUrl, // 이미지 존재 여부
        photoCount: item.photos?.length || 0, // 사진 개수
      };
    });
  };

  // 데이터 로드 함수
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const apiData = await fetchUserChecklistsAPI(userId);
      const transformedData = transformApiData(apiData);

      setProperties(transformedData);
    } catch (error) {
      console.error("데이터 로드 실패:", error);
      setError("체크리스트를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchData();
  }, [userId]);

  useEffect(() => {
    const sortProperties = () => {
      const sorted = [...properties].sort((a, b) => {
        switch (sortOrder) {
          case "rating_desc":
            return b.rating - a.rating;
          case "recent":
            return b.id - a.id;
          default:
            return 0;
        }
      });
      setFilteredProperties(sorted);
    };

    if (properties.length > 0) {
      sortProperties();
    } else {
      setFilteredProperties([]);
    }
  }, [properties, sortOrder]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSortChange = (value) => {
    setSortOrder(value);
  };

  const handlePropertyClick = (Id) => {
    navigate(`/myhomedetail/${Id}`);
  };

  const handleRetry = () => {
    fetchData();
  };

  if (loading) {
    return (
      <UserRecordPageContainer>
        <StatusBar />
        <ChecklistHeader title="나의 기록" onBack={handleBack} />
        <LoadingContainer>체크리스트를 불러오는 중...</LoadingContainer>
      </UserRecordPageContainer>
    );
  }

  if (error) {
    return (
      <UserRecordPageContainer>
        <StatusBar />
        <ChecklistHeader title="나의 기록" onBack={handleBack} />
        <ErrorContainer>
          <ErrorMessage>{error}</ErrorMessage>
          <RetryButton onClick={handleRetry}>다시 시도</RetryButton>
        </ErrorContainer>
      </UserRecordPageContainer>
    );
  }

  return (
    <UserRecordPageContainer>
      <StatusBar />
      <ChecklistHeader title="나의 기록" onBack={handleBack} />

      <FilterContainer>
        {sortOptions.map((option) => (
          <FilterButton key={option.value} $isActive={sortOrder === option.value} onClick={() => handleSortChange(option.value)}>
            {option.label}
          </FilterButton>
        ))}
      </FilterContainer>
      {filteredProperties.length === 0 && !loading && !error ? (
        <EmptyContainer>아직 작성한 체크리스트가 없습니다.</EmptyContainer>
      ) : (
        <UserRecordlist properties={filteredProperties} onPropertyClick={handlePropertyClick} />
      )}
    </UserRecordPageContainer>
  );
}
