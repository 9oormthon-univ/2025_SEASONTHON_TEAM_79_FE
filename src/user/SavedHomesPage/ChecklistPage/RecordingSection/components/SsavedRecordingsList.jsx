import { SavedRecordingsList, SavedRecordingItem, DeleteButton } from "../styles/RecordingStyles";

const SavedRecordingsListComponent = ({ recordings, onDelete }) => {
  if (recordings.length === 0) return null;

  return (
    <SavedRecordingsList>
      <h5 style={{ fontSize: "12px", margin: "8px 0 4px 0", color: "#6c757d" }}>저장된 녹음 ({recordings.length}개)</h5>
      {recordings.map((recording) => (
        <SavedRecordingItem key={recording.id}>
          <span>{recording.name}</span>
          <DeleteButton onClick={() => deleteRecording(recording.id)}>삭제</DeleteButton>
        </SavedRecordingItem>
      ))}
    </SavedRecordingsList>
  );
};

export default SavedRecordingsListComponent;