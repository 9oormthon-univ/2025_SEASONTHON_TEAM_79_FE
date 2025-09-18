// apis/http.js
import axios from "axios";

// 보호 API: /api/**  (토큰 헤더 자동 첨부)
export const api = axios.create({ baseURL: "/api" });

// 인증/회원가입: /users/**  (절대 토큰 안 붙임)
export const auth = axios.create({ baseURL: "/users" });

// --- 토큰 인터셉터 (보호 API에만) ---
api.interceptors.request.use((config) => {
  const raw = (localStorage.getItem("token") || "").trim();
  if (raw) {
    // 이미 Bearer 가 있으면 그대로, 없으면 붙임
    config.headers.Authorization = /^Bearer\s/i.test(raw) ? raw : `Bearer ${raw}`;
  }
  return config;
});
