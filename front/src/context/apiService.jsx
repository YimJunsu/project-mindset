import axios from 'axios';

// 백엔드 서버 기본 URL
const BACKEND_URL = 'http://localhost:8080';
// API 기본 URL
const API_BASE_URL = `${BACKEND_URL}/api`;

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
    // 요청 URL 디버깅
    console.log(`요청 보내기 전: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    
    // baseURL이 undefined인 경우 수정
    if (!config.baseURL && !config.url.startsWith('http')) {
      config.baseURL = API_BASE_URL;
      console.log('baseURL 설정됨:', config.baseURL);
    }
    
    // 절대 경로가 아닌 경우만 토큰 추가
    if (!config.url.startsWith('http')) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
        console.log('토큰 헤더 추가됨');
      }
    }
    
    // 최종 URL 확인 (디버깅용)
    const finalUrl = config.baseURL ? `${config.baseURL}${config.url}` : config.url;
    console.log('최종 요청 URL:', finalUrl);
    
    return config;
  },
  (error) => {
    console.error('요청 인터셉터 오류:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 401 오류 처리(인증 만료)
api.interceptors.response.use(
  (response) => {
    console.log('응답 성공:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API 오류:', error);
    
    if (error.response) {
      console.log('응답 상태:', error.response.status);
      console.log('응답 데이터:', error.response.data);
      console.log('요청 URL:', error.config.url);
      
      if (error.response.status === 401) {
        console.log('인증 만료, 로그아웃 처리');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// 인증 관련 API
export const authAPI = {
  // 회원가입
  signup: (userData) => api.post('/auth/signup', userData),
  
  // 로그인
  login: (credentials) => {
    console.log('로그인 요청:', credentials);
    return api.post('/auth/login', credentials);
  },
  
  // 소셜 로그인 URL 가져오기
  getKakaoLoginUrl: () => `${BACKEND_URL}/oauth2/authorization/kakao`,
  getNaverLoginUrl: () => `${BACKEND_URL}/oauth2/authorization/naver`,
  
  // OAuth 콜백 처리
  processOAuthCallback: (params) => api.post('/auth/oauth2/callback', params),
};

// 사용자 프로필 관련 API
export const userAPI = {
  // 내 프로필 조회
  getMyProfile: () => api.get('/users/me'),
  
  // 프로필 업데이트 (FormData 처리 추가)
  updateProfile: (userData) => {
    console.log('프로필 업데이트 요청 시작');
    
    // FormData 객체인 경우 multipart/form-data로 전송
    if (userData instanceof FormData) {
      console.log('FormData 형식으로 프로필 업데이트');
      
      return api.put('/users/me', userData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    }
    
    // 일반 객체인 경우
    console.log('JSON 형식으로 프로필 업데이트');
    return api.put('/users/me', userData);
  },
  
  // 프로필 이미지 업로드
  uploadProfileImage: (file) => {
    console.log('프로필 이미지 업로드 시작');
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post('/users/me/profile-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  // 회원 탈퇴
  deleteAccount: () => {
    console.log('계정 삭제 API 호출 시작');
    return api.delete('/users/me');
  }
};

// 공통 API 클라이언트
export default api;