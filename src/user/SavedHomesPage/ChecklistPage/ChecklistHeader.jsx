// src/user/SavedHomesPage/ChecklistPage/components/ChecklistHeader.jsx
import styled from "styled-components";

const HeaderContainer = styled.header`
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 100;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BackButton = styled.button`
  position: absolute;
  left: 16px;
  background: none;
  border: none;
  cursor: pointer;
  width: 24px;
  height: 24px;

`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: 700;
  color: #464a4d;
  margin: 0;
  line-height: 24px;
  text-align: center;
  vertical-align: middle;
`;

export default function ChecklistHeader({ title, onBack }) {
  return (
    <HeaderContainer>
      <BackButton onClick={onBack}>
        <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M1.06055 6.78033H16.0605V8.28033H1.06055V6.78033Z" fill="#464A4D" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2.12132 7.53033L8.59099 1.06066L7.53033 0L0 7.53033L7.53033 15.0607L8.59099 14L2.12132 7.53033Z"
            fill="#464A4D"
          />
        </svg>
      </BackButton>
      <Title>{title}</Title>
    </HeaderContainer>
  );
}
