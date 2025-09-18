// src/user/SavedHomesPage/ChecklistPage/components/BasicInfoSection.jsx
import styled from "styled-components";
import { useState } from "react";

const BasicInfoContainer = styled.section`
  margin: 24px 0
  width: 100%;
`;

const InputGroup = styled.div`
  width: 100%;
  height: auto;
  margin: 4px 0;
  padding: 0;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 700;
  color: #464a4d;
  margin: 8px 0 4px 0;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #e8eef2;
  border-radius: 8px;
  font-size: 16px;
  background: #ffffff;
  box-sizing: border-box;

  &::placeholder {
    color: #757b80;
    font-weight: 400;
    font-size: 16px;
  }
`;

const ResultList = styled.ul`
  list-style: none;
  margin: 8px 0 0;
  padding: 0;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  max-height: 200px;
  overflow-y: auto;
  background: #fff;
  z-index: 10;
  position: relative;
`;

const ResultItem = styled.li`
  padding: 10px 14px;
  cursor: pointer;
  font-size: 14px;
  &:hover {
    background: #f3f4f6;
  }
`;

const SearchWrapper = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;

  input {
    flex: 1;
    min-width: 0;
  }
`;

const SearchButton = styled.button`
  min-width: 60px;
  flex-shrink: 0;
  padding: 10px 8px;
  border: 1px solid #e8eef2;
  border-radius: 6px;
  font-weight: 700;
  background: ${(props) => (props.disabled ? "#9ca3af" : "#0073E6")};
  color: white;
  font-size: 14px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: background 0.2s;
`;

const InputGroupWrapper = styled.div`
  display: flex;
  row-gap: 16px;
  column-gap: 18px;
`;

// 토글 부분 스타일 컴포넌트
const ToggleContainer = styled.div`
  display: flex;
  background: #efefef;
  border-radius: 100px;
  padding: 6px 10px 6px 10px;
  gap: 12px;
  position: relative;
  width: 108px;
  height: 32px;
  margin: 15px 0;
`;

const ToggleOption = styled.button`
  flex: 1;
  border: none;
  background: transparent;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s ease;
  position: relative;
  align-items: center;
  line-height: 20px;
  z-index: 2;

  color: ${(props) => (props.$active ? "#FFFFFF" : "#808080")};
`;

// 비활성화된 Input 스타일
const DisabledInput = styled(Input)`
  background: #f5f5f5;
  color: #9ca3af;
  cursor: not-allowed;

  &::placeholder {
    color: #9ca3af;
  }
`;

const ActiveBackground = styled.div`
  position: absolute;
  width: 56px;
  height: 32px;
  top: 0px;
  left: ${(props) => (props.$activeIndex === 0 ? "2px" : "48%")};
  background: #0073E6;
  border-radius: 20px;
  border: 2px solid #0073E6;
  transition: all 0.25s ease;
  z-index: 1;
`;

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 0;
  height: 40px;
  background: #ffffff;
  gap: 12px;
`;

const FilterButton = styled.button`
  border: 1px solid ${(props) => (props.$isActive ? "#0073E6" : "#E8EEF2")};
  border-radius: 30px;
  background: ${(props) => (props.$isActive ? "#0073E6" : "#FFF")};
  font-size: 16px;
  color: ${(props) => (props.$isActive ? "#FFF" : "#757B80")};
  font-weight: 700;
  line-height: 20px;
  cursor: pointer;
  width: 105px;
  height: 40px;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  line-height: 24px;
`;

const RoomStructureLabel = styled(Label)`
  margin: 16px 0 8px 0;
`;

export default function BasicInfoSection({
  name,
  address,
  detailAddress,
  deposit,
  monthlyRent,
  maintenanceFee,
  area,
  roomStructure,
  onChange,
  leftOption = "월세",
  rightOption = "전세",
  defaultValue = 0,
  onToggleChange,
}) {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [activeIndex, setActiveIndex] = useState(defaultValue);

  const isMonthlyRent = activeIndex === 0; // 0이면 월세, 1이면 전세
  const currentRentType = isMonthlyRent ? leftOption : rightOption;

  const isDepositDisabled = !isMonthlyRent;

  const handleNumberInput = (field, value) => {
    const numbericValue = value.replace(/[^0-9.]/g, "");
    onChange(field, numbericValue);
  };
  const handleKeywordChange = (e) => {
    setKeyword(e.target.value);
  };

  const handleSearch = async () => {
    if (keyword.trim().length < 2) {
      alert("검색어를 2자 이상 입력하세요.");
      return;
    }

    try {
      const JUSO_BASE_URL = import.meta.env.VITE_JUSO_BASE_URL;
      const res = await fetch(
        `https://business.juso.go.kr/addrlink/addrLinkApi.do?confmKey=${JUSO_BASE_URL}&currentPage=1&countPerPage=10&keyword=${encodeURIComponent(
          keyword
        )}&resultType=json`
      );
      const data = await res.json();
      setResults(data.results.juso || []);
    } catch (err) {
      console.error("주소 검색 실패:", err);
      setResults([]);
    }
  };

  const handleSelect = (addr) => {
    onChange("address", addr);
    setKeyword(addr);
    setResults([]);
  };

  const handleToggle = (index) => {
    setActiveIndex(index);
    onToggleChange?.(index, index === 0 ? leftOption : rightOption);

    // 전세로 변경 시 보증금 값 초기화
    if (index === 1) {
      onChange("deposit", "");
    }
  };

  const handleSortChange = (value) => {
    onChange("roomStructure", value);
  };

  //보증금 입력 핸들러
  const handleDepositInput = (field, value) => {
    if (isDepositDisabled) {
      return; // 전세일 때는 입력 무시
    }
    handleNumberInput(field, value);
  };

  const sortOptions = [
    { value: "ONE_ROOM", label: "원룸" },
    { value: "TWO_ROOM", label: "투룸" },
    { value: "THREE_PLUS", label: "3개이상" },
  ];

  return (
    <BasicInfoContainer>
      <InputGroup>
        <Label>건물이름</Label>
        <Input type="text" placeholder="건물이름" value={name || ""} onChange={(e) => onChange("name", e.target.value)} />
      </InputGroup>
      <InputGroup>
        <Label>건물주소</Label>
        <SearchWrapper>
          <Input type="text" placeholder="도로명 검색" value={keyword} onChange={handleKeywordChange} />
          <SearchButton disabled={keyword.trim().length < 2} onClick={handleSearch}>
            검색
          </SearchButton>
        </SearchWrapper>
        {results.length > 0 && (
          <ResultList>
            {results.map((item, idx) => (
              <ResultItem key={idx} onClick={() => handleSelect(item.roadAddr)}>
                {item.roadAddr}
              </ResultItem>
            ))}
          </ResultList>
        )}
      </InputGroup>
      <InputGroup>
        <Label>상세주소</Label>
        <Input type="text" placeholder="상세주소" value={detailAddress || ""} onChange={(e) => onChange("detailAddress", e.target.value)} />
      </InputGroup>

      {/* 월세/전세 토글 */}
      <ToggleContainer>
        <ActiveBackground $activeIndex={activeIndex} />
        <ToggleOption $active={activeIndex === 0} onClick={() => handleToggle(0)}>
          {leftOption}
        </ToggleOption>
        <ToggleOption $active={activeIndex === 1} onClick={() => handleToggle(1)}>
          {rightOption}
        </ToggleOption>
      </ToggleContainer>

      {/* 방구조 토글 */}
      <InputGroup>
        <RoomStructureLabel>방구조</RoomStructureLabel>
        <FilterContainer>
          {sortOptions.map((option) => (
            <FilterButton key={option.value} $isActive={roomStructure === option.value} onClick={() => handleSortChange(option.value)}>
              {option.label}
            </FilterButton>
          ))}
        </FilterContainer>
      </InputGroup>

      <InputGroupWrapper>
        <InputGroup>
          <Label htmlFor="deposit">보증금</Label>
          {isDepositDisabled ? (
            <DisabledInput
              id="deposit"
              type="text"
              placeholder="0만원"
              value="" // 전세일 때는 빈 값
              disabled
              readOnly
            />
          ) : (
            <Input id="deposit" type="text" placeholder="0만원" value={deposit || ""} onChange={(e) => handleDepositInput("deposit", e.target.value)} />
          )}
        </InputGroup>
        <InputGroup>
          <Label htmlFor="monthlyRent">{currentRentType}</Label>
          <Input
            id="monthlyRent"
            type="text"
            placeholder="0만원"
            value={monthlyRent || ""}
            onChange={(e) => handleNumberInput("monthlyRent", e.target.value)}
          />
        </InputGroup>
      </InputGroupWrapper>

      <InputGroupWrapper>
        <InputGroup>
          <Label htmlFor="maintenanceFee">관리비</Label>
          <Input
            id="maintenanceFee"
            type="text"
            placeholder="0만원"
            value={maintenanceFee || ""}
            onChange={(e) => handleNumberInput("maintenanceFee", e.target.value)}
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="area">면적</Label>
          <Input id="area" type="text" placeholder="0평" value={area || ""} onChange={(e) => handleNumberInput("area", e.target.value)} />
        </InputGroup>
      </InputGroupWrapper>
    </BasicInfoContainer>
  );
}
