import styled from "styled-components";
import StatusBar from "../../mainpage/StatusBar";
import ChecklistHeader from "../SavedHomesPage/ChecklistPage/ChecklistHeader";
import UserRecordlist from "./UserRecordlist";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
  border: 1px solid #E8EEF2;
  border-radius: 24px;
  background: ${(props) => (props.isActive ? "#007AFF" : "#FFFFFF")};
  font-size: 14px;
  color: ${(props) => (props.isActive ? "#FFFFFF" : "#464A4D")};
  font-weight: 700;
  line-height: 20px;
  cursor: pointer;
  padding: 8px 16px;
  margin: 4px;
  width: 21%;
  min-width: 80px;
  flew-shrink: 0;
  text-align: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${(props) => (props.isActive ? "#0056CC" : "#F8F9FA")};
  }
  }
`;

export default function UserRecordPage() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [sortOrder, setSortOrder] = useState("rating_desc");

  const navigate = useNavigate();

  const sortOptions = [
    { value: "rating_desc", label: "별점순" },
    { value: "recent", label: "최신순" },
  ];

  useEffect(() => {
    const fetchData = async () => {
        // 추천 매물 데이터 로드
        const propertiesData = await fetchRecommendedProperties();
        setProperties(propertiesData);
    };

    fetchData();
  }, []);

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
    }
  }, [properties, sortOrder]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSortChange = (value) => {
    setSortOrder(value);
  };

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
      }, 1000);
    });
  };
  const handlePropertyClick = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  return (
    <UserRecordPageContainer>
      <StatusBar />
      <ChecklistHeader title="나의 기록" onBack={handleBack} />

      <FilterContainer>
        {sortOptions.map((option) => (
          <FilterButton key={option.value} isActive={sortOrder === option.value} onClick={() => handleSortChange(option.value)}>
            {option.label}
          </FilterButton>
        ))}
      </FilterContainer>
      <UserRecordlist properties={filteredProperties} onPropertyClick={handlePropertyClick} />
    </UserRecordPageContainer>
  );
}
