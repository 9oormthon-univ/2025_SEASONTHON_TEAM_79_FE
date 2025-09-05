// src/pages/Signup.jsx
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

const SHELL_MAX_WIDTH = 715;
const HEADER_H = 56;
const TOP_GAP = 16;
const BASE_H = 812;

const C = {
  bg: "#FFFFFF",
  text: "#111827",
  border: "#E5E7EB",
  placeholder: "#9CA3AF",
  label: "#6B7280",
  focus: "#6B8CFF",
  primary: "#6B8CFF",
  subtle: "#9CA3AF",
  danger: "#EF4444",
  grayBtn: "#9CA3AF",
  grayBtnText: "#FFFFFF",
};

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  background: ${C.bg};
  overflow-x: hidden;
`;

/* 공통 폭 컨테이너 */
const Shell = styled.div`
  width: 100%;
  max-width: ${SHELL_MAX_WIDTH}px;
  margin: 0 auto;
  box-sizing: border-box;
`;

const Header = styled.header`
  position: fixed; /* 고정 */
  top: env(safe-area-inset-top, 0);
  left: 0;
  right: 0;
  z-index: 100;
  height: ${HEADER_H}px;
  background: ${C.bg};
  border-bottom: 1px solid ${C.border};
  display: flex;
  justify-content: center;
`;

const HeaderInner = styled(Shell)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  position: relative;
  padding: 0 12px;
`;

const BackBtn = styled.button`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  border: 0;
  background: none;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: ${C.text};
`;

const Body = styled.main`
  flex: 1;
  /* 헤더에 가려지지 않도록 상단 여백 확보 */
  margin-top: ${HEADER_H}px;
  padding: ${TOP_GAP}px 20px calc(24px + env(safe-area-inset-bottom, 0));
`;

const BodyInner = styled(Shell)`
  min-height: calc(${BASE_H}px - ${HEADER_H}px - ${TOP_GAP}px);
`;

const FormWrap = styled.form`
  display: flex;
  flex-direction: column;
  min-height: 100%;
`;

const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  /* 헤더와 첫 라벨(이메일) 사이 간격 */
  margin-top: 12px;
`;

const Group = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 700;
  color: ${C.label};
  margin-bottom: 6px;
`;

const Field = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 50px;
  padding: 0 12px;
  border-radius: 12px;
  background: #fff;
  box-shadow: inset 0 0 0 1px ${C.border};
  &:focus-within {
    box-shadow:
      inset 0 0 0 1.5px ${C.focus},
      0 0 0 2px rgba(107, 140, 255, 0.14);
  }
`;

const Input = styled.input`
  flex: 1;
  height: 46px;
  border: 0;
  outline: 0;
  font-size: 14px;
  background: transparent;
  ::placeholder { color: ${C.placeholder}; }
  &:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px #fff inset !important;
    -webkit-text-fill-color: ${C.text} !important;
    caret-color: ${C.text};
  }
`;

const SuffixBtn = styled.button`
  flex: 0 0 auto;
  height: 40px;
  padding: 0 14px;
  border-radius: 10px;
  border: 0;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  background: ${(p) => (p.variant === "primary" ? C.primary : C.grayBtn)};
  color: ${(p) => (p.variant === "primary" ? "#fff" : C.grayBtnText)};
  opacity: ${(p) => (p.disabled ? 0.5 : 1)};
`;

const Hint = styled.p`
  margin: 4px 2px 0;
  font-size: 12px;
  color: ${(p) => (p.variant === "danger" ? C.danger : C.subtle)};
`;

const Spacer = styled.div`
  flex: 1;
`;

const Row = styled.div`
  display: flex;
  justify-content: center;
  gap: 6px;
  color: #4b5563;
  font-size: 14px;
  margin: 20px 0;
`;

const LinkStrong = styled(Link)`
  color: ${C.focus};
  text-decoration: none;
  font-weight: 700;
`;

const SubmitWrap = styled.div`
  padding: 8px 0 16px;
`;

const Submit = styled.button`
  width: 100%;
  height: 58px;
  border: 0;
  border-radius: 20px;
  font-size: 18px;
  font-weight: 800;
  color: #fff;
  background: ${C.primary};
  cursor: pointer;
  opacity: ${(p) => (p.disabled ? 0.5 : 1)};
`;

export default function Signup() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [name, setName] = useState("");
  const [region, setRegion] = useState(""); // 집을 보는 지역 (필수)
  const [sent, setSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [timer, setTimer] = useState(0);

  const emailOk = useMemo(() => /\S+@\S+\.\S+/.test(email), [email]);
  const pwOk = useMemo(() => /[A-Za-z]/.test(pw) && /\d/.test(pw) && pw.length >= 8, [pw]);
  const pwMatch = pw.length > 0 && pw === pw2;
  const nameOk = name.trim().length > 0;
  const regionOk = region.trim().length > 0;

  useEffect(() => {
    if (!timer) return;
    const id = setInterval(() => setTimer((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const onSend = () => {
    if (!emailOk) return;
    setSent(true);
    setVerified(false);
    setTimer(180);
  };

  const onVerify = () => {
    if (!sent) return;
    setVerified(code.trim().length > 0);
  };

  const canSubmit = emailOk && verified && pwOk && pwMatch && nameOk && regionOk;

  const onSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    nav("/welcome");
  };

  const mmss = useMemo(() => {
    const m = String(Math.floor(timer / 60)).padStart(1, "0");
    const s = String(timer % 60).padStart(2, "0");
    return `${m}:${s}`;
  }, [timer]);

  return (
    <Wrap>
      <Header>
        <HeaderInner>
          <BackBtn onClick={() => nav(-1)} aria-label="뒤로">←</BackBtn>
          <Title>회원가입</Title>
        </HeaderInner>
      </Header>

      <Body>
        <BodyInner>
          <FormWrap onSubmit={onSubmit}>
            <Fields>
              {/* 이메일 */}
              <Group>
                <Label htmlFor="email">이메일</Label>
                <Field>
                  <Input
                    id="email"
                    type="email"
                    placeholder="이메일을 입력해주세요."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                  <SuffixBtn type="button" onClick={onSend} disabled={!emailOk || timer > 0}>
                    {timer > 0 ? `재전송 ${mmss}` : "인증번호 전송"}
                  </SuffixBtn>
                </Field>
                {!emailOk && email.length > 0 && (
                  <Hint variant="danger">올바른 이메일 형식이 아니에요.</Hint>
                )}
              </Group>

              {/* 인증번호 */}
              <Group>
                <Label htmlFor="code">인증번호</Label>
                <Field>
                  <Input
                    id="code"
                    placeholder="인증번호를 입력해주세요"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    inputMode="numeric"
                  />
                  <SuffixBtn
                    type="button"
                    onClick={onVerify}
                    variant="primary"
                    disabled={!sent || verified}
                  >
                    {verified ? "완료" : "확인"}
                  </SuffixBtn>
                </Field>
                {!verified && sent && code.length === 0 && (
                  <Hint>메일로 받은 숫자를 입력하세요.</Hint>
                )}
                {verified && <Hint>인증이 완료되었습니다.</Hint>}
              </Group>

              {/* 비밀번호 */}
              <Group>
                <Label htmlFor="pw">비밀번호</Label>
                <Field>
                  <Input
                    id="pw"
                    type="password"
                    placeholder="비밀번호를 입력해주세요"
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                    autoComplete="new-password"
                  />
                </Field>
              </Group>

              {/* 비밀번호 확인 */}
              <Group>
                <Label htmlFor="pw2">비밀번호 (영문, 숫자 조합 8자 이상)</Label>
                <Field>
                  <Input
                    id="pw2"
                    type="password"
                    placeholder="비밀번호를 입력해주세요"
                    value={pw2}
                    onChange={(e) => setPw2(e.target.value)}
                    autoComplete="new-password"
                  />
                </Field>
                {!pwOk && pw.length > 0 && (
                  <Hint variant="danger">영문과 숫자를 포함해 8자 이상이어야 해요.</Hint>
                )}
                {pw.length > 0 && pw2.length > 0 && !pwMatch && (
                  <Hint variant="danger">비밀번호가 일치하지 않습니다.</Hint>
                )}
              </Group>

              {/* 이름 */}
              <Group>
                <Label htmlFor="name">이름</Label>
                <Field>
                  <Input
                    id="name"
                    placeholder="아이디와 비밀번호를 찾을 때 사용됩니다."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                  />
                </Field>
              </Group>

              {/* 집을 보는 지역 (필수) */}
              <Group>
                <Label htmlFor="region">집을 보는 지역</Label>
                <Field>
                  <Input
                    id="region"
                    type="text"
                    placeholder="예: 서울, 강남구"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                  />
                </Field>
                {!regionOk && region.length === 0 && (
                  <Hint variant="danger">집을 보는 지역을 입력해주세요.</Hint>
                )}
              </Group>
            </Fields>

            <Spacer />

            <Row>
              <span>이미 계정이 있으신가요?</span>
              <LinkStrong to="/login">로그인</LinkStrong>
            </Row>

            <SubmitWrap>
              <Submit type="submit" disabled={!canSubmit}>가입</Submit>
            </SubmitWrap>
          </FormWrap>
        </BodyInner>
      </Body>
    </Wrap>
  );
}
