import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI, userAPI } from './apiService';

// 인증 컨텍스트 생성
const AuthContext = createContext(null);

// 인증 제공자 컴포넌트
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 초기 로드 시 로컬 스토리지에서 사용자 정보 가져오기
  useEffect(() => {
    const loadUser = async () => {
      console.log("AuthContext - 사용자 정보 로드 시작");
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      console.log("AuthContext - localStorage에서 가져온 사용자 정보:", storedUser);
      console.log("AuthContext - localStorage에서 가져온 토큰 존재 여부:", !!token);
      
      if (storedUser && token) {
        try {
          const parsedUser = JSON.parse(storedUser);
          console.log("AuthContext - 파싱된 사용자 정보:", parsedUser);
          
          // 로컬 스토리지의 사용자 정보로 먼저 설정
          setUser(parsedUser);
          
          // API 호출은 try-catch로 감싸서 실패해도 로그인 상태 유지
          try {
            const response = await userAPI.getMyProfile();
            console.log("AuthContext - 프로필 정보 응답:", response.data);
            
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
          } catch (apiErr) {
            console.warn("AuthContext - API 호출 실패, 로컬 스토리지 정보 사용:", apiErr);
            // API 호출 실패해도 로그인 상태 유지
          }
        } catch (err) {
          console.error('AuthContext - 인증 정보 검증 실패:', err);
          logout();
        }
      } else {
        console.log("AuthContext - 저장된 사용자 정보 또는 토큰이 없음");
      }
      
      setLoading(false);
      console.log("AuthContext - 로딩 완료");
    };
    
    loadUser();
  }, []);

  // 로그인 처리 함수 수정
  const login = async (credentials) => {
    try {
      setError(null);
      console.log('로그인 요청 데이터:', credentials);
      
      // credentials이 문자열이 아닌 객체인지 확인
      if (typeof credentials === 'string') {
        throw new Error('로그인에 실패했습니다. 이메일과 비밀번호를 객체로 전달해주세요.');
      }
      
      // email과 password가 모두 있는지 확인
      if (!credentials.email || !credentials.password) {
        throw new Error('이메일과 비밀번호를 모두 입력해주세요.');
      }
      
      const response = await authAPI.login(credentials);
      console.log('로그인 성공:', response.data);
      
      const { token, userId, email, nickname, profileImage, role } = response.data;
      
      // 사용자 정보 객체 생성
      const userData = {
        userId,
        email,
        nickname,
        profileImage,
        role
      };
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      return userData;
    } catch (err) {
      console.error('로그인 오류:', err);
      setError(err.response?.data?.message || err.message || '로그인에 실패했습니다.');
      throw err;
    }
  };

  // 회원가입 처리 (자동 로그인 없이)
  const signup = async (userData) => {
    try {
      setError(null);
      console.log('회원가입 요청 데이터:', userData);
          
      const response = await authAPI.signup(userData);
      console.log('회원가입 성공:', response.data);
      
      // 토큰 저장과 사용자 설정 없이 데이터만 반환
      return response.data;
    } catch (err) {
      console.error('회원가입 오류:', err);
      setError(err.response?.data?.message || '회원가입에 실패했습니다.');
      throw err;
    }
  };

  // 로그아웃 처리
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // 프로필 업데이트
  const updateProfile = async (userData) => {
    try {
      setError(null);
      const response = await userAPI.updateProfile(userData);
      const updatedUser = response.data;
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      return updatedUser;
    } catch (err) {
      setError(err.response?.data?.message || '프로필 업데이트에 실패했습니다.');
      throw err;
    }
  };

  // 계정 삭제
  const deleteAccount = async () => {
    try {
      await userAPI.deleteAccount();
      logout();
    } catch (err) {
      setError(err.response?.data?.message || '계정 삭제에 실패했습니다.');
      throw err;
    }
  };

  // OAuth 로그인 처리
  const processOAuthLogin = (token, userData) => {
    try {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (err) {
      console.error('OAuth 로그인 처리 오류:', err);
      setError('OAuth 로그인 처리 중 오류가 발생했습니다.');
      throw err;
    }
  };

  // 제공할 컨텍스트 값
  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    updateProfile,
    deleteAccount,
    processOAuthLogin,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 인증 컨텍스트 사용을 위한 훅
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth는 AuthProvider 내에서 사용해야 합니다.');
  }
  return context;
};

export default AuthContext;