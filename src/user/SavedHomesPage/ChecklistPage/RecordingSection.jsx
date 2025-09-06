import { useState, useRef, useEffect } from "react";
import styled, { keyframes } from "styled-components";

const RecordingContainer = styled.section`
  margin: 24px 0;
`;

const SectionTitle = styled.p`
  font-family: Andika;
  font-size: 16px;
  font-weight: 700;
  color: #000000;
  line-height: 24px;
  margin: 0 0 4px 0;
`;

const RecordingControls = styled.div`
  background: #F2F8FC;
  border-radius: 10px;
  border: 1px solid #E8EEF2;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const RecordButton = styled.button`
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

const RecordingInfo = styled.div`
  flex: 1;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const RecordingTime = styled.div`
  font-family: Andika;
  font-size: 12px;
  font-weight: 700;
  line-height: 20px;
  color: #464A4D;
`;

const RecordingNameArea = styled.div`
  display: flex;
  align-items: center;
`;

const RecordingNameInput = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
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

const RecordingNameText = styled.span`
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
  color: #464A4D;

  ${(props) =>
    props.$clickable &&
    `
    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  `}
`;

// 파일 선택 버튼
const FileSelectButton = styled.button`
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
  font-size: 16px;
  color: #757b80;
  transition: all 0.2s ease;

  &:hover {
    background: #f8f9fa;
    border-color: #d1d5db;
  }

  svg {
    width: 20px;
    height: 20px;
    color: #6b7280;
  }
`;

const SelectedFileName = styled.div`
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

const RemoveFileButton = styled.button`
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
const SummaryButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: ${(props) => (props.$loading ? "#f3f4f6" : "#ffffff")};
  border: 1px solid ${(props) => (props.$loading ? "#d1d5db" : "#3b82f6")};
  border-radius: 8px;
  padding: 12px 16px;
  margin: 8px 0;
  cursor: ${(props) => (props.$loading ? "not-allowed" : "pointer")};
  width: 100%;
  font-size: 14px;
  color: ${(props) => (props.$loading ? "#6b7280" : "#3b82f6")};
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #f0f9ff;
    border-color: #2563eb;
  }

  &:disabled {
    opacity: 0.7;
  }
`;

// 로딩 애니메이션
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid #e5e7eb;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

// 요약 결과 표시
const SummaryResult = styled.div`
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

const ErrorMessage = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  margin-top: 8px;
`;

// 저장된 녹음 목록
const SavedRecordingsList = styled.div`
  margin-top: 16px;
  max-height: 200px;
  overflow-y: auto;
`;

const SavedRecordingItem = styled.div`
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

const DeleteButton = styled.button`
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

export default function RecordingSection({ recordings = [], onChange, onSummaryChange, checklistId }) {
  // 상태 관리
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState(null);
  const [recordingName, setRecordingName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [currentRecording, setCurrentRecording] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  // 새로 추가된 상태
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [summaryText, setSummaryText] = useState("");

  // Ref들
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const streamRef = useRef(null);
  const nameInputRef = useRef(null);
  const fileInputRef = useRef(null);

  // 정리 함수
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // 이름 편집 모드에서 포커스
  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isEditingName]);

  // 타이머 관리
  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // 파일 선택 핸들러
  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // 오디오 파일인지 확인
      if (file.type.startsWith("audio/")) {
        setSelectedFile(file);
        setError(null);
      } else {
        setError("오디오 파일만 선택할 수 있습니다.");
        setSelectedFile(null);
      }
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 요약하기 API 호출
  const handleSummarize = async () => {
    if (!selectedFile && !currentRecording) {
      setError("요약할 오디오 파일이 없습니다.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();

      // 선택된 파일이 있으면 파일을, 없으면 녹음된 파일을 사용
      if (selectedFile) {
        formData.append("audio", selectedFile);
      } else if (currentRecording) {
        formData.append("audio", currentRecording.audioBlob, "recording.webm");
      }

      // 체크리스트 ID가 있으면 추가
      if (checklistId) {
        formData.append("checklistId", checklistId);
      }

      // 백엔드 API 호출
      const response = await fetch("/api/summarize-audio", {
        method: "POST",
        body: formData,
        headers: {
          // Content-Type은 FormData 사용시 자동 설정됨
          Authorization: `Bearer ${localStorage.getItem("token")}`, // 필요한 경우
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "요약 생성에 실패했습니다.");
      }

      const result = await response.json();

      // 요약 결과를 상태에 저장
      setSummaryText(result.summary);

      // 부모 컴포넌트에 요약 결과 전달
      if (onSummaryChange) {
        onSummaryChange(result.summary);
      }

      console.log("요약 완료:", result.summary);
    } catch (err) {
      console.error("요약 생성 실패:", err);
      setError(err.message || "요약 생성 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 녹음 시작
  const startRecording = async () => {
    try {
      setError(null);
      setIsSaved(false);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
        },
      });

      streamRef.current = stream;

      let options = {};
      if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
        options.mimeType = "audio/webm;codecs=opus";
      } else if (MediaRecorder.isTypeSupported("audio/webm")) {
        options.mimeType = "audio/webm";
      }

      const recorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const mimeType = recorder.mimeType || "audio/webm";
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        const audioUrl = URL.createObjectURL(audioBlob);

        setCurrentRecording({
          audioBlob,
          audioUrl,
          duration: recordingTime,
          createdAt: new Date().toISOString(),
        });

        const recordingNumber = recordings.length + 1;
        const defaultName = `새로운 녹음 ${recordingNumber}`;
        setRecordingName(defaultName);
        setIsEditingName(true);

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };

      recorder.start(1000);
      setIsRecording(true);
      setRecordingTime(0);
      startTimer();
    } catch (err) {
      console.error("녹음 시작 실패:", err);
      let errorMessage = "녹음을 시작할 수 없습니다.";

      if (err.name === "NotAllowedError") {
        errorMessage = "마이크 접근 권한이 필요합니다.";
      } else if (err.name === "NotFoundError") {
        errorMessage = "마이크를 찾을 수 없습니다.";
      }

      setError(errorMessage);
    }
  };

  // 녹음 정지
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      stopTimer();
    }
  };

  // 녹음 토글
  const handleRecordToggle = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      setCurrentRecording(null);
      setRecordingName("");
      setIsSaved(false);
      setRecordingTime(0);
      await startRecording();
    }
  };

  // 이름 편집 시작
  const startEditingName = () => {
    if (currentRecording && !isSaved) {
      setIsEditingName(true);
    }
  };

  // 이름 저장
  const saveName = async () => {
    if (!currentRecording || !recordingName.trim()) {
      alert("녹음 이름을 입력해주세요.");
      return;
    }

    try {
      const newRecording = {
        id: `recording_${Date.now()}`,
        name: recordingName.trim(),
        duration: currentRecording.duration,
        size: currentRecording.audioBlob.size,
        audioUrl: currentRecording.audioUrl,
        createdAt: currentRecording.createdAt,
        uploadedAt: new Date().toISOString(),
      };

      const updatedRecordings = [...recordings, newRecording];
      onChange(updatedRecordings);

      setIsSaved(true);
      setIsEditingName(false);

      console.log(`"${recordingName.trim()}" 녹음이 저장되었습니다!`);
    } catch (error) {
      console.error("저장 실패:", error);
      alert("녹음 저장에 실패했습니다.");
    }
  };

  // 키보드 이벤트 처리
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      saveName();
    } else if (e.key === "Escape") {
      setIsEditingName(false);
    }
  };

  // 이름 입력 완료
  const handleNameBlur = () => {
    if (recordingName.trim()) {
      saveName();
    } else {
      setIsEditingName(false);
    }
  };

  // 녹음 삭제
  const deleteRecording = (recordingId) => {
    if (confirm("이 녹음을 삭제하시겠습니까?")) {
      const updatedRecordings = recordings.filter((r) => r.id !== recordingId);
      onChange(updatedRecordings);
    }
  };

  // 시간 포맷팅
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // 표시할 이름 결정
  const getDisplayName = () => {
    if (isRecording) {
      return "녹음 중...";
    } else if (currentRecording && isSaved) {
      return recordingName;
    } else if (currentRecording && !isSaved) {
      return recordingName || "새로운 녹음";
    } else {
      return "";
    }
  };

  return (
    <RecordingContainer>
      <SectionTitle>음성녹음</SectionTitle>

      {/* 녹음 컨트롤 */}
      <RecordingControls>
        <RecordButton $recording={isRecording} onClick={handleRecordToggle} disabled={!!error}>
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="13" cy="13" r="13" fill="white" />
            <path
              d="M13.0003 20.3327V18.3327M13.0003 18.3327C11.5858 18.3327 10.2293 17.7708 9.22909 16.7706C8.2289 15.7704 7.66699 14.4138 7.66699 12.9993M13.0003 18.3327C14.4148 18.3327 15.7714 17.7708 16.7716 16.7706C17.7718 15.7704 18.3337 14.4138 18.3337 12.9993M13.0003 16.3327C11.167 16.3327 9.66699 14.8847 9.66699 13.114V8.88468C9.66699 7.11402 11.167 5.66602 13.0003 5.66602C14.8337 5.66602 16.3337 7.11402 16.3337 8.88468V13.114C16.3337 14.8847 14.8337 16.3327 13.0003 16.3327Z"
              stroke="#464A4D"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </RecordButton>
        <RecordingInfo>
          <RecordingTime $recording={isRecording}>{formatTime(recordingTime)}</RecordingTime>

          <RecordingNameArea>
            {isEditingName ? (
              <RecordingNameInput
                ref={nameInputRef}
                type="text"
                value={recordingName}
                onChange={(e) => setRecordingName(e.target.value)}
                onKeyDown={handleKeyPress}
                onBlur={handleNameBlur}
                placeholder="녹음 이름 입력"
                maxLength={30}
              />
            ) : (
              <RecordingNameText $clickable={currentRecording && !isSaved} onClick={startEditingName}>
                {getDisplayName()}
              </RecordingNameText>
            )}
          </RecordingNameArea>
        </RecordingInfo>
      </RecordingControls>

      {/* 파일 선택 버튼 */}
      <FileSelectButton onClick={handleFileSelect} disabled={isLoading}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_601_3669)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M21 6.75V21C21 21.7956 20.6839 22.5587 20.1213 23.1213C19.5587 23.6839 18.7956 24 18 24V22.5C18.3978 22.5 18.7794 22.342 19.0607 22.0607C19.342 21.7794 19.5 21.3978 19.5 21V6.75H16.5C15.9033 6.75 15.331 6.51295 14.909 6.09099C14.4871 5.66903 14.25 5.09674 14.25 4.5V1.5H6C5.60218 1.5 5.22064 1.65804 4.93934 1.93934C4.65804 2.22064 4.5 2.60218 4.5 3V16.5H3V3C3 2.20435 3.31607 1.44129 3.87868 0.87868C4.44129 0.316071 5.20435 0 6 0L14.25 0L21 6.75ZM13.6335 21.255H12.969V20.3415H13.602C13.7694 20.344 13.935 20.3065 14.085 20.232C14.22 20.1636 14.334 20.0599 14.415 19.932C14.4948 19.8046 14.5345 19.6562 14.529 19.506C14.5326 19.3944 14.5106 19.2834 14.4649 19.1815C14.4191 19.0796 14.3508 18.9895 14.265 18.918C14.0795 18.7635 13.8432 18.6833 13.602 18.693C13.4733 18.6902 13.3452 18.711 13.224 18.7545C13.1178 18.7919 13.0196 18.8489 12.9345 18.9225C12.8568 18.9872 12.7929 19.0669 12.7468 19.1568C12.7006 19.2468 12.6732 19.3451 12.666 19.446H11.565C11.574 19.211 11.625 18.9925 11.718 18.7905C11.812 18.5885 11.947 18.4125 12.123 18.2625C12.299 18.1105 12.513 17.992 12.765 17.907C13.02 17.822 13.3115 17.778 13.6395 17.775C14.0575 17.772 14.419 17.838 14.724 17.973C15.028 18.108 15.264 18.294 15.432 18.531C15.6032 18.7656 15.6942 19.0491 15.6915 19.3395C15.7055 19.5912 15.6427 19.8412 15.5115 20.0565C15.4096 20.2236 15.2747 20.3682 15.1151 20.4814C14.9554 20.5946 14.7744 20.6741 14.583 20.715V20.7765C14.799 20.8005 15.0071 20.8712 15.1931 20.9836C15.379 21.096 15.5383 21.2475 15.66 21.4275C15.8104 21.6597 15.8858 21.9325 15.876 22.209C15.879 22.494 15.8205 22.7475 15.7005 22.9695C15.5818 23.194 15.4129 23.388 15.207 23.5365C14.997 23.6885 14.754 23.8055 14.478 23.8875C14.205 23.9675 13.9135 24.0075 13.6035 24.0075C13.1525 24.0075 12.7675 23.931 12.4485 23.778C12.1541 23.6425 11.9017 23.43 11.718 23.163C11.5537 22.9111 11.4614 22.6191 11.451 22.3185H12.54C12.5517 22.4608 12.6072 22.5961 12.699 22.7055C12.8021 22.8215 12.9297 22.9132 13.0725 22.974C13.2434 23.0399 13.4249 23.074 13.608 23.0745C13.806 23.0792 14.0027 23.0403 14.184 22.9605C14.3382 22.8898 14.4692 22.7769 14.562 22.635C14.6532 22.4924 14.6992 22.3257 14.694 22.1565C14.6968 21.9912 14.6508 21.8287 14.5617 21.6894C14.4726 21.5501 14.3443 21.4402 14.193 21.3735C14.0192 21.2897 13.8278 21.2491 13.635 21.255H13.6335ZM1.059 23.8875V19.8975H1.116L2.544 23.1375H3.318L4.737 19.8975H4.794V23.8875H5.8665V17.889H4.6665L2.9565 21.783H2.9175L1.2075 17.889H0V23.889L1.059 23.8875ZM9.246 17.889H6.846V23.889H8.034V21.876H9.2385C9.6685 21.876 10.0345 21.7895 10.3365 21.6165C10.6405 21.4395 10.872 21.202 11.031 20.904C11.1957 20.5912 11.2788 20.2419 11.2725 19.8885C11.2725 19.5145 11.1935 19.176 11.0355 18.873C10.8772 18.5745 10.6381 18.3265 10.3455 18.1575C10.0105 17.9691 9.63017 17.8762 9.246 17.889ZM10.0635 19.8885C10.0688 20.0866 10.025 20.283 9.936 20.46C9.85653 20.6131 9.7326 20.7386 9.5805 20.82C9.40576 20.906 9.2127 20.9483 9.018 20.943H8.028V18.834H9.018C9.346 18.834 9.6025 18.925 9.7875 19.107C9.9715 19.288 10.0635 19.5485 10.0635 19.8885Z"
              fill="#464A4D"
            />
          </g>
          <defs>
            <clipPath id="clip0_601_3669">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
        파일 선택
      </FileSelectButton>

      {/* 선택된 파일 표시 */}
      {selectedFile && (
        <SelectedFileName>
          <span>{selectedFile.name}</span>
          <RemoveFileButton onClick={removeSelectedFile}>×</RemoveFileButton>
        </SelectedFileName>
      )}

      {/* 숨겨진 파일 input */}
      <input ref={fileInputRef} type="file" accept="audio/*" style={{ display: "none" }} onChange={handleFileChange} />

      {/* 요약하기 버튼 */}
      <SummaryButton onClick={handleSummarize} disabled={isLoading || (!selectedFile && !currentRecording)} $loading={isLoading}>
        {isLoading ? (
          <>
            <LoadingSpinner />
            요약 중...
          </>
        ) : (
          <>
            <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M14.9663 4.86602C14.6997 4.59935 14.2997 4.59935 14.033 4.86602L9.83301 9.06602L6.96634 6.19935C6.83301 6.06602 6.69967 5.99935 6.49967 5.99935C6.29967 5.99935 6.16634 6.06602 6.03301 6.19935L2.03301 10.1993C1.89967 10.3327 1.83301 10.466 1.83301 10.666C1.83301 11.066 2.09967 11.3327 2.49967 11.3327C2.69967 11.3327 2.83301 11.266 2.96634 11.1327L6.49967 7.59935L9.36634 10.466C9.43301 10.5327 9.49967 10.5993 9.56634 10.5993C9.63301 10.666 9.76634 10.666 9.83301 10.666C9.96634 10.666 10.1663 10.5993 10.233 10.466H10.2997L14.9663 5.79935C15.233 5.53268 15.233 5.13268 14.9663 4.86602Z"
                fill="#464A4D"
              />
            </svg>
            요약하기
          </>
        )}
      </SummaryButton>

      {/* 요약 결과 표시 */}
      {summaryText && <SummaryResult>{summaryText}</SummaryResult>}

      {/* 에러 메시지 */}
      {error && <ErrorMessage>{error}</ErrorMessage>}

      {/* 저장된 녹음 목록 */}
      {recordings.length > 0 && (
        <SavedRecordingsList>
          <h5 style={{ fontSize: "12px", margin: "8px 0 4px 0", color: "#6c757d" }}>저장된 녹음 ({recordings.length}개)</h5>
          {recordings.map((recording) => (
            <SavedRecordingItem key={recording.id}>
              <span>{recording.name}</span>
              <DeleteButton onClick={() => deleteRecording(recording.id)}>삭제</DeleteButton>
            </SavedRecordingItem>
          ))}
        </SavedRecordingsList>
      )}
    </RecordingContainer>
  );
}
