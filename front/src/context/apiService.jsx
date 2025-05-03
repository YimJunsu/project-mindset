import axios from 'axios';

// API 기본 URL
const API_BASE_URL = 'http://localhost:8080/api';

// axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 - 모든 요청에 토큰 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 401 오류 처리(인증 만료)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // 로그인 페이지로 리다이렉트
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 인증 관련 API
export const authAPI = {
  // 회원가입
  signup: (userData) => api.post('/auth/signup', userData),
  
  // 로그인
  login: (credentials) => api.post('/auth/login', credentials),
  
  // 소셜 로그인 URL 가져오기
  getKakaoLoginUrl: () => `${API_BASE_URL}/oauth2/authorization/kakao`,
  getNaverLoginUrl: () => `${API_BASE_URL}/oauth2/authorization/naver`,
};

// 사용자 프로필 관련 API
export const userAPI = {
  // 내 프로필 조회
  getMyProfile: () => api.get('/users/me'),
  
  // 프로필 업데이트
  updateProfile: (userData) => api.put('/users/me', userData),
  
  // 회원 탈퇴
  deleteAccount: () => api.delete('/users/me'),
};

// 공통 API 클라이언트 export
export default api;