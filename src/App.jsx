import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layout/Layout";
import Login from "./auth/LoginPage/LoginPage";
import FindId from "./auth/FindIdPage/FindIdPage";
import Signup from "./auth/SignUpPage/SignUpPage";
import FindPassword from "./auth/FindPasswordPage/FindPasswordPage";
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/login" replace />} />

        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="find-id" element={<FindId />} />
        <Route path="find-password" element={<FindPassword />} />
      </Route>
    </Routes>
  );
}
