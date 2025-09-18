// src/user/SavedHomesPage/ChecklistPage/components/PhotoSection.jsx
import { useState } from "react";
import styled from "styled-components";

const PhotoSectionContainer = styled.section`
  width: 100%;
  margin: 20px 0;
  position: relative;

`;

const SectionTitle = styled.p`
  font-size: 14px;
  font-weight: 700;
  color: #464a4d;
  margin: 0 0 8px 0;
  font-family: Andika;
  line-height: 20px;
  height: 20px;
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 17px;
  width: 100%;
  height: 138px;
  justify-content: center;
`;

const PhotoSlot = styled.div`
  aspect-ratio: 108/138;
  border: 2px solid #e8eef2;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  width: 100%;
  min-width: 108px;
  height: 138px;
  background: #ffffff;
  transition: all 0.2s ease;

  &:hover {
    border-color: #3b82f6;
    background: #f8fafc;
  }

  ${(props) =>
    props.$hasImage &&
    `
    border-color: transparent;
    &:hover {
      border-color: #3b82f6;
    }
  `}
`;

const PhotoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: -8px;
  right: -8px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #ef4444;
  color: white;
  border: 2px solid white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 2;

  &:hover {
    background: #dc2626;
  }
`;

// 선택 메뉴 팝업
const SelectionOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 10000;
  padding: 0 16px 32px 16px;
`;

const SelectionMenu = styled.div`
  background: white;
  border-radius: 16px 16px 0 0;
  width: 100%;
  max-width: 400px;
  padding: 24px 16px 16px;
  animation: slideUp 0.3s ease-out;

  @keyframes slideUp {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const MenuTitle = styled.h3`
  text-align: center;
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
`;

const MenuButton = styled.button`
  width: 100%;
  padding: 16px;
  margin-bottom: 8px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
    border-color: #d1d5db;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const CancelButton = styled.button`
  width: 100%;
  padding: 16px;
  background: transparent;
  border: none;
  font-size: 16px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  margin-top: 8px;

  &:hover {
    color: #374151;
  }
`;

export default function PhotoSection({ photos = [], onChange }) {
  const [showSelection, setShowSelection] = useState(false);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // photos가 배열이 아닌 경우 처리
  const safePhotos = Array.isArray(photos) ? photos : [];

  // 사진 슬롯 클릭 핸들러
  const handlePhotoSlotClick = (index) => {
    if (photos[index]) {
      // 이미 사진이 있으면 바로 교체할지 물어보기
      if (confirm("사진을 교체하시겠습니까?")) {
        setSelectedSlotIndex(index);
        setShowSelection(true);
      }
    } else {
      // 빈 슬롯이면 선택 메뉴 표시
      setSelectedSlotIndex(index);
      setShowSelection(true);
    }
  };

  // 사진 보관함에서 선택
  const handleGallerySelect = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = false;

    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        handleFileSelect(file);
      }
    };

    input.click();
    setShowSelection(false);
  };

  // 카메라로 촬영
  const handleCameraCapture = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.capture = "environment"; // 후면 카메라 우선
    input.multiple = false;

    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        handleFileSelect(file);
      }
    };

    input.click();
    setShowSelection(false);
  };

  // 🔥 파일 처리 - 이제 실제 파일 객체와 미리보기를 함께 저장
  const handleFileSelect = async (file) => {
    // 파일 크기 체크 (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("파일 크기가 10MB를 초과합니다. 다른 사진을 선택해주세요.");
      return;
    }

    // 이미지 파일 체크
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드할 수 있습니다.");
      return;
    }

    setIsUploading(true);

    try {
      // 이미지 미리보기 URL 생성
      const previewUrl = URL.createObjectURL(file);

      // 🔥 사진 데이터 구조 - 파일 객체와 미리보기를 함께 저장
      const photoData = {
        file: file, // 실제 파일 객체 (업로드용)
        preview: previewUrl, // 미리보기 URL
        caption: "", // 캡션 (나중에 추가 가능)
        // 업로드 후에는 서버 정보가 추가됨
        uploaded: false,
        id: null,
        filename: null,
        contentType: null,
        size: null,
        createdAt: null,
        rawUrl: null,
      };

      // 사진 배열 업데이트
      const newPhotos = [...safePhotos];

      // 배열 길이 확보
      while (newPhotos.length <= selectedSlotIndex) {
        newPhotos.push(null);
      }

      // 이전 데이터가 있다면 미리보기 URL 해제
      if (newPhotos[selectedSlotIndex]?.preview) {
        URL.revokeObjectURL(newPhotos[selectedSlotIndex].preview);
      }

      newPhotos[selectedSlotIndex] = photoData;
      onChange(newPhotos);

      console.log("선택된 파일:", {
        name: file.name,
        size: file.size,
        type: file.type,
        index: selectedSlotIndex,
      });
    } catch (error) {
      console.error("파일 선택 실패:", error);
      alert("파일 선택에 실패했습니다.");
    } finally {
      setIsUploading(false);
    }
  };

  // 사진 삭제
  const handlePhotoDelete = (index, e) => {
    e.stopPropagation();

    if (confirm("이 사진을 삭제하시겠습니까?")) {
      // 메모리 해제
      if (safePhotos[index]) {
        URL.revokeObjectURL(safePhotos[index].preview);
      }

      const newPhotos = [...safePhotos];
      newPhotos[index] = null;

      onChange(newPhotos);
    }
  };

  // 오버레이 클릭으로 메뉴 닫기
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowSelection(false);
    }
  };

  return (
    <PhotoSectionContainer>
      <SectionTitle>
        사진 추가 (최대 3장, 각 10MB 제한)
        {isUploading && " - 업로드 중..."}
      </SectionTitle>

      <PhotoGrid>
        {[0, 1, 2].map((index) => (
          <PhotoSlot key={index} $hasImage={!!photos[index]} onClick={() => handlePhotoSlotClick(index)}>
            {photos[index] ? (
              <>
                <PhotoImage src={photos[index]?.rawUrl || photos[index]?.preview} alt={`사진 ${index + 1}`} />
                <DeleteButton onClick={(e) => handlePhotoDelete(index, e)}>×</DeleteButton>
              </>
            ) : (
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_454_7624)">
                  <path
                    d="M30.6663 25.3333C30.6663 26.0406 30.3854 26.7189 29.8853 27.219C29.3852 27.719 28.7069 28 27.9997 28H3.99967C3.29243 28 2.61415 27.719 2.11406 27.219C1.61396 26.7189 1.33301 26.0406 1.33301 25.3333V10.6667C1.33301 9.95942 1.61396 9.28115 2.11406 8.78105C2.61415 8.28095 3.29243 8 3.99967 8H9.33301L11.9997 4H19.9997L22.6663 8H27.9997C28.7069 8 29.3852 8.28095 29.8853 8.78105C30.3854 9.28115 30.6663 9.95942 30.6663 10.6667V25.3333Z"
                    stroke="#464A4D"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15.9997 22.6667C18.9452 22.6667 21.333 20.2789 21.333 17.3333C21.333 14.3878 18.9452 12 15.9997 12C13.0542 12 10.6663 14.3878 10.6663 17.3333C10.6663 20.2789 13.0542 22.6667 15.9997 22.6667Z"
                    stroke="#464A4D"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_454_7624">
                    <rect width="32" height="32" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            )}
          </PhotoSlot>
        ))}
      </PhotoGrid>

      {/* 선택 메뉴 팝업 */}
      {showSelection && (
        <SelectionOverlay onClick={handleOverlayClick}>
          <SelectionMenu>
            <MenuTitle>사진 선택</MenuTitle>

            <MenuButton onClick={handleGallerySelect}>사진 보관함에서 선택</MenuButton>

            <MenuButton onClick={handleCameraCapture}>카메라로 촬영</MenuButton>

            <CancelButton onClick={() => setShowSelection(false)}>취소</CancelButton>
          </SelectionMenu>
        </SelectionOverlay>
      )}
    </PhotoSectionContainer>
  );
}
