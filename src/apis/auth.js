// apis/auth.js (수정본)
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  // withCredentials: true, // 쿠키 인증이면 ON (서버 CORS도 credentials 허용 필요)
});

// 회원가입
export const signup = async ({ email, password, name }) => {
  const res = await api.post("/users/register", { email, password, name });
  return res.data; // { userId: Long, isEmailVerified: Boolean } 예상
};

// 로그인
export const login = async ({ email, password }) => {
  const res = await api.post("/users/login", { email, password });
  return res.data; // { userId: Long } 예상
};

// 이메일 인증번호 전송
export const sendEmailCode = async (email) => {
  const res = await api.post("/users/email/code/request", { email });
  return res.data; // { message: String } 예상
};

// ✅ 이메일 인증 확인 (경로 수정)
export const verifyEmailCode = async ({ email, code }) => {
  const res = await api.post("/email/code/verify", { email, code });
  return res.data; // { isEmailVerified: true } 예상
};

export const deleteUser = async () => {
  const res = await api.delete("/users/delete");
  return res.data; // { id: Long } 예상
};
