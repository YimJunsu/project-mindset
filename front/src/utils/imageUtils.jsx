// src/utils/imageUtils.js
export const getWorkoutPostImageUrl = (imageUrl) => {
  if (!imageUrl) {
    return null;
  }
  
  // 이미 http:// 또는 https://로 시작하는 경우 그대로 사용
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // 환경 변수에서 경로 가져오기
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
  const uploadsPath = import.meta.env.VITE_UPLOADS_PATH || 'uploads';
  
  // 서버 URL과 함께 사용
  return `${apiUrl}/${uploadsPath}/${imageUrl}`;
};