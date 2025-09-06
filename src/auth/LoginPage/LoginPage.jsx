// src/pages/Login.jsx
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../../assets/Logo.png";
import { login } from "../../apis/auth";

const SHELL_MAX_WIDTH = 512;



const COLORS = {
  bg: "#FFFFFF",
  border: "#9CA3AF",
  icon: "#9CA3AF",
  placeholder: "#9CA3AF",
  text: "#111827",
  link: "#111827",
  focus: "#6B8CFF",
};

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  background: ${COLORS.bg};
  overflow-x: hidden;
  align-items: center;
`;

const Header = styled.header`
  position: fixed;
  top: env(safe-area-inset-top, 0);
  left: 50%;
  transform: translateX(-50%);
  width: min(100%, ${SHELL_MAX_WIDTH-30}px);
  z-index: 100;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid ${COLORS.border};
  background: ${COLORS.bg};
`;

const BackBtn = styled.button`
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: none;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
`;

const Body = styled.main`
  flex: 1;
  width: 100%;
  max-width: ${SHELL_MAX_WIDTH}px;
  padding: calc(56px + env(safe-area-inset-top, 0)) 16px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
`;

const LogoArea = styled.div`
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 120px;
    height: auto;
    object-fit: contain;
  }
  margin-top:10%;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: ${COLORS.text};
  margin-bottom: 4px;
  display: block;
`;

const Field = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 48px;
  border: 1px solid ${COLORS.border};
  border-radius: 10px;
  padding: 0 12px 0 10px;
  background: #fff;
  &:focus-within {
    border-color: ${COLORS.focus};
    box-shadow: 0 0 0 2px rgba(107, 140, 255, 0.2);
  }
`;

const PrefixIcon = styled.span`
  width: 22px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${COLORS.icon};
  flex: 0 0 22px;
  svg {
    width: 22px;
    height: 22px;
  }
`;

const Input = styled.input`
  flex: 1;
  height: 100%;
  border: none;
  outline: none;
  font-size: 14px;
  background: transparent;
  appearance: none;
  ::placeholder {
    color: #9ca3af;
  }
  &:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px #fff inset !important;
    -webkit-text-fill-color: #111827 !important;
    caret-color: #111827;
  }
`;

const SuffixBtn = styled.button`
  border: none;
  background: none;
  padding: 0;
  margin-left: 6px;
  cursor: pointer;
  color: ${COLORS.icon};
  display: inline-flex;
  align-items: center;
  svg {
    width: 22px;
    height: 22px;
  }
`;

const Row = styled.div`
  width: 100%;
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Check = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #374151;
  input {
    width: 18px;
    height: 18px;
    accent-color: #3b82f6;
  }
`;

const InlineLink = styled(Link)`
  font-size: 14px;
  color: ${COLORS.link};
  text-decoration: none;
`;

const PrimaryBtn = styled.button`
  width: 100%;
  height: 54px;
  margin-top: 12px;
  border-radius: 12px;
  border: none;
  font-weight: 800;
  font-size: 18px;
  letter-spacing: -0.2px;
  color: #fff;
  background: #6b8cff;
  cursor: pointer;
  opacity: ${(p) => (p.disabled ? 0.5 : 1)};
`;

const Or = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 14px;
  color: ${COLORS.border};
  font-size: 14px;
  margin: 20px 0 12px;
  &::before,
  &::after {
    content: "";
    height: 1px;
    background: ${COLORS.border};
    display: block;
  }
`;

const KakaoBtn = styled.button`
  width: 100%;
  height: 56px;
  border-radius: 12px;
  border: none;
  background: #fee500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
`;

const Bubble = styled.span`
  width: 22px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  svg {
    width: 22px;
    height: 22px;
    transform: scaleX(-1);
    transform-origin: 50% 50%;
  }
`;

const SignupRow = styled.div`
  margin-top: 24px;
  color: #4b5563;
  font-size: 15px;
  a {
    color: #3b82f6;
    text-decoration: none;
    margin-left: 6px;
    font-weight: 600;
  }
`;

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [keep, setKeep] = useState(true);
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

     if (!email || !password) {
    setErr("이메일과 비밀번호를 입력해주세요.");
    return;
  }
  if (!email.includes("@")) {
    setErr("올바른 이메일 주소를 입력해주세요.");
    return;
  }
  if (password.length < 6) {
    setErr("비밀번호는 최소 6자 이상이어야 합니다.");
    return;
  }
    try {
      await login({ email, password, keep, method: "post" }); // 서버가 PATCH면 "patch"
      nav("/", { replace: true });
    } catch (e) {
      setErr(e?.response?.data?.message ?? "로그인 실패");
    }
  };

  return (
    <Wrap>
      <Header>
        <BackBtn onClick={() => nav(-1)} aria-label="이전으로">
          ←
        </BackBtn>
        <Title>로그인</Title>
      </Header>

      <Body>
        <LogoArea>
          <img src={logo} alt="로고" />
        </LogoArea>

        <Form onSubmit={onSubmit}>
          <div>
            <Label htmlFor="id">아이디</Label>
            <Field>
              <PrefixIcon>
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z"
                    fill="currentColor"
                  />
                </svg>
              </PrefixIcon>
              <Input
                id="id"
                placeholder="이메일을 입력해주세요."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </Field>
          </div>

          <div>
            <Label htmlFor="pw">비밀번호</Label>
            <Field>
              <PrefixIcon>
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M17 9h-1V7a4 4 0 1 0-8 0v2H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2Zm-6 0V7a3 3 0 1 1 6 0v2Z"
                    fill="currentColor"
                  />
                </svg>
              </PrefixIcon>
              <Input
                id="pw"
                placeholder="비밀번호를 입력해주세요."
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <SuffixBtn
                type="button"
                onClick={() => setShowPw((v) => !v)}
                aria-label="비밀번호 표시"
              >
                {showPw ? (
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 5C6 5 2 11 2 11s4 6 10 6 10-6 10-6-4-6-10-6Zm0 9a3 3 0 1 1 3-3 3.003 3.003 0 0 1-3 3Z"
                      fill="currentColor"
                    />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M3 3l18 18"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M10.58 6.14A10.8 10.8 0 0 1 12 6c6 0 10 6 10 6a18.4 18.4 0 0 1-4.11 4.74M6.53 6.53A18.4 18.4 0 0 0 2 12s4 6 10 6a10.8 10.8 0 0 0 2.08-.2"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                )}
              </SuffixBtn>
            </Field>
          </div>
        </Form>

        <Row>
          <Check>
            <input
              type="checkbox"
              checked={keep}
              onChange={(e) => setKeep(e.target.checked)}
            />
            로그인 상태 유지
          </Check>
          <InlineLink to="/find-password">비밀번호 찾기</InlineLink>
        </Row>

        <PrimaryBtn type="submit"  onClick={onSubmit}>
          로그인
        </PrimaryBtn>
        {err && <p style={{color:"crimson"}}>{err}</p>}

        <Or>or</Or>

        <KakaoBtn type="button">
          <Bubble>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3c-5 0-9 3.357-9 7.5C3 13.642 7 17 12 17c.69 0 1.36-.06 2-.175L21 21l-1.8-5.1C20.39 14.515 21 13.056 21 10.5 21 6.357 17 3 12 3Z" />
            </svg>
          </Bubble>
          카카오로 3초만에 시작하기
        </KakaoBtn>

        <SignupRow>
          계정이 없으신가요?
          <Link to="/signup">계정 만들기</Link>
        </SignupRow>
      </Body>
    </Wrap>
  );
}
