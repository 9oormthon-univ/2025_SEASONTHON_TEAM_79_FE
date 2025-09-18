import { 
    ModalOverlay, 
    ModalContainer, 
    ModalTitle, 
    ModalButtonContainer, 
    ModalButton 
} from "../styles/RecordingStyles";

// 확인 모달 컴포넌트
const ConfirmModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onCancel}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalTitle>정말 삭제하시겠습니까?</ModalTitle>
        <ModalButtonContainer>
          <ModalButton onClick={onCancel}>취소</ModalButton>
          <ModalButton $primary onClick={onConfirm}>
            확인
          </ModalButton>
        </ModalButtonContainer>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ConfirmModal;