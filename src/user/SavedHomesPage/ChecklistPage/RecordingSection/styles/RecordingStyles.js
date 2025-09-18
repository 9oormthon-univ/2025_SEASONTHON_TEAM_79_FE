import styled, {keyframes} from "styled-components";

export const RecordingContainer = styled.section`
  margin: 24px 0;
`;

export const SectionTitle = styled.p`
  font-family: Andika;
  font-size: 16px;
  font-weight: 700;
  color: #000000;
  line-height: 24px;
  margin: 0 0 4px 0;
`;

// 녹음 초기 상태
export const RecordingInfoDefault = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
`;

// 녹음 완료 후
export const RecordingInfoCompleted = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  position: relative;
`;

// 오른쪽 고정 시간 (녹음 완료 후)
export const RecordingTimeRight = styled.div`
  font-family: Andika;
  font-size: 12px;
  font-weight: 700;
  line-height: 20px;
  color: #464a4d;
  position: absolute;
  right: 0;
  white-space: nowrap;
`;

export const RecordingControls = styled.div`
  background: #F4F7FF;
  border-radius: 10px;
  border: 1px solid #e8eef2;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const RecordButton = styled.button`
  position: relative;
  width: 24px;
  height: 24px;
  background: #ffffff;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  padding: 0;
  transition: all 0.25s ease;
  flex-shrink: 0;

  ${(props) =>
    props.$recording &&
    `
  `}

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    &::after {
      background: #9ca3af;
      border-color: #6b7280;
    }
    cursor: not-allowed;
    animation: none;
  }
`;

export const RecordingTime = styled.div`
  font-family: Andika;
  font-size: 12px;
  font-weight: 700;
  line-height: 20px;
  color: #464a4d;
`;

export const RecordingNameArea = styled.div`
  display: flex;
  align-items: center;
`;

export const RecordingNameInput = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #333333;
  font-family: Andika;
  font-size: 12px;
  font-weight: 700;
  line-height: 20px;
  text-align: right;
  outline: none;
  width: 120px;
  padding: 2px 6px;
  border-radius: 4px;

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }

  &:focus {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

export const RecordingNameText = styled.span`
  font-family: Andika;
  font-size: 12px;
  font-weight: 700;
  line-height: 20px;
  cursor: ${(props) => (props.$clickable ? "pointer" : "default")};
  padding: 2px 6px;
  border-radius: 4px;
  transition: background-color 0.2s;
  min-height: 20px;
  display: flex;
  align-items: center;
  color: #464a4d;

  ${(props) =>
    props.$clickable &&
    `
    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  `}
`;

// 파일 선택 버튼
export const FileSelectButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: 1px solid #e8eef2;
  border-radius: 8px;
  padding: 12px 16px;
  margin: 16px 0;
  cursor: pointer;
  width: 100%;
  font-size: 14px;
  font-weight: 400;
  color: #757b80;

  svg {
    width: 20px;
    height: 20px;
    color: #6b7280;
  }
`;

export const SelectedFileName = styled.div`
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 8px;
  padding: 8px 12px;
  margin: 8px 0;
  font-size: 12px;
  color: #0369a1;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const RemoveFileButton = styled.button`
  background: none;
  border: none;
  color: #dc2626;
  cursor: pointer;
  font-size: 14px;
  padding: 0;
  margin-left: 8px;

  &:hover {
    color: #991b1b;
  }
`;

// 요약하기 버튼
export const SummaryButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: linear-gradient(141deg, #3299ff 30.82%, #004fff 90.49%);
  border: none;
  border-radius: 16px;
  padding: 18px 16px;
  margin: 8px 0;
  cursor: pointer;
  width: 100%;
  font-size: 16px;
  color: #fff;
  font-weight: 700;
  transition: all 0.2s ease;

  &:disabled {
    opacity: 0.7;
  }
`;

// 로딩 애니메이션
export const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid #e5e7eb;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

// 요약 결과 표시
export const SummaryResult = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
  font-size: 14px;
  color: #374151;
  line-height: 1.5;
  max-height: 200px;
  overflow-y: auto;

  &:empty::before {
    content: "500자까지 요약내용이 기록됩니다.";
    color: #9ca3af;
    font-style: italic;
  }
`;

export const ErrorMessage = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  margin-top: 8px;
`;

// 저장된 녹음 목록
export const SavedRecordingsList = styled.div`
  margin-top: 16px;
  max-height: 200px;
  overflow-y: auto;
`;

export const SavedRecordingItem = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 8px 12px;
  margin-bottom: 4px;
  font-size: 12px;
  color: #495057;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const DeleteButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 10px;
  cursor: pointer;

  &:hover {
    background: #c82333;
  }
`;

// 모달 스타일 컴포넌트들
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ModalContainer = styled.div`
  background: white;
  border-radius: 16px;
  margin: 16px;
  width: 310px;
  padding-top: 48px;
  height: 164px;
`;

export const ModalTitle = styled.h3`
  font-size: 14px;
  font-weight: 400;
  color: #17191a;
  text-align: center;
  margin: 6px 0 38px 0;
  line-height: 180%;
`;

export const ModalButtonContainer = styled.div`
  display: flex;
  width:100%;
`;

export const ModalButton = styled.button`
  flex: 1;
  padding: 12px 16px;
  border: none;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 155.498px;
  height: 48px;

  ${(props) =>
    props.$primary
      ? `
    background: #3b82f6;
    color: white;
    
    &:active {
      background: #1d4ed8;
    }

    border-radius: 0 0 16px 0;
  `
      : `
    background: #f3f4f6;
    color: #6b7280;

    border-radius: 0 0 0 16px;
    
    &:hover {
      background: #e5e7eb;
    }
    
    &:active {
      background: #d1d5db;
    }
  `}
`;