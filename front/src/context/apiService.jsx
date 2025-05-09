import axios from 'axios';

// 백엔드 서버 기본 URL
const BACKEND_URL = 'http://localhost:8080';
// API 기본 URL
const API_BASE_URL = `${BACKEND_URL}/api`;

// axios 인스턴스 생성 (명시적으로 모든 요청에 Content-Type 설정)
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 - 모든 요청에 토큰 추가
api.interceptors.request.use(
  (config) => {
    // 요청 URL 및 메서드 로깅 (디버깅용)
    console.log(`요청 정보: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    
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
    console.error('API 오류:', error);
    
    if (error.response) {
      console.log('응답 상태:', error.response.status);
      console.log('응답 데이터:', error.response.data);
      
      if (error.response.status === 401) {
        // 로그인 페이지로 리다이렉트
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
  
  // 로그인 - 명시적으로 JSON 형식 지정
  login: (credentials) => {
    console.log('로그인 요청:', credentials);
    return api.post('/auth/login', credentials, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  },
  
  // 소셜 로그인 URL 가져오기 (전체 URL 반환)
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
    console.log('프로필 업데이트 요청 데이터:', userData);
    
    // FormData 객체인 경우 multipart/form-data로 전송
    if (userData instanceof FormData) {
      // 완전한 URL 사용
      return axios({
        method: 'put',
        url: `${API_BASE_URL}/users/me`,
        data: userData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
    }
    
    // 일반 객체인 경우 - 완전한 URL 사용
    return axios({
      method: 'put',
      url: `${API_BASE_URL}/users/me`,
      data: userData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
  },
  
  // 프로필 이미지 업로드
  uploadProfileImage: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    // 완전한 URL 사용
    return axios({
      method: 'post',
      url: `${API_BASE_URL}/users/me/profile-image`,
      data: formData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  // 회원 탈퇴 - 명시적으로 완전한 URL 사용
  deleteAccount: () => {
    const token = localStorage.getItem('token');
    console.log('계정 삭제 요청 URL:', `${API_BASE_URL}/users/me`);
    console.log('인증 토큰 존재 여부:', !!token);
    
    // axios.delete 대신 명시적인 설정으로 요청
    return axios({
      method: 'delete',
      url: `${API_BASE_URL}/users/me`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }
};

// 공통 API 클라이언트
export default api;