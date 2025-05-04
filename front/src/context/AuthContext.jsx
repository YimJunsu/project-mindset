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
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (storedUser && token) {
        try {
          setUser(JSON.parse(storedUser));
          
          // 토큰 유효성 검증을 위해 프로필 정보 요청
          const response = await userAPI.getMyProfile();
          setUser(response.data);
          localStorage.setItem('user', JSON.stringify(response.data));
        } catch (err) {
          console.error('인증 정보 검증 실패:', err);
          logout();
        }
      }
      
      setLoading(false);
    };

    loadUser();
  }, []);

  // 로그인 처리
  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authAPI.login({ email, password });
      console.log('로그인 성공:', response.data);
      
      const { token, ...userData } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      return userData;
    } catch (err) {
      console.error('로그인 오류:', err);
      setError(err.response?.data?.message || '로그인에 실패했습니다.');
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

  // 소셜 로그인 URL 생성
  const getKakaoLoginUrl = () => authAPI.getKakaoLoginUrl();
  const getNaverLoginUrl = () => authAPI.getNaverLoginUrl();

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
    getKakaoLoginUrl,
    getNaverLoginUrl,
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