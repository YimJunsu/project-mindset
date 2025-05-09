import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OAuthCallback = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  useEffect(() => {
    // 이미 로그인되어 있으면 홈으로 리다이렉트
    if (user) {
      navigate('/');
      return;
    }
    
    const processOAuthLogin = async () => {
      try {
        // URL에서 토큰과 사용자 정보 파라미터 추출
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const userId = params.get('userId');
        let email = params.get('email');
        let nickname = params.get('nickname');
        
        if (!token) {
          throw new Error('인증 정보가 올바르지 않습니다.');
        }
        
        // URL 디코딩
        try {
          email = decodeURIComponent(email);
          nickname = decodeURIComponent(nickname);
        } catch (e) {
          console.warn('URL 디코딩 중 오류 발생:', e);
        }
        
        console.log('소셜 로그인 성공:', { userId, email, nickname });
        
        // 로컬 스토리지에 사용자 정보 저장
        localStorage.setItem('token', token);
        
        const userData = {
          userId: userId,
          email: email,
          nickname: nickname
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        
        // 홈페이지로 리다이렉트
        navigate('/', { replace: true });
      } catch (err) {
        console.error('소셜 로그인 처리 오류:', err);
        setError(err.message || '로그인 처리 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };
    
    processOAuthLogin();
  }, [location, navigate, user]);
  
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 items-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            소셜 로그인 처리 중...
          </h2>
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 items-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            로그인 오류
          </h2>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
          <button
            onClick={() => navigate('/login')}
            className="bg-orange-500 text-white py-2 px-6 rounded-lg hover:bg-orange-600 transition-colors"
          >
            로그인 페이지로 돌아가기
          </button>
        </div>
      </div>
    );
  }
  
  return null;
};

export default OAuthCallback;