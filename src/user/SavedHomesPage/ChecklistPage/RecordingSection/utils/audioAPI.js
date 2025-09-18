//녹음 파일 백엔드 API 호출 함수

// 오디오 길이 계산 함수
export const getAudioDuration = (audioFile) => {
  return new Promise((resolve, reject) => {
    const audio = new Audio();

    audio.addEventListener("loadedmetadata", () => {
      resolve(Math.round(audio.duration) || 1); // 최소 1초
    });

    audio.addEventListener("error", () => {
      resolve(1); // 에러 시 기본값 1초
    });

    audio.src = URL.createObjectURL(audioFile);
  });
};

// 음성 파일 삭제 API 호출 함수
export const deleteAudioFromDB = async (checkId) => {
  try {
    const BACK_API_URL = import.meta.env.VITE_BACKEND_API_URL;
    const token = localStorage.getItem("token");

    console.log("🗑️ 음성 파일 삭제 요청:", {
      체크리스트ID: checkId,
      URL: `${BACK_API_URL}/api/checklists/${checkId}/audio`,
    });

    const response = await fetch(`${BACK_API_URL}/api/checklists/${checkId}/audio`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("📨 삭제 응답:", {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
    });

    if (!response.ok) {
      let errorBody;
      try {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          errorBody = await response.json();
        } else {
          errorBody = await response.text();
        }
      } catch (parseError) {
        errorBody = "응답 파싱 실패";
      }

      console.error("❌ 삭제 실패:", {
        status: response.status,
        body: errorBody,
      });

      throw new Error(`음성 파일 삭제 실패 (${response.status}): ${JSON.stringify(errorBody)}`);
    }

    // 성공 응답 처리
    let result = {};
    try {
      const text = await response.text();
      if (text) {
        result = JSON.parse(text);
      }
    } catch (e) {
      // 응답이 없거나 JSON이 아닐 수 있음 (204 No Content 등)
      result = { message: "삭제 완료" };
    }

    console.log("✅ 음성 파일 삭제 성공:", result);
    return result;
  } catch (error) {
    console.error("❌ 음성 파일 삭제 API 오류:", error);
    throw error;
  }
};

export const uploadSinglePhoto = async (photoFile, caption = "", checkId) => {
  try {
    const BACK_API_URL = import.meta.env.VITE_BACKEND_API_URL;
    const token = localStorage.getItem("token");

    if (!checkId) {
      throw new Error("체크리스트 ID가 필요합니다.");
    }

    const formData = new FormData();
    formData.append("file", photoFile);
    formData.append("caption", caption);

    console.log("📸 사진 업로드 시작:", {
      체크리스트ID: checkId,
      파일명: photoFile.name,
      크기: `${(photoFile.size / 1024 / 1024).toFixed(2)}MB`,
      타입: photoFile.type,
      캡션: caption,
    });

    const response = await fetch(`${BACK_API_URL}/api/checklists/${checkId}/photos`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`사진 업로드 실패 (${response.status}): ${errorText}`);
    }

    const result = await response.json();
    console.log("✅ 사진 업로드 성공:", result);

    return {
      id: result.id || 0,
      filename: result.filename || photoFile.name,
      contentType: result.contentType || photoFile.type,
      size: result.size || photoFile.size,
      caption: result.caption || caption,
      createdAt: result.createdAt || new Date().toISOString(),
      rawUrl: result.rawUrl || result.url || "",
    };
  } catch (error) {
    console.error("❌ 사진 업로드 실패:", error);
    throw error;
  }
};

// 여러 사진 업로드 (기존 업로드되지 않은 것만)
export const uploadPhotos = async (photos, checkId) => {
  try {
    const uploadedPhotos = [];
    if (!checkId) {
      throw new Error("체크리스트 ID가 필요합니다.");
    }

    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      if (!photo || photo.uploaded) {
        // 이미 업로드된 사진이면 기존 정보 사용
        if (photo && photo.uploaded) {
          uploadedPhotos.push({
            id: photo.id,
            filename: photo.filename,
            contentType: photo.contentType,
            size: photo.size,
            caption: photo.caption,
            createdAt: photo.createdAt,
            rawUrl: photo.rawUrl,
          });
        }
        continue;
      }

      // 아직 업로드되지 않은 사진만 업로드
      if (photo.file) {
        console.log(`📸 ${i + 1}번째 사진 업로드:`, photo.file.name);

        // 🔥 checkId 파라미터 추가!
        const uploadResult = await uploadSinglePhoto(photo.file, photo.caption, checkId);
        uploadedPhotos.push(uploadResult);

        console.log(`✅ ${i + 1}번째 사진 업로드 완료`);
      }
    }

    console.log("✅ 모든 사진 업로드 완료:", uploadedPhotos);
    return uploadedPhotos;
  } catch (error) {
    console.error("❌ 사진들 업로드 실패:", error);
    throw error;
  }
};

// audioAPI.js
export const saveChecklistOnly = async (checklistData, rentType) => {
  try {
    const BACK_API_URL = import.meta.env.VITE_BACKEND_API_URL;
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    // 🔥 체크리스트 데이터 구성
    const payload = {
      checkId: 0,
      userId: parseInt(userId) || 0,
      avgScore: 0,
      items: {
        name: checklistData.name || "",
        address: checklistData.address || "",
        monthly: rentType === "월세" ? parseInt(checklistData.monthlyRent) || 0 : 0,
        deposit: parseInt(checklistData.deposit) || 0,
        maintenanceFee: parseInt(checklistData.maintenanceFee) || 0,
        floorAreaSqm: parseFloat(checklistData.area) || 0,
        mining: checklistData.ratings.lighting || 0,
        water: checklistData.ratings.waterPressure || 0,
        cleanliness: checklistData.ratings.soundproofing || 0,
        options: checklistData.ratings.structure || 0,
        security: checklistData.ratings.security || 0,
        noise: checklistData.ratings.noise || 0,
        surroundings: checklistData.ratings.environment || 0,
        recycling: checklistData.ratings.waste || 0,
        elevator: checklistData.toggles.elevator || false,
        veranda: checklistData.toggles.veranda || false,
        pet: checklistData.toggles.pets || false,
        memo: checklistData.memo || "",
        voicenote: "",
      },
      photos: [],
    };

    // 🔥 1단계: 체크리스트 저장 (빈 오디오 파일 포함)
    console.log("1️⃣ 체크리스트 저장 시작");

    const formData = new FormData();
    const emptyFile = new File([""], "empty.webm", { type: "audio/webm" });
    formData.append("file", emptyFile);

    const payloadString = JSON.stringify(payload);
    const encodedPayload = encodeURIComponent(payloadString);
    const durationSec = 0;

    const url = `${BACK_API_URL}/api/checklists?payload=${encodedPayload}&durationSec=${durationSec}`;

    const response = await fetch(url, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      let errorBody;
      try {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          errorBody = await response.json();
        } else {
          errorBody = await response.text();
        }
      } catch (parseError) {
        errorBody = "응답 파싱 실패";
      }
      throw new Error(`체크리스트 저장 실패 (${response.status}): ${JSON.stringify(errorBody)}`);
    }

    const result = await response.json();
    const createdChecklistId = result.checkId || result.id;

    if (!createdChecklistId) {
      throw new Error("체크리스트 ID를 받지 못했습니다.");
    }

    console.log("✅ 1단계 완료 - 체크리스트 저장, ID:", createdChecklistId);

    // 🔥 2단계: 사진 업로드 (체크리스트 ID 사용)
    let uploadedPhotos = [];
    if (checklistData.photos && checklistData.photos.length > 0) {
      console.log("2️⃣ 사진 업로드 시작");

      const photosToUpload = checklistData.photos.filter((photo) => photo && !photo.uploaded);

      if (photosToUpload.length > 0) {
        console.log(`📸 ${photosToUpload.length}개 사진 업로드 진행`);

        // 🔥 생성된 체크리스트 ID 사용
        uploadedPhotos = await uploadPhotos(checklistData.photos, createdChecklistId);

        console.log("✅ 2단계 완료 - 모든 사진 업로드");
        result.photos = uploadedPhotos;
      } else {
        console.log("ℹ️ 업로드할 새 사진이 없음");
      }
    } else {
      console.log("ℹ️ 사진이 없음");
    }

    console.log("🎉 전체 완료:", {
      체크리스트ID: createdChecklistId,
      업로드된사진수: uploadedPhotos.length,
    });

    return {
      ...result,
      checkId: createdChecklistId,
      photos: uploadedPhotos,
    };
  } catch (error) {
    console.error("❌ 체크리스트 저장 전체 과정 실패:", error);
    throw error;
  }
};

export const updateChecklistAPI = async (checklistData, rentType, checklistId) => {
  try {
    const BACK_API_URL = import.meta.env.VITE_BACKEND_API_URL;
    const exampletoken = import.meta.env.VITE_TEST_TOKEN;
    const userId = localStorage.getItem("userId");

    const requestBody = {
      userId: parseInt(userId) || 0,
      items: {
        name: checklistData.name || "",
        address: checklistData.address || "",
        detailAddress: checklistData.detailAddress || "",
        monthly: rentType === "월세" ? parseInt(checklistData.monthlyRent) || 0 : 0,
        deposit: parseInt(checklistData.deposit) || 0,
        maintenanceFee: parseInt(checklistData.maintenanceFee) || 0,
        floorAreaSqm: parseFloat(checklistData.area) || 0,
        rentType: rentType === "월세" ? "WOLSE" : "JEONSE",
        roomType: checklistData.roomStructure || "ONE_ROOM",
        mining: checklistData.ratings.lighting || 0,
        water: checklistData.ratings.waterPressure || 0,
        cleanliness: checklistData.ratings.soundproofing || 0,
        options: checklistData.ratings.structure || 0,
        security: checklistData.ratings.security || 0,
        noise: checklistData.ratings.noise || 0,
        surroundings: checklistData.ratings.environment || 0,
        recycling: checklistData.ratings.waste || 0,
        elevator: checklistData.toggles.elevator || false,
        veranda: checklistData.toggles.veranda || false,
        pet: checklistData.toggles.pets || false,
        memo: checklistData.memo || "",
      },
    };

    console.log("🔄 체크리스트 수정 요청:", {
      checklistId,
      requestBody
    });

    const response = await fetch(`${BACK_API_URL}/api/checklists/${checklistId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${exampletoken}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ 체크리스트 수정 실패:", errorText);
      throw new Error(`체크리스트 수정 실패 (${response.status}): ${errorText}`);
    }

    const result = await response.json();
    console.log("✅ 체크리스트 수정 성공:", result);

    return result;
  } catch (error) {
    console.error("❌ 체크리스트 수정 API 오류:", error);
    throw error;
  }
};

// 🔥 요약하기 함수 수정 (POST로 새 체크리스트 생성)
export const processAudioComplete = async (audioFile, checklistData, rentType, durationSec) => {
  try {
    const BACK_API_URL = import.meta.env.VITE_BACKEND_API_URL;
    const exampletoken = import.meta.env.VITE_TEST_TOKEN;
    const userId = localStorage.getItem("userId");

    // 🔥 새 체크리스트 생성용 페이로드
    const payload = {
      checkId: 0, // 새 생성이므로 0
      userId: parseInt(userId) || 0,
      avgScore: 0,
      items: {
        name: checklistData.name || "",
        address: checklistData.address || "",
        detailAddress: checklistData.detailAddress || "",
        monthly: rentType === "월세" ? parseInt(checklistData.monthlyRent) || 0 : 0,
        deposit: parseInt(checklistData.deposit) || 0,
        maintenanceFee: parseInt(checklistData.maintenanceFee) || 0,
        floorAreaSqm: parseFloat(checklistData.area) || 0,
        rentType: rentType === "월세" ? "WOLSE" : "JEONSE",
        roomType: checklistData.roomStructure || "ONE_ROOM",
        mining: checklistData.ratings.lighting || 0,
        water: checklistData.ratings.waterPressure || 0,
        cleanliness: checklistData.ratings.soundproofing || 0,
        options: checklistData.ratings.structure || 0,
        security: checklistData.ratings.security || 0,
        noise: checklistData.ratings.noise || 0,
        surroundings: checklistData.ratings.environment || 0,
        recycling: checklistData.ratings.waste || 0,
        elevator: checklistData.toggles.elevator || false,
        veranda: checklistData.toggles.veranda || false,
        pet: checklistData.toggles.pets || false,
        memo: checklistData.memo || "",
        voicenote: "", // GPT가 채워줄 예정
      },
      photos: [], // 사진은 별도 처리
    };

    const formData = new FormData();
    formData.append("file", audioFile);

    const payloadString = JSON.stringify(payload);
    const encodedPayload = encodeURIComponent(payloadString);

    const url = `${BACK_API_URL}/api/checklists?payload=${encodedPayload}&durationSec=${durationSec}`;

    console.log("🚀 체크리스트 생성 + GPT 요약 요청");

    const response = await fetch(url, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${exampletoken}`,
      },
    });

    if (!response.ok) {
      let errorBody;
      try {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          errorBody = await response.json();
        } else {
          errorBody = await response.text();
        }
      } catch (parseError) {
        errorBody = "응답 파싱 실패";
      }
      throw new Error(`서버 에러 (${response.status}): ${JSON.stringify(errorBody)}`);
    }

    const result = await response.json();
    const createdChecklistId = result.checkId || result.id;

    if (!createdChecklistId) {
      throw new Error("체크리스트 ID를 받지 못했습니다.");
    }

    console.log("✅ 1단계 완료 - 체크리스트 생성 + GPT 요약, ID:", createdChecklistId);

    // 🔥 2단계: 사진 업로드
    let uploadedPhotos = [];
    if (checklistData.photos && checklistData.photos.length > 0) {
      console.log("📸 사진 업로드 시작...");

      const photosToUpload = checklistData.photos.filter((photo) => photo && !photo.uploaded);

      if (photosToUpload.length > 0) {
        console.log(`📸 ${photosToUpload.length}개 사진 업로드 진행`);
        uploadedPhotos = await uploadPhotos(checklistData.photos, createdChecklistId);
        console.log("✅ 2단계 완료 - 모든 사진 업로드");
      }
    }

    console.log("🎉 요약 + 사진 업로드 완료:", {
      체크리스트ID: createdChecklistId,
      요약: result.items?.voicenote?.substring(0, 100) + "...",
      업로드된사진수: uploadedPhotos.length,
    });

    return {
      ...result,
      checkId: createdChecklistId,
      photos: uploadedPhotos,
    };
  } catch (error) {
    console.error("❌ 요약 + 생성 전체 과정 실패:", error);
    throw error;
  }
};
