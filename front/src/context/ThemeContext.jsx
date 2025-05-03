import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // 로컬 스토리지에서 테마 설정 가져오기
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('darkMode');
    return savedTheme ? JSON.parse(savedTheme) : 
           window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // 다크 모드 전환 함수
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // 다크 모드 변경 시 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    // HTML body에 다크 모드 클래스 적용
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};