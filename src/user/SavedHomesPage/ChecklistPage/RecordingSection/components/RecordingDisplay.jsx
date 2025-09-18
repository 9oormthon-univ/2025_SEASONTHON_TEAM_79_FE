import { useRef, useEffect } from "react";
import { RecordingTime, RecordingTimeRight, RecordingNameArea, RecordingNameInput, RecordingNameText } from "../styles/RecordingStyles";

const RecordingDisplay = ({
  isRecording,
  currentRecording,
  recordingTime,
  recordingName,
  isEditingName,
  isSaved,
  onNameChange,
  onNameSave,
  onStartEditing,
}) => {
  const nameInputRef = useRef(null);

  // 시간 포맷팅
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  //표시할 시간 결정 함수
  const getDisplayTime = () => {
    if (isRecording) {
      return formatTime(recordingTime);
    } else if (currentRecording) {
      return formatTime(currentRecording.duration);
    } else {
      return "";
    }
  };

  // 표시할 이름 결정
  const getRecordingDisplayName = () => {
    // 초기 상태 (녹음 전)
    if (!isRecording && !currentRecording) {
      return <RecordingNameText>음성녹음하기</RecordingNameText>;
    }

    // 녹음 중
    if (isRecording) {
      return null; // 아무것도 표시하지 않음
    }

    // 녹음 완료 후 (이름 편집 모드)
    if (currentRecording) {
      if (isEditingName && !isSaved) {
        return (
          <RecordingNameInput
            ref={nameInputRef}
            type="text"
            value={recordingName}
            onChange={(e) => onNameChange(e.target.value)}
            onBlur={onNameSave}
            placeholder="녹음 이름 입력"
            maxLength={30}
            autoFocus // 자동 포커스
          />
        );
      } else {
        return (
          <RecordingNameText $clickable={!isSaved} onClick={!isSaved ? onStartEditing : undefined}>
            {recordingName || "새로운 녹음"}
          </RecordingNameText>
        );
      }
    }

    return null;
  };

  // 이름 편집 모드에서 포커스
  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isEditingName]);
  // 녹음 완료 후일 때는 시간을 오른쪽에 표시
  if (currentRecording) {
    return (
      <>
        <RecordingNameArea>{getRecordingDisplayName()}</RecordingNameArea>
        <RecordingTimeRight>{getDisplayTime()}</RecordingTimeRight>
      </>
    );
  }

  // 초기 상태 및 녹음 중
  return (
    <>
      {!isRecording && !currentRecording && <RecordingNameArea>{getRecordingDisplayName()}</RecordingNameArea>}
      {isRecording && <RecordingTime>{getDisplayTime()}</RecordingTime>}
    </>
  );
};

export default RecordingDisplay;