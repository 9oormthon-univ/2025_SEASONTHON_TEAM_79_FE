import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layout/Layout";
import Login from "./auth/LoginPage/LoginPage";
import FindId from "./auth/FindIdPage/FindIdPage";
import Signup from "./auth/SignUpPage/SignUpPage";
import FindPassword from "./auth/FindPasswordPage/FindPasswordPage";
import Map from "./Map/MapBrowseExact";
import ListingPage from "./Map/ListingExact";
import MainPage from "./mainpage/MainPage";
import ChecklistPage from "./user/SavedHomesPage/ChecklistPage/ChecklistPage";
import LeaseChecklistPage from "./user/LeaseChecklistPage/LeaseChecklistPage";
import HomeDetailPage from "./user/HomeDetailPage/HomeDetailPage";
import UserRecordPage from "./user/HomeDetailPage/UserRecordPage";
import MyHomeDetailPage from "./user/HomeDetailPage/MyHomeDetailPage";
import MyLeaseChecklistPage from "./user/LeaseChecklistPage/MyLeaseChecklistPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<MainPage />} />
        <Route path="/" element={<MainPage />} />

        <Route path="checklist" element={<ChecklistPage />} />
        <Route path="userrecord" element={<UserRecordPage />} />

        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="find-id" element={<FindId />} />
        <Route path="find-password" element={<FindPassword />} />

        <Route path="map" element={<Map />} />
        <Route path="listingpage" element={<ListingPage />} />

        {/* 체크리스트 */}
        <Route path="leasechecklistpage" element={<LeaseChecklistPage />} />
        <Route path="leasechecklistpage/:id" element={<LeaseChecklistPage />} />
        <Route path="myleasechecklistpage/:id" element={<MyLeaseChecklistPage />} />

        {/* 상세 페이지 (공용 / 사용자 버전) */}
        <Route path="homedetailpage/:id" element={<HomeDetailPage />} />
        <Route path="homedetailpage" element={<Navigate to="/" replace />} />

        {/* ✅ MyHomeDetailPage: userId를 URL로도 받을 수 있게 추가 */}
        <Route path="myhomedetailpage/:id" element={<MyHomeDetailPage />} />
        <Route path="myhomedetailpage" element={<Navigate to="/" replace />} />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
