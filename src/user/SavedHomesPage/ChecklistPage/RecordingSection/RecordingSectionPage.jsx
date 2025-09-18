import { useState, useRef, useEffect } from "react";

import { RecordingContainer, SectionTitle, ErrorMessage } from "./styles/RecordingStyles";
import { processAudioComplete, deleteAudioFromDB, getAudioDuration } from "./utils/audioAPI";

import RecordingControlsComponent from "./components/RecordingControls";
import RecordingDisplay from "./components/RecordingDisplay";
import FileUpload from "./components/FileUpload";
import SummarySection from "./components/SummarySection";
import ConfirmModal from "./components/ConfirmModal";
import SavedRecordingsListComponent from "./components/SsavedRecordingsList";

export default function RecordingSection({ 
  recordings = [], 
  onChange, 
  onSummaryStart, 
  onSummaryComplete, 
  checklistId, 
  checklistData, 
  rentType 
}) {
  // 녹음 관련 상태
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingName, setRecordingName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [currentRecording, setCurrentRecording] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  // 파일 업로드 관련 상태
  const [selectedFile, setSelectedFile] = useState(null);

  // 요약 관련 상태
  const [isLoading, setIsLoading] = useState(false);
  const [summaryText, setSummaryText] = useState("");

  // Ref들
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const streamRef = useRef(null);

  // 기타 상태
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // 🔥 더미 데이터 생성 함수 - 사용자가 넣은 사진만 사용
  const generateDummyData = () => {
    const dummyChecklistId = Math.floor(Math.random() * 1000) + 100; // 100-1099 사이 랜덤 ID
    
    const dummySummaries = [
      `이번 매물은 전반적으로 양호한 상태입니다. 채광이 매우 좋아 오전부터 오후까지 자연광이 풍부하게 들어옵니다. 수압도 충분하며, 방음 상태도 만족스러운 편입니다. 

엘리베이터가 있어 이사나 일상생활에 편리하고, 보안 시설도 잘 갖춰져 있습니다. 주변 환경은 조용하고 상가와 대중교통 접근성이 좋습니다.

다만 관리비가 다소 높은 편이고, 주차 공간이 부족할 수 있으니 확인이 필요합니다. 전체적으로 거주하기에 좋은 조건의 매물로 판단됩니다.`,
      
      `방문한 매물의 전반적인 인상은 긍정적입니다. 남향으로 배치되어 하루 종일 밝고 쾌적한 환경을 제공합니다. 화장실과 주방의 수압이 우수하며, 이웃 간 소음 문제도 크지 않을 것으로 보입니다.

건물 시설로는 엘리베이터와 베란다가 있어 실용성이 높습니다. 주변에 편의시설이 잘 갖춰져 있고, 대중교통 이용도 편리합니다.

아쉬운 점은 애완동물 금지 정책과 일부 낡은 시설들입니다. 하지만 가격 대비 만족도가 높은 매물로 추천드립니다.`,
      
      `이 매물은 신축 건물로 모든 시설이 깨끗하고 현대적입니다. 대형 창문으로 인한 우수한 채광과 고층 급수 시스템으로 인한 안정적인 수압이 장점입니다.

방음 시설이 잘 되어 있어 프라이버시가 보장되며, 최신 보안 시스템과 관리사무소 운영으로 안전합니다. 지하철역과 버스정류장이 도보 5분 거리에 있어 교통이 매우 편리합니다.

단점으로는 신축이라 관리비가 높고, 주변 상권이 아직 완전히 형성되지 않았습니다. 하지만 향후 발전 가능성이 높은 지역으로 투자 가치도 있습니다.`
    ];

    const randomSummary = dummySummaries[Math.floor(Math.random() * dummySummaries.length)];

    // 🔥 사용자가 업로드한 사진을 업로드 완료 상태로 변경
    const processedPhotos = checklistData.photos
      .filter(photo => photo && (photo.file || photo.preview)) // 실제 사진이 있는 것만
      .map((photo, index) => ({
        id: index + 1,
        filename: photo.file?.name || `photo_${index + 1}.jpg`,
        contentType: photo.file?.type || "image/jpeg",
        size: photo.file?.size || 2048576,
        caption: photo.caption || `사진 ${index + 1}`,
        createdAt: new Date().toISOString(),
        rawUrl: photo.preview || (photo.file ? URL.createObjectURL(photo.file) : null),
        uploaded: true, // 업로드 완료 상태로 표시
      }));

    return {
      checkId: dummyChecklistId,
      items: {
        voicenote: randomSummary,
      },
      photos: processedPhotos, // 🔥 사용자가 넣은 사진들만 사용
      summary: randomSummary,
      timestamp: new Date().toISOString(),
    };
  };

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

  // 녹음 상태 초기화 함수
  const resetRecordingState = () => {
    if (currentRecording?.audioUrl) {
      URL.revokeObjectURL(currentRecording.audioUrl);
    }

    setCurrentRecording(null);
    setRecordingName("");
    setIsSaved(false);
    setIsEditingName(false);
    setRecordingTime(0);
    setError(null);

    console.log("🔄 녹음 상태가 초기화되었습니다.");
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

        const finalDuration = recorder.finalDuration || recordingTime;

        setCurrentRecording({
          audioBlob,
          audioUrl,
          duration: finalDuration,
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

  // 녹음 정지 시 자동으로 이름 편집 모드 활성화
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      const finalRecordingTime = recordingTime;

      mediaRecorderRef.current.stop();
      setIsRecording(false);
      stopTimer();

      mediaRecorderRef.current.finalDuration = finalRecordingTime;

      setTimeout(() => {
        const recordingNumber = recordings.length + 1;
        const defaultName = `새로운 녹음 ${recordingNumber}`;
        setRecordingName(defaultName);
        setIsEditingName(true);
      }, 100);
    }
  };

  // 녹음 토글
  const handleRecordToggle = async () => {
    if (isRecording) {
      stopRecording();
    } else if (currentRecording) {
      setShowConfirmModal(true);
    } else {
      await startRecording();
    }
  };

  // 모달 확인
  const handleConfirmNewRecording = async () => {
    setShowConfirmModal(false);
    resetRecordingState();
  };

  // 모달 취소
  const handleCancelNewRecording = () => {
    setShowConfirmModal(false);
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

  // 파일 선택 처리
  const handleFileSelect = (file) => {
    if (file.type.startsWith("audio/")) {
      setSelectedFile(file);
      setError(null);
    } else {
      setError("오디오 파일만 선택할 수 있습니다.");
      setSelectedFile(null);
    }
  };

  // 파일 제거
  const handleRemoveFile = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (checklistId) {
        console.log("🗑️ 첨부 파일 삭제 시작:", {
          파일명: selectedFile?.name,
          체크리스트ID: checklistId,
        });

        await deleteAudioFromDB(checklistId);
        console.log("✅ DB에서 음성 파일 삭제 완료");
      }

      setSelectedFile(null);
      setSummaryText("");

      alert("첨부된 음성 파일이 삭제되었습니다.");
    } catch (error) {
      console.error("❌ 파일 삭제 실패:", error);
      setError(`파일 삭제 실패: ${error.message}`);
      alert(`파일 삭제에 실패했습니다.\n${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 🔥 더미 데이터로 요약하기 구현 - 사용자 사진 사용
  const handleSummarize = async () => {
    if (!selectedFile && !currentRecording) {
      setError("요약할 오디오 파일이 없습니다.");
      return;
    }

    if (!checklistData) {
      setError("체크리스트 데이터가 없습니다.");
      return;
    }

    setIsLoading(true);
    setError(null);

    // 요약 시작 알림 - 로딩 애니메이션 시작
    if (onSummaryStart) {
      onSummaryStart();
    }

    // 🔥 사용자가 업로드한 사진 개수 확인
    const userPhotos = checklistData.photos?.filter(photo => photo && (photo.file || photo.preview)) || [];
    const photoCount = userPhotos.length;

    const loadingMessage = photoCount > 0 
      ? `${photoCount}개 사진 업로드 후 GPT 분석을 시작합니다...` 
      : "GPT가 음성을 분석하고 체크리스트를 생성하며 요약을 생성 중입니다...";

    setSummaryText(loadingMessage);

    try {
      console.log("🧪 더미 데이터로 요약 시뮬레이션 시작");
      console.log("📸 사용자 업로드 사진:", userPhotos.length, "개");

      // 🔥 실제 API 호출 대신 더미 데이터 생성 (2초 대기)
      await new Promise(resolve => setTimeout(resolve, 2000));

      const dummyResult = generateDummyData();
      
      console.log("🎭 더미 데이터 생성 완료:", {
        체크리스트ID: dummyResult.checkId,
        요약길이: dummyResult.summary.length,
        사진수: dummyResult.photos.length,
        사진정보: dummyResult.photos.map(p => ({ 
          filename: p.filename, 
          caption: p.caption 
        })),
      });

      setSummaryText(dummyResult.summary);

      // 요약 완료 알림 - 성공 애니메이션 + 결과 표시
      if (onSummaryComplete) {
        onSummaryComplete(
          {
            summary: dummyResult.summary,
            checklistId: dummyResult.checkId,
            photos: dummyResult.photos, // 🔥 사용자가 넣은 사진들
            timestamp: dummyResult.timestamp,
            fullResponse: dummyResult,
          },
          true
        );
      }

      const photoMessage = dummyResult.photos.length > 0 
        ? `\n사진: ${dummyResult.photos.length}장 (${dummyResult.photos.map(p => p.filename).join(", ")})`
        : "\n사진: 없음";

      console.log("🎉 더미 요약 완료:", {
        체크리스트ID: dummyResult.checkId,
        사진수: dummyResult.photos.length,
        요약길이: dummyResult.summary.length,
      });

      // alert(`더미 데이터로 체크리스트 및 요약 완료!\nID: ${dummyResult.checkId}${photoMessage}`);

    } catch (err) {
      console.error("❌ 더미 처리 실패:", err);
      
      setError(`처리 실패: ${err.message}`);
      setSummaryText("");

      // 요약 실패 알림 - 애니메이션 중지
      if (onSummaryComplete) {
        onSummaryComplete(null, false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 녹음 삭제
  const handleDeleteRecording = (recordingId) => {
    if (confirm("이 녹음을 삭제하시겠습니까?")) {
      const updatedRecordings = recordings.filter((r) => r.id !== recordingId);
      onChange(updatedRecordings);
    }
  };

  // 정리 함수
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (currentRecording?.audioUrl) {
        URL.revokeObjectURL(currentRecording.audioUrl);
      }
    };
  }, []);

  return (
    <RecordingContainer>
      <SectionTitle>음성녹음</SectionTitle>

      {/* 녹음 컨트롤 */}
      <RecordingControlsComponent
        isRecording={isRecording}
        currentRecording={currentRecording}
        onRecordToggle={handleRecordToggle}
        disabled={!!error || isLoading}
      >
        <RecordingDisplay
          isRecording={isRecording}
          currentRecording={currentRecording}
          recordingTime={recordingTime}
          recordingName={recordingName}
          isEditingName={isEditingName}
          isSaved={isSaved}
          onNameChange={setRecordingName}
          onNameSave={saveName}
          onStartEditing={startEditingName}
        />
      </RecordingControlsComponent>

      {/* 파일 업로드 */}
      <FileUpload 
        selectedFile={selectedFile} 
        onFileSelect={handleFileSelect} 
        onRemoveFile={handleRemoveFile} 
        isLoading={isLoading} 
      />

      {/* 🔥 더미 데이터 요약하기 섹션 */}
      <SummarySection
        onSummarize={handleSummarize}
        isLoading={isLoading}
        summaryText={summaryText}
        disabled={(!selectedFile && !currentRecording) || isLoading || !checklistData}
      />

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <SavedRecordingsListComponent recordings={recordings} onDelete={handleDeleteRecording} />

      <ConfirmModal 
        isOpen={showConfirmModal} 
        onConfirm={handleConfirmNewRecording} 
        onCancel={handleCancelNewRecording} 
      />
    </RecordingContainer>
  );
}