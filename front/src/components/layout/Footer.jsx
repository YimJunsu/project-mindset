import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import { FaGithub, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <footer className={`py-8 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              마인드<span className="font-extrabold">SET</span>
            </h2>
            <p className="mt-2 text-sm">자기개발 플랫폼으로 목표를 이루세요!</p>
          </div>
          
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
            <div>
              <h3 className="font-semibold mb-2">바로가기</h3>
              <ul className="space-y-1 text-sm">
                <li><Link to="/study" className="hover:text-orange-500 transition-colors">공부하기</Link></li>
                <li><Link to="/workout" className="hover:text-orange-500 transition-colors">운동하기</Link></li>
                <li><Link to="/questions" className="hover:text-orange-500 transition-colors">질문게시판</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">고객지원</h3>
              <ul className="space-y-1 text-sm">
                <li><Link to="/faq" className="hover:text-orange-500 transition-colors">자주 묻는 질문</Link></li>
                <li><Link to="/terms" className="hover:text-orange-500 transition-colors">이용약관</Link></li>
                <li><Link to="/privacy" className="hover:text-orange-500 transition-colors">개인정보처리방침</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-gray-300 dark:border-gray-700 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} 마인드SET. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;