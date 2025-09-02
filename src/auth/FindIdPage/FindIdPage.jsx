// src/pages/FindId.jsx
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Header = styled.header`
  position: relative;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #eee;
`;

const BackBtn = styled.button`
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: none;
  font-size: 18px;
  cursor: pointer;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
`;

const Body = styled.main`
  flex: 1;
  padding: 24px 20px;
  display: grid;          
  place-items: center;    
`;

const Center = styled.div`
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: stretch;   
  text-align: center;
`;


const LogoArea = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #666;
  font-size: 14px;
  &::before {
    content: "★";
    font-size: 64px;
    margin-right: 8px;
    color: #bdbdbd;
  }
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Label = styled.label`
  font-size: 14px;
  text-align: left;
  margin-bottom: -6px;
`;

const Input = styled.input`
  width: 90%;
  height: 44px;
  border-radius: 8px;
  border: 1px solid #ddd;
  padding: 0 12px;
  font-size: 14px;
  background: #f9fafb;
  &:focus {
    outline: 2px solid #11182720;
    background: #fff;
  }
`;

const PrimaryBtn = styled.button`
  width: 100%;
  height: 48px;
  border-radius: 8px;
  border: none;
  font-weight: 700;
  font-size: 15px;
  background: #9ca3af;
  color: #fff;
  cursor: pointer;
  ${(p) =>
    p.$primary &&
    `
    background: #111827; color: #fff;
  `}
  opacity: ${(p) => (p.disabled ? 0.5 : 1)};
`;

const Info = styled.p`
  font-size: 13px;
  color: #6b7280;
`;

export default function FindId() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const canSubmit = name.trim().length > 0 && contact.trim().length > 0;

  const onSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    alert("아이디 찾기 요청 전송됨");
  };

  return (
    <Wrap>
      <Header>
        <BackBtn onClick={() => nav(-1)}>←</BackBtn>
        <Title>아이디 찾기</Title>
      </Header>
      <Body>
        <Center>
          <LogoArea>로고</LogoArea>
          <Form onSubmit={onSubmit}>
            <div>
              <Label>이름</Label>
              <Input
                placeholder="홍길동"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <Label>전화번호 또는 이메일</Label>
              <Input
                placeholder="010-1234-5678 또는 you@example.com"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </div>
            <PrimaryBtn type="submit" $primary disabled={!canSubmit}>
              아이디 찾기
            </PrimaryBtn>
          </Form>
          <Info>가입 정보와 일치할 경우 이메일/문자로 안내됩니다.</Info>
        </Center>
      </Body>
    </Wrap>
  );
}
