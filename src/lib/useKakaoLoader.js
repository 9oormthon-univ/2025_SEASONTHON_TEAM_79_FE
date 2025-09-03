// src/lib/useKakaoLoader.js
import { useEffect, useState } from "react";

const KAKAO_KEY = import.meta.env.VITE_KAKAO_MAP_KEY;
const SDK_URL = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_KEY}&autoload=false&libraries=services,clusterer,drawing`;

export function useKakaoLoader() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // 이미 로드됨
    if (window.kakao?.maps) {
      setLoaded(true);
      return;
    }

    if (!KAKAO_KEY) {
      console.error("[Kakao] .env에 VITE_KAKAO_MAP_KEY가 없습니다.");
      return;
    }

    // 전역 Promise로 중복 로드 방지
    if (!window.__kakaoLoadPromise) {
      window.__kakaoLoadPromise = new Promise((resolve, reject) => {
        // 중복 스크립트 방지
        const existing = document.getElementById("kakao-sdk");
        if (existing) {
          existing.addEventListener("load", () => window.kakao.maps.load(resolve));
          existing.addEventListener("error", reject);
          return;
        }

        const script = document.createElement("script");
        script.id = "kakao-sdk";
        script.src = SDK_URL;
        script.async = true;
        script.defer = true;
        script.onload = () => window.kakao.maps.load(resolve);
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    window.__kakaoLoadPromise
      .then(() => setLoaded(true))
      .catch((e) => console.error("[Kakao] SDK 로드 실패:", e));
  }, []);

  return loaded;
}
