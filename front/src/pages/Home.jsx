import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // ✅ 변경: useAuth 훅 사용
import { ThemeContext } from '../context/ThemeContext';
import axios from 'axios';
import { FaBook, FaDumbbell, FaQuestion, FaCamera } from 'react-icons/fa';

const FeatureCard = ({ icon, title, description, link, darkMode }) => (
  <div className={`p-6 rounded-lg shadow-md transition-all hover:shadow-lg ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'}`}>
    <div className="flex flex-col items-center text-center">
      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-orange-500 text-white text-2xl mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="mb-4">{description}</p>
      <Link to={link} className="mt-auto px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors">
        바로가기
      </Link>
    </div>
  </div>
);

const Home = () => {
  const { darkMode } = useContext(ThemeContext);
  const { isAuthenticated } = useAuth(); // ✅ 변경: useAuth 훅에서 isAuthenticated 가져오기
  const [cheerup, setCheerup] = useState(null);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const [error, setError] = useState(null); // 에러 상태 추가

  useEffect(() => {
    if (isAuthenticated) {
      // 로딩 시작
      setLoading(true); 
  
      axios.get('http://localhost:8080/api/cheerup/random')
        .then(res => {
          console.log('Received cheerup:', res.data); // 명언 데이터 확인
          setCheerup(res.data);  // 명언 데이터를 cheerup 상태로 설정
          setLoading(false); // 로딩 종료
        })
        .catch(err => {
          console.error('명언 불러오기 실패:', err);
          setError('명언을 가져오는 데 실패했습니다.'); // 에러 메시지 설정
          setLoading(false); // 로딩 종료
        });
    }
  }, [isAuthenticated]);
  
  
  const features = [
    {
      icon: <FaBook />,
      title: "공부 관리",
      description: "투두리스트로 계획하고, 타이머로 집중하며, 메모장에 기록하세요.",
      link: "/study"
    },
    {
      icon: <FaDumbbell />,
      title: "운동 관리",
      description: "운동 기록을 남기고, AI 식단 추천으로 건강한 생활을 유지하세요.",
      link: "/workout"
    },
    {
      icon: <FaQuestion />,
      title: "질문 게시판",
      description: "모르는 것을 물어보고 함께 성장하는 커뮤니티에 참여하세요.",
      link: "/questions"
    },
    {
      icon: <FaCamera />,
      title: "오운완 인증",
      description: "운동 완료 인증으로 동기부여를 얻고 서로 응원하세요.",
      link: "/workout-posts"
    }
  ];

  return (
    <div className={`transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>

      {/* 로그인 여부에 따라 첫 섹션 분기 */}
      {isAuthenticated ? ( // ✅ 변경: isLoggedIn → isAuthenticated
        <section className={`pt-36 pb-16 px-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">오늘의 응원 한 마디</h1>

            {/* 로딩 중일 때 표시 */}
            {loading && <p>로딩 중...</p>}

            {/* 에러 발생 시 표시 */}
            {error && <p className="text-red-500">{error}</p>}

            {/* 명언 표시 */}
            {cheerup && !loading && !error && (
              <div className="mt-8 bg-orange-100 dark:bg-orange-900 p-6 rounded-lg max-w-xl mx-auto">
                <p className="text-lg italic mb-2">"{cheerup.content}"</p>
                <p className="text-right font-semibold">- {cheerup.author || '익명'}</p>
              </div>
                )}
              </div>
        </section>
      ) : (
        <section className={`pt-36 pb-16 px-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">마인드SET과 함께 성장하세요</h1>
            <p className="text-xl md:text-1xl mb-8 max-w-3xl mx-auto">
              공부와 운동을 체계적으로 관리하고 목표를 달성하기 위한 자기개발 플랫폼
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register" className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors">
                시작하기
              </Link>
              <Link to="/login" className="px-6 py-3 bg-transparent border-2 border-orange-500 text-orange-500 font-semibold rounded-lg hover:bg-orange-50 transition-colors">
                로그인
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 기능 소개 섹션 */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              마인드SET의 핵심 기능
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} darkMode={darkMode} />
            ))}
          </div>
        </div>
      </section>

      {/* 플랫폼 장점 섹션 */}
      <section className={`py-16 px-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              왜 마인드SET 인가요?🤔
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
              <h3 className="text-xl font-semibold mb-4">올인원 솔루션💡</h3>
              <p>공부와 운동을 한 곳에서 관리하고 기록할 수 있는 통합 플랫폼입니다.</p>
            </div>
            <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
              <h3 className="text-xl font-semibold mb-4">커뮤니티 활동🗣️</h3>
              <p>질문 게시판과 오운완 인증을 통해 다른 사용자들과 교류하며 동기부여를 얻으세요.</p>
            </div>
            <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
              <h3 className="text-xl font-semibold mb-4">AI 식단 추천🍏</h3>
              <p>개인별 맞춤 식단 추천으로 건강한 생활습관을 유지하세요.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">지금 바로 시작하세요!</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            마인드SET과 함께 건강한 습관을 만들고 목표를 달성하세요.
          </p>
          <Link 
            to="/register" 
            className="px-8 py-4 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
          >
            무료로 시작하기
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
