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
import LeaseCheckedlistPage from "./user/LeaseChecklistPage/LeaseCheckedlistPage";
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<MainPage />} />
        <Route path="/" element={<MainPage />} />

        
        <Route path="/checklist" element={<ChecklistPage />} />
        <Route path="/userrecord" element={<UserRecordPage />} />


        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="find-id" element={<FindId />} />
        <Route path="find-password" element={<FindPassword />} />
        <Route path="map" element={<Map/>}/>
        <Route path="listingpage" element={<ListingPage/>}/>
        <Route path="leasechecklistpage" element={<LeaseChecklistPage/>}/>
        <Route path="leasecheckedlistpage" element={<LeaseCheckedlistPage/>}/>
        <Route path="homedetailpage" element={<HomeDetailPage/>}/>
      </Route>
    </Routes>
  );
}
