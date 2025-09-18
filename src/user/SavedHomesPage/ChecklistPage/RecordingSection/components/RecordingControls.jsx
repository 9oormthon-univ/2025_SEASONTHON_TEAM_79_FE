import { RecordingControls, RecordButton, RecordingInfoDefault, RecordingInfoCompleted } from "../styles/RecordingStyles";

const RecordingControlsComponent = ({ isRecording, currentRecording, onRecordToggle, disabled, children }) => {
  return (
    <RecordingControls>
      <RecordButton $recording={isRecording} onClick={onRecordToggle} disabled={disabled}>
        {isRecording ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="10" height="10" rx="2" fill="#FF3B30" />
          </svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="13" cy="13" r="13" fill="white" />
            <path
              d="M13.0003 20.3327V18.3327M13.0003 18.3327C11.5858 18.3327 10.2293 17.7708 9.22909 16.7706C8.2289 15.7704 7.66699 14.4138 7.66699 12.9993M13.0003 18.3327C14.4148 18.3327 15.7714 17.7708 16.7716 16.7706C17.7718 15.7704 18.3337 14.4138 18.3337 12.9993M13.0003 16.3327C11.167 16.3327 9.66699 14.8847 9.66699 13.114V8.88468C9.66699 7.11402 11.167 5.66602 13.0003 5.66602C14.8337 5.66602 16.3337 7.11402 16.3337 8.88468V13.114C16.3337 14.8847 14.8337 16.3327 13.0003 16.3327Z"
              stroke="#464A4D"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </RecordButton>

      {currentRecording ? <RecordingInfoCompleted>{children}</RecordingInfoCompleted> : <RecordingInfoDefault>{children}</RecordingInfoDefault>}
    </RecordingControls>
  );
};

export default RecordingControlsComponent;
