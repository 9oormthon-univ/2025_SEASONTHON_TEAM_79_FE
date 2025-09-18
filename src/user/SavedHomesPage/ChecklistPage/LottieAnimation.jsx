import Lottie from "lottie-react";

import loadingAnimation from "../../../assets/lottie/Audio Wave blue.json";
import successAnimation from "../../../assets/lottie/Success.json";

const LottieAnimation = ({ type, size = 120 }) => {
  const animationData = type === "loading" ? loadingAnimation : successAnimation;

  return (
    <div style={{ width: size, height: size }}>
      <Lottie
        animationData={animationData}
        loop={type === "loading"} // 로딩은 반복, 완료는 한 번만
        autoplay={true}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default LottieAnimation;
