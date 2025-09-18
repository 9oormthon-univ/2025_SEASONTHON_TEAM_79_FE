import styled from "styled-components";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import StatusBar from "../../mainpage/StatusBar";
import ChecklistHeader from "../SavedHomesPage/ChecklistPage/ChecklistHeader";

const UserMainPageContainer = styled.div`
  width: 100%;
`;

const UserInfoContainer = styled.div`
  display: flex;
  gap: 24px;
  align-items: center;
  height: 96px;
  padding-left: 16px;
`;

const TextContainer = styled.div`
  display: flex;
  margin: 8px 0;
  height: 160px;
  flex-direction: column;
`;

const TextWrapper = styled.button`
  display: flex;
  border: none;
  border-top: 1px solid #e8eef2;
  border-bottom: 1px solid #e8eef2;
  background: none;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  width: 100%;
  height: 48px;
  cursor: pointer;
`;

const UserPageText = styled.span`
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
`;

const TextArea = styled.div`
  height: 44px;
  p {
    font-family: Andika;
    font-size: 20px;
    font-weight: 700;
    color: #000000;
    margin: 0;
    line-height: 1.4;
    letter-spacing: 0px;
  }

  p .highlight {
    font-weight: 700;
    color: #3299ff;
    font-family: Andika;
    font-size: 20px;
  }

  span {
    font-weight: 400;
    font-size: 14px;
    color: #757b80;
  }

  ${(props) =>
    props.centered &&
    `
    display: flex;
    align-items: center;
  `}
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  font-size: 18px;
  color: #666;
`;

const ErrorMessage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 50vh;
  gap: 16px;

  button {
    padding: 8px 16px;
    background: #3299ff;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
  }
`;

export default function UserMainPage() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState({
    userId: null,
    name: "",
    region: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleBack = () => navigate(-1);

  const handleChange = () => navigate("/changeregion");

  const ArrowIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M9.06066 5L15.591 11.5303L9.06066 18.0607L8 17L13.4697 11.5303L8 6.06066L9.06066 5Z" fill="#464A4D" />
    </svg>
  );

  const MainLogoIcon = (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" fill="#F4F7FF" />
    </svg>
  );

  // 유저 프로필 정보 가져오는 API 함수
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL;

        const response = await fetch(`${API_BASE_URL}/users/profiles`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ 유저 프로필 조회 성공:", data);

        setUserProfile({
          userId: data.userId,
          name: data.name,
          region: data.region,
        });
      } catch (err) {
        console.error("❌ 유저 프로필 조회 실패:", err);
        setError("나의 정보를 불러오는 중 오류가 발생했습니다");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // 로그아웃 함수
  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      console.log("로그아웃 진행");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("selectedRegion");
      navigate("/login");
    }
  };

  // 회원탈퇴 함수
  // 회원탈퇴 함수 수정 (상세한 디버깅 포함)
  const handleDeleteProfile = async (e) => {
    e.preventDefault();

    if (!window.confirm("탈퇴 시 계정 및 모든 정보가 영구적으로 삭제되며, 복구할 수 없습니다.\n정말로 탈퇴하시겠습니까?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL;

      // 🔥 토큰 및 환경 변수 확인
      console.log("🔍 디버깅 정보:");
      console.log("- API_BASE_URL:", API_BASE_URL);
      console.log("- 토큰 존재:", !!token);
      console.log("- 토큰 길이:", token?.length);
      console.log("- 토큰 앞부분:", token?.substring(0, 20) + "...");

      if (!token) {
        throw new Error("로그인 토큰이 없습니다. 다시 로그인해주세요.");
      }

      if (!API_BASE_URL) {
        throw new Error("API URL이 설정되지 않았습니다.");
      }

      console.log("🗑️ 회원탈퇴 요청 시작");

      const response = await fetch(`${API_BASE_URL}/users/profiles`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("📡 탈퇴 응답 상태:", response.status);
      console.log("📡 응답 헤더:", {
        contentType: response.headers.get("content-type"),
        contentLength: response.headers.get("content-length"),
      });

      // 🔥 403 에러 상세 처리
      if (response.status === 403) {
        console.error("❌ 403 Forbidden - 권한 없음");

        try {
          const responseText = await response.text();
          console.log("📄 403 응답 내용:", responseText);

          if (responseText && responseText.trim() !== "") {
            const errorData = JSON.parse(responseText);
            throw new Error(errorData.message || "권한이 없습니다. 다시 로그인해주세요.");
          } else {
            throw new Error("권한이 없습니다. 토큰이 만료되었거나 유효하지 않습니다.");
          }
        } catch (parseError) {
          console.error("403 응답 파싱 실패:", parseError);
          throw new Error("권한이 없습니다. 다시 로그인해주세요.");
        }
      }

      // 🔥 기타 에러 상태 처리
      if (!response.ok) {
        let errorMessage = `서버 오류 (${response.status})`;

        try {
          const responseText = await response.text();
          console.log("📄 에러 응답 내용:", responseText);

          if (responseText && responseText.trim() !== "") {
            const errorData = JSON.parse(responseText);
            errorMessage = errorData.message || errorMessage;
          }
        } catch (parseError) {
          console.error("에러 응답 파싱 실패:", parseError);
        }

        throw new Error(errorMessage);
      }

      // 🔥 성공 응답 처리
      try {
        const responseText = await response.text();
        console.log("📄 성공 응답 내용:", responseText);

        if (responseText && responseText.trim() !== "") {
          try {
            const result = JSON.parse(responseText);
            console.log("✅ 회원탈퇴 응답 데이터:", result);
          } catch (parseError) {
            console.log("✅ 회원탈퇴 완료 (JSON 파싱 불가)");
          }
        } else {
          console.log("✅ 회원탈퇴 완료 (응답 본문 없음)");
        }
      } catch (responseError) {
        console.log("✅ 회원탈퇴 완료 (응답 처리 실패)");
      }

      console.log("✅ 회원탈퇴 처리 완료");

      // 모든 로컬 데이터 삭제
      localStorage.clear();

      alert("그동안 이용해주셔서 감사합니다.");
      navigate("/login");
    } catch (err) {
      console.error("❌ 회원탈퇴 실패:", err);

      // 🔥 403 에러인 경우 로그인 페이지로 이동
      if (err.message.includes("권한") || err.message.includes("403")) {
        alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
        localStorage.clear();
        navigate("/login");
      } else {
        alert(err.message || "탈퇴 중 오류가 발생했습니다");
      }
    }
  };

  // 지역변경에서 돌아왔을 때 사용자 정보 새로고침
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // 페이지가 다시 보일 때 (지역변경에서 돌아왔을 때)
        const savedRegion = localStorage.getItem("selectedRegion");
        if (savedRegion) {
          try {
            const regionData = JSON.parse(savedRegion);
            setUserProfile((prev) => ({
              ...prev,
              region: regionData.fullAddress,
            }));
          } catch (error) {
            console.error("저장된 지역 정보 파싱 실패:", error);
          }
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // 재시도 함수
  const handleRetry = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <UserMainPageContainer>
        <StatusBar />
        <ChecklistHeader title="마이페이지" onBack={handleBack} />
        <LoadingSpinner>나의 정보를 불러오는 중입니다...</LoadingSpinner>
      </UserMainPageContainer>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <UserMainPageContainer>
        <StatusBar />
        <ChecklistHeader title="마이페이지" onBack={handleBack} />
        <ErrorMessage>
          <div>{error}</div>
          <button onClick={handleRetry}>다시 시도</button>
        </ErrorMessage>
      </UserMainPageContainer>
    );
  }

  return (
    <UserMainPageContainer>
      <StatusBar />
      <ChecklistHeader title="마이페이지" onBack={handleBack} />
      <UserInfoContainer>
        {MainLogoIcon}
        <TextArea>
          <p>
            <span className="highlight">{userProfile.name}</span>님 반갑습니다
          </p>
          <span>현재 {userProfile.region}의 매물을 보고 있어요!</span>
        </TextArea>
      </UserInfoContainer>

      <TextContainer>
        <TextWrapper onClick={handleDeleteProfile}>
          <UserPageText>회원탈퇴</UserPageText>
          {ArrowIcon}
        </TextWrapper>
        <TextWrapper onClick={handleLogout}>
          <UserPageText>로그아웃</UserPageText>
          {ArrowIcon}
        </TextWrapper>
        <TextWrapper onClick={handleChange}>
          <UserPageText>지역변경</UserPageText>
          {ArrowIcon}
        </TextWrapper>
      </TextContainer>
    </UserMainPageContainer>
  );
}
