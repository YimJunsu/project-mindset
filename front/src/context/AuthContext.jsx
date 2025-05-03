// src/context/AuthContext.jsx
import React, { createContext, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const login = async (email, password) => {
    // 임시 로그인 로직 (백엔드 연동 전용)
    if (email === 'test@test.com' && password === '1234') {
      return Promise.resolve();
    } else {
      const error = new Error('Invalid credentials');
      error.response = { data: { message: '이메일 또는 비밀번호가 잘못되었습니다.' } };
      return Promise.reject(error);
    }
  };

  const getKakaoLoginUrl = () => 'https://kauth.kakao.com/oauth/authorize?...';
  const getNaverLoginUrl = () => 'https://nid.naver.com/oauth2.0/authorize?...';

  return (
    <AuthContext.Provider value={{ login, getKakaoLoginUrl, getNaverLoginUrl }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
