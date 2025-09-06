// src/user/SavedHomesPage/ChecklistPage/components/BasicInfoSection.jsx
import styled from "styled-components";
import { useState } from "react";

const BasicInfoContainer = styled.section`
  margin: 24px 0;
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
  background: ${(props) => (props.disabled ? "#9ca3af" : "#3299FF")};
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
  display: inline-flex;
  background: #efefef;
  border-radius: 100px;
  padding: 6px 10px 6px 10px;
  gap: 12px;
  position: relative;
  width: 112px;
  height: 40px;
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

const ActiveBackground = styled.div`
  position: absolute;
  width: 56px;
  height: 32px;
  top: 4px;
  left: ${(props) => (props.$activeIndex === 0 ? "4px" : "50%")};
  background: #3299ff;
  border-radius: 20px;
  border: 2px solid #3299ff;
  transition: all 0.25s ease;
  z-index: 1;
`;

export default function BasicInfoSection({
  buildingName,
  address,
  deposit,
  monthlyRent,
  maintenanceFee,
  onChange,
  leftOption = "월세",
  rightOption = "전세",
  defaultValue = 0,
  onToggleChange,
}) {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [activeIndex, setActiveIndex] = useState(defaultValue);

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
  };

  return (
    <BasicInfoContainer>
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
        <Label>상세주소</Label>
        <Input type="text" placeholder="상세주소 입력" />
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

      <InputGroupWrapper>
        <InputGroup>
          <Label htmlFor="deposit">보증금</Label>
          <Input id="deposit" type="text" placeholder="0만원" value={deposit} onChange={(e) => onChange("deposit", e.target.value)} />
        </InputGroup>

        {/* 월세 입력 추가 */}
        <InputGroup>
          <Label htmlFor="monthlyRent">월세</Label>
          <Input id="monthlyRent" type="text" placeholder="0만원" value={monthlyRent} onChange={(e) => onChange("monthlyRent", e.target.value)} />
        </InputGroup>
      </InputGroupWrapper>

      <InputGroupWrapper>
        {/* 관리비 입력 추가 */}
        <InputGroup>
          <Label htmlFor="maintenanceFee">관리비</Label>
          <Input id="maintenanceFee" type="text" placeholder="0만원" value={maintenanceFee} onChange={(e) => onChange("maintenanceFee", e.target.value)} />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="maintenanceFee">면적</Label>
          <Input id="maintenanceFee" type="text" placeholder="0㎡" value={maintenanceFee} onChange={(e) => onChange("maintenanceFee", e.target.value)} />
        </InputGroup>
      </InputGroupWrapper>
    </BasicInfoContainer>
  );
}
