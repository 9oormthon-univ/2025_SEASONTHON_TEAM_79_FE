// src/user/SavedHomesPage/ChecklistPage/components/MemoSection.jsx
import styled from "styled-components";

const MemoContainer = styled.section`
  width: 100%;
  opacity: 1;
`;

const SectionTitle = styled.p`
  font-family: Andika;
  font-size: 16px;
  font-weight: 700;
  color: #000000;
  margin: 0 0 4px 0;
`;

const MemoTextarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 16px;
  border: 1px solid #E8EEF2;
  border-radius: 10px;
  font-size: 16px;
  font-family: inherit;
  resize: vertical;
  background: #ffffff;
  box-shadow: 0px 2px 4px 0px #0000001A;
  box-sizing: border-box;

  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &::placeholder {
    font-size: 14px;
    font-weight: 400
    color: #464A4D;
    line-height: 180%;
  }
`;

export default function MemoSection({ memo, onChange }) {
  return (
    <MemoContainer>
      <SectionTitle>메모</SectionTitle>
      <MemoTextarea placeholder="500자까지 메모를 남길 수 있어요." value={memo} onChange={(e) => onChange(e.target.value)} />
    </MemoContainer>
  );
}
