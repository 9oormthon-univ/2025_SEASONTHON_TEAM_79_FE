// apis/auth.js
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080", // 서버 주소
    //withCredentials: true,      // 쿠키 인증 필요 시 
});

// 회원가입 API (POST /users/register)
export const signup = async({email, password, name}) => {
    const res = await api.post("/users/register", {
        email,
        password,
        name,
    });
    return res.data;
};

// 로그인 API (POST /user/login)

export const login = async({email, password}) => {
    const res = await api.post("/users/login", {
        email,
        password,
    });
    return res.data;
};

// 이메일 인증번호 전송
export const sendEmailCode = async (email) => {
  const res = await api.post("/users/email/code/request", { email });
  return res.data;
};

// 이메일 인증번호 확인
export const verifyEmailCode = async ({ email, code }) => {
  const res = await api.post("/users/verify-code", { email, code });
  return res.data;
};