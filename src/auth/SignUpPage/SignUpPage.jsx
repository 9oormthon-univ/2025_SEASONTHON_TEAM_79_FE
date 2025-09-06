import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { signup, sendEmailCode, verifyEmailCode } from "../../apis/auth"; // ✅ API 불러오기

// ===== 스타일 상수 =====
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

// ===== 스타일 컴포넌트 =====
const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  background: ${C.bg};
  overflow-x: hidden;
`;
const Shell = styled.div`
  width: 100%;
  max-width: ${SHELL_MAX_WIDTH}px;
  margin: 0 auto;
  box-sizing: border-box;
`;
const Header = styled.header`
  position: fixed;
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
  ::placeholder {
    color: ${C.placeholder};
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
const Spacer = styled.div` flex: 1; `;
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
const SubmitWrap = styled.div` padding: 8px 0 16px; `;
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

// ===== 컴포넌트 =====
export default function Signup() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [pw2, setPw2] = useState("");
  const [name, setName] = useState("");
  const [sent, setSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [timer, setTimer] = useState(0);
  const [err, setErr] = useState("");

  // ✅ 유효성 검사
  const emailOk = useMemo(() => /\S+@\S+\.\S+/.test(email), [email]);
  const pwOk = useMemo(() => /[A-Za-z]/.test(password) && /\d/.test(password) && password.length >= 8, [password]);
  const pwMatch = password.length > 0 && password === pw2;
  const nameOk = name.trim().length > 0;
  const canSubmit = emailOk && verified && pwOk && pwMatch && nameOk;

  // ✅ 타이머
  useEffect(() => {
    if (!timer) return;
    const id = setInterval(() => setTimer((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, [timer]);

  // ✅ 인증코드 전송
  const onSend = async () => {
    if (!emailOk) return;
    try {
      await sendEmailCode(email);
      alert("인증번호가 이메일로 전송되었습니다.");
      setSent(true);
      setVerified(false);
      setTimer(180);
    } catch (e) {
      console.error("인증번호 전송 실패:", e);
      alert(e?.response?.data?.message ?? "인증번호 전송 실패");
    }
  };

  // ✅ 인증코드 검증
  const onVerify = async () => {
    if (!sent) return;
    try {
      await verifyEmailCode({ email, code });
      setVerified(true);
      alert("이메일 인증이 완료되었습니다.");
    } catch (e) {
      console.error("인증번호 검증 실패:", e);
      setVerified(false);
      alert(e?.response?.data?.message ?? "인증번호 검증 실패");
    }
  };

  // ✅ 회원가입
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setErr("");

    try {
      await signup({ email, password, name });
      alert("회원가입이 완료되었습니다!");
      nav("/login");
    } catch (e) {
      console.error("회원가입 실패:", e);
      setErr(e?.response?.data?.message ?? "회원가입 실패");
    }
  };

  // 타이머 표시 mm:ss
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                    placeholder="비밀번호를 다시 입력해주세요"
                    value={pw2}
                    onChange={(e) => setPw2(e.target.value)}
                    autoComplete="new-password"
                  />
                </Field>
                {!pwOk && password.length > 0 && (
                  <Hint variant="danger">영문과 숫자를 포함해 8자 이상이어야 해요.</Hint>
                )}
                {password.length > 0 && pw2.length > 0 && !pwMatch && (
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
            </Fields>

            {/* 에러 메시지 */}
            {err && <p style={{ color: "crimson", marginTop: "10px" }}>{err}</p>}

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
