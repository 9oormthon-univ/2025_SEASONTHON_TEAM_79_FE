// src/apis/auth.js
import axios from "axios";

/**
 * ✅ 인스턴스 분리 전략
 * - httpPublic: 프록시를 그대로 쓰는 공개 엔드포인트 (예: /users/login, /users/register ...)
 * - httpApi   : 인증이 필요한 보호 엔드포인트 (/api/...) — 매 요청 시 Authorization 헤더 자동 세팅
 */

// 공개 엔드포인트용 (/users/..., /email/...)
const httpPublic = axios.create({
  baseURL: "", // Vite dev 서버 프록시를 그대로 사용
  headers: { "Content-Type": "application/json" },
});

// 보호 엔드포인트용 (/api/...)
const httpApi = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// ─────────────────────────────────────────────
// 토큰 유틸
export const getToken = () => (localStorage.getItem("token") || "").trim();
export const setToken = (raw) => {
  if (!raw) return;
  const token = raw.replace(/^Bearer\s+/i, "");
  localStorage.setItem("token", token);
};
export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
};

// 보호 API 요청마다 Authorization 헤더 자동 첨부
httpApi.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─────────────────────────────────────────────
// Auth API

/** 로그인: POST /users/login
 *  - 성공 시 Authorization 헤더의 Bearer 토큰 저장
 *  - 응답 body에 userId가 있다면 같이 저장
 */
export const login = async ({ email, password }) => {
  const res = await httpPublic.post("/users/login", { email, password });

  // Authorization: Bearer <jwt>
  const authHeader = res.headers["authorization"] || res.headers["Authorization"];

  if (authHeader) {
    // "Bearer eyJhbGc..." → "eyJhbGc..." 형태로 변환
    const token = authHeader.replace(/^Bearer\s+/i, "");

    // 1. 메모리에 저장 (ex: axios interceptor에서 활용)
    setToken(token);

    // 2. 로컬스토리지에도 저장
    localStorage.setItem("token", token);
    console.log("토큰 저장 성공");

    // 사용자 ID도 있으면 저장
    if (res.data.userId) {
      localStorage.setItem("userId", res.data.userId);
      console.log("사용자 ID 저장:", res.data.userId);
    }
  } else {
    console.error("⚠️ Authorization 헤더가 없습니다");
    console.log("사용 가능한 헤더들:", Object.keys(res.headers));
  }

  return res.data; // { userId: Long } 예상
};

/** 회원가입: POST /users/register */
export const signup = async ({ email, password, name }) => {
  const res = await httpPublic.post("/users/register", { email, password, name });
  return res.data; // { userId, isEmailVerified? ... }
};

/** 이메일 인증코드 요청: POST /users/email/code/request (body: { email }) */
export const sendEmailCode = async (email) => {
  const res = await httpPublic.post("/users/email/code/request", { email });
  return res.data; // { message } 등
};

/** 이메일 인증코드 검증: POST /email/code/verify (body: { email, code }) */
export const verifyEmailCode = async ({ email, code }) => {
  const res = await httpPublic.post("/email/code/verify", { email, code });
  return res.data; // { isEmailVerified: true } 등
};

/** 회원 탈퇴(보호 자원): DELETE /api/users/delete */
export const deleteUser = async () => {
  const res = await httpApi.delete("/users/delete");
  return res.data; // { id } 등
};

// (선택) 로그아웃 헬퍼
export const logout = () => {
  clearAuth();
};
