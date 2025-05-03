// src/components/layout/Header.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import { FaMoon, FaSun, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import Sidebar from './Sidebar';

const Header = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  return (
    <header className={`fixed w-full top-0 z-50 transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} shadow-md`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">

        {/* 좌측: 햄버거 메뉴 + 로고 */}
        <div className="flex items-center space-x-4">
          <Sidebar />
          <Link to="/" className="flex items-center">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-orange-600">
              마인드<span className="font-extrabold">SET</span>
            </h1>
          </Link>
        </div>

        {/* 우측: 로그인/회원가입/테마 토글 */}
        <div className="flex items-center space-x-4">
          <Link to="/login" className="hover:text-orange-500 transition-colors flex items-center">
            <FaSignInAlt className="mr-1" /> 로그인
          </Link>
          <Link to="/register" className="hover:text-orange-500 transition-colors flex items-center">
            <FaUserPlus className="mr-1" /> 회원가입
          </Link>
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label={darkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}
          >
            {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
