// src/components/SummaryProgressModal.jsx
import styled from 'styled-components';
import LottieAnimation from './LottieAnimation';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px 32px;
  text-align: center;
  max-width: 300px;
  width: 90%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
`;

const AnimationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
`;

const StatusText = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
  font-family: Andika, system-ui;
`;

const SubText = styled.p`
  font-size: 14px;
  color: #666;
  margin: 8px 0 0 0;
  line-height: 1.4;
`;

const SummaryProgressModal = ({ isVisible, status }) => {
  if (!isVisible) return null;

  const getContent = () => {
    switch (status) {
      case 'loading':
        return {
          animation: 'loading',
          title: '요약 중...',
          subtitle: 'AI가 음성을 분석하고\n요약을 생성하고 있습니다'
        };
      case 'success':
        return {
          animation: 'success',
          title: '요약완료',
          subtitle: '음성 분석이 완료되었습니다'
        };
      default:
        return {
          animation: 'loading',
          title: '처리 중...',
          subtitle: ''
        };
    }
  };

  const content = getContent();

  return (
    <ModalOverlay>
      <ModalContainer>
        <AnimationContainer>
          <LottieAnimation type={content.animation} size={120} />
        </AnimationContainer>
        <StatusText>{content.title}</StatusText>
        {content.subtitle && (
          <SubText>{content.subtitle.split('\n').map((line, index) => (
            <span key={index}>
              {line}
              {index < content.subtitle.split('\n').length - 1 && <br />}
            </span>
          ))}</SubText>
        )}
      </ModalContainer>
    </ModalOverlay>
  );
};

export default SummaryProgressModal;