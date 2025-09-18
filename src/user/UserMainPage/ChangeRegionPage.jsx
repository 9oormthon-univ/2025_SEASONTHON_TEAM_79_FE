import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import StatusBar from "../../mainpage/StatusBar";
import ChecklistHeader from "../SavedHomesPage/ChecklistPage/ChecklistHeader";
import { KOREA_REGIONS } from "./regions";

const Container = styled.div`
  background: #ffffff;
  min-height: 100vh;
`;

const MyAreaSection = styled.div`
  padding-top: 40px;
  text-align: center;
`;

const MyAreaTitle = styled.h2`
  font-size: 24px;
  font-family: Andika;
  font-weight: 700;
  color: #17191a;
  margin: 0 0 20px 0;
`;

const SearchContainer = styled.div`
  position: relative;
  padding: 8px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 16px 20px 16px 50px;
  font-size: 16px;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  font-weight: 400;
  background: #fff;
  box-sizing: border-box;
  color: #a4adb2;

  &:focus {
    outline: none;
    border-color: #3299ff;
    background: #ffffff;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
  color: #999;
`;

const RegionList = styled.div`
  padding: 0 16px 20px;
`;

const RegionItem = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 16px 20px;
  border: none;
  background: ${(props) => (props.$isSelected ? "#e8f4fd" : "#ffffff")};
  border-bottom: 1px solid #f0f0f0;
  font-size: 16px;
  font-weight: 500;
  color: ${(props) => (props.$isSelected ? "#3299ff" : "#333")};
  cursor: pointer;
  text-align: left;
  transition: background-color 0.2s;

  &:hover {
    background: #f8f9fa;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border: none;
  background: #ffffff;
  font-size: 16px;
  color: #666;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;

  &:hover {
    background: #f8f9fa;
  }
`;

const BreadcrumbContainer = styled.div`
  padding: 16px;
  background: #f8f9fa;
  border-bottom: 1px solid #e5e5e5;
`;

const Breadcrumb = styled.div`
  font-size: 14px;
  color: #666;

  span {
    margin: 0 8px;
    color: #999;
  }

  .current {
    color: #3299ff;
    font-weight: 600;
  }
`;

const NoResults = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: #999;
  font-size: 16px;
`;

export default function ChangeRegionPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentStep, setCurrentStep] = useState("city"); // 'city', 'district', 'dong'
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);

  const navigate = useNavigate();

  // 검색 필터링
  useEffect(() => {
    if (currentStep === "city") {
      // 시/도 검색
      const cities = Object.keys(KOREA_REGIONS).filter((city) => city.toLowerCase().includes(searchTerm.toLowerCase()));
      setFilteredItems(cities);
    } else if (currentStep === "district") {
      // 구/군 검색
      const districts = Object.keys(KOREA_REGIONS[selectedCity]?.districts || {}).filter((district) =>
        district.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredItems(districts);
    } else if (currentStep === "dong") {
      // 동 검색
      const dongs = KOREA_REGIONS[selectedCity]?.districts[selectedDistrict] || [];
      const filteredDongs = Array.isArray(dongs) ? dongs.filter((dong) => dong.toLowerCase().includes(searchTerm.toLowerCase())) : [];
      setFilteredItems(filteredDongs);
    }
  }, [searchTerm, currentStep, selectedCity, selectedDistrict]);

  // 초기 로딩
  useEffect(() => {
    if (currentStep === "city") {
      setFilteredItems(Object.keys(KOREA_REGIONS));
    }
  }, [currentStep]);

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setCurrentStep("district");
    setSearchTerm("");
  };

  const handleDistrictSelect = (district) => {
    setSelectedDistrict(district);

    const dongs = KOREA_REGIONS[selectedCity]?.districts[district];

    // 동이 배열인지 확인 (직할시나 광역시의 경우)
    if (Array.isArray(dongs)) {
      setCurrentStep("dong");
      setSearchTerm("");
    } else {
      // 동이 없는 경우 (시/군인 경우) 바로 선택 완료
      completeSelection(selectedCity, district, "");
    }
  };

  const handleDongSelect = (dong) => {
    completeSelection(selectedCity, selectedDistrict, dong);
  };

    const handleBack = () => {
    navigate(-1);
  };

  const completeSelection = async (city, district, dong) => {
    const fullAddress = dong ? `${city} ${district} ${dong}` : `${city} ${district}`;

    try {
      // 🔥 API로 지역 변경 요청
      const token = localStorage.getItem("token");
      const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL;

      console.log("🌍 지역 변경 API 요청:", fullAddress);

      const response = await fetch(`${API_BASE_URL}/users/profiles`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          region: fullAddress,
        }),
      });

      if (!response.ok) {
        throw new Error(`지역 변경 실패: ${response.status}`);
      }

      const result = await response.json();
      console.log("✅ 지역 변경 성공:", result);

      // 로컬 스토리지에도 저장 (UI 업데이트용)
      const regionData = {
        city,
        district,
        dong,
        fullAddress,
        selectedAt: new Date().toISOString(),
      };

      localStorage.setItem("selectedRegion", JSON.stringify(regionData));

      alert(`'${fullAddress}' 지역으로 변경되었습니다.`);
      navigate(-1);
    } catch (error) {
      console.error("❌ 지역 변경 실패:", error);
      alert(`지역 변경에 실패했습니다.\n${error.message}`);
    }
  };

  const getTitle = () => {
    if (currentStep === "city") return "지역변경";
    if (currentStep === "district") return selectedCity;
    if (currentStep === "dong") return `${selectedCity} ${selectedDistrict}`;
    return "지역변경";
  };

  const getBreadcrumb = () => {
    if (currentStep === "city") return null;
    if (currentStep === "district")
      return (
        <Breadcrumb>
          <span className="current">{selectedCity}</span>
        </Breadcrumb>
      );
    if (currentStep === "dong")
      return (
        <Breadcrumb>
          {selectedCity} <span></span> <span className="current">{selectedDistrict}</span>
        </Breadcrumb>
      );
  };

  const getPlaceholder = () => {
    if (currentStep === "city") return "지역이나 동네 검색하기";
    if (currentStep === "district") return "구/군 검색하기";
    if (currentStep === "dong") return "동 검색하기";
    return "검색하기";
  };

  return (
    <Container>
      <StatusBar />
      <ChecklistHeader title={getTitle()} onBack={handleBack} />

      {getBreadcrumb() && <BreadcrumbContainer>{getBreadcrumb()}</BreadcrumbContainer>}

      <MyAreaSection>
        <MyAreaTitle>나의 동네</MyAreaTitle>

        <SearchContainer>
          <SearchIcon>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 22C11.7667 22 11.5667 21.9333 11.4 21.8C11.2333 21.6667 11.1083 21.4917 11.025 21.275C10.7083 20.3417 10.3083 19.4667 9.825 18.65C9.35833 17.8333 8.7 16.875 7.85 15.775C7 14.675 6.30833 13.625 5.775 12.625C5.25833 11.625 5 10.4167 5 9C5 7.05 5.675 5.4 7.025 4.05C8.39167 2.68333 10.05 2 12 2C13.95 2 15.6 2.68333 16.95 4.05C18.3167 5.4 19 7.05 19 9C19 10.5167 18.7083 11.7833 18.125 12.8C17.5583 13.8 16.9 14.7917 16.15 15.775C15.25 16.975 14.5667 17.975 14.1 18.775C13.65 19.5583 13.275 20.3917 12.975 21.275C12.8917 21.5083 12.7583 21.6917 12.575 21.825C12.4083 21.9417 12.2167 22 12 22ZM12 18.425C12.2833 17.8583 12.6 17.3 12.95 16.75C13.3167 16.2 13.85 15.4667 14.55 14.55C15.2667 13.6167 15.85 12.7583 16.3 11.975C16.7667 11.175 17 10.1833 17 9C17 7.61667 16.5083 6.44167 15.525 5.475C14.5583 4.49167 13.3833 4 12 4C10.6167 4 9.43333 4.49167 8.45 5.475C7.48333 6.44167 7 7.61667 7 9C7 10.1833 7.225 11.175 7.675 11.975C8.14167 12.7583 8.73333 13.6167 9.45 14.55C10.15 15.4667 10.675 16.2 11.025 16.75C11.3917 17.3 11.7167 17.8583 12 18.425ZM12 11.5C12.7 11.5 13.2917 11.2583 13.775 10.775C14.2583 10.2917 14.5 9.7 14.5 9C14.5 8.3 14.2583 7.70833 13.775 7.225C13.2917 6.74167 12.7 6.5 12 6.5C11.3 6.5 10.7083 6.74167 10.225 7.225C9.74167 7.70833 9.5 8.3 9.5 9C9.5 9.7 9.74167 10.2917 10.225 10.775C10.7083 11.2583 11.3 11.5 12 11.5Z"
                fill="#464A4D"
              />
            </svg>
          </SearchIcon>
          <SearchInput type="text" placeholder={getPlaceholder()} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <SearchIcon style={{ left: "auto", right: "16px" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M19.6 21L13.3 14.7C12.8 15.1 12.225 15.4167 11.575 15.65C10.925 15.8833 10.2333 16 9.5 16C7.68333 16 6.14583 15.3708 4.8875 14.1125C3.62917 12.8542 3 11.3167 3 9.5C3 7.68333 3.62917 6.14583 4.8875 4.8875C6.14583 3.62917 7.68333 3 9.5 3C11.3167 3 12.8542 3.62917 14.1125 4.8875C15.3708 6.14583 16 7.68333 16 9.5C16 10.2333 15.8833 10.925 15.65 11.575C15.4167 12.225 15.1 12.8 14.7 13.3L21 19.6L19.6 21ZM9.5 14C10.75 14 11.8125 13.5625 12.6875 12.6875C13.5625 11.8125 14 10.75 14 9.5C14 8.25 13.5625 7.1875 12.6875 6.3125C11.8125 5.4375 10.75 5 9.5 5C8.25 5 7.1875 5.4375 6.3125 6.3125C5.4375 7.1875 5 8.25 5 9.5C5 10.75 5.4375 11.8125 6.3125 12.6875C7.1875 13.5625 8.25 14 9.5 14Z"
                fill="#1D1B20"
              />
            </svg>
          </SearchIcon>
        </SearchContainer>
      </MyAreaSection>

      <RegionList>
        {currentStep !== "city" && <BackButton onClick={handleBack}>← 뒤로가기</BackButton>}

        {filteredItems.length === 0 ? (
          <NoResults>검색 결과가 없습니다.</NoResults>
        ) : (
          filteredItems.map((item, index) => (
            <RegionItem
              key={index}
              onClick={() => {
                if (currentStep === "city") handleCitySelect(item);
                else if (currentStep === "district") handleDistrictSelect(item);
                else if (currentStep === "dong") handleDongSelect(item);
              }}
            >
              {item}
            </RegionItem>
          ))
        )}
      </RegionList>
    </Container>
  );
}
