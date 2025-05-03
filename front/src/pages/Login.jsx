import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, getKakaoLoginUrl, getNaverLoginUrl } = useAuth();
  const { getColor } = useTheme();
  const navigate = useNavigate();

  // 폼 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      await login(email, password);
      navigate('/'); // 로그인 성공 시 메인 페이지로 이동
    } catch (err) {
      console.error('로그인 오류:', err);
      setError(err.response?.data?.message || '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 items-center justify-center">
  <div className="w-full max-w-lg p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
    <div className="text-center">
      <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-4">
        마인드SET
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        계정에 로그인하고 자기개발을 시작하세요
      </p>
    </div>

    {error && (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
        {error}
      </div>
    )}

    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          이메일
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-3 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          비밀번호
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-3 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          required
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
          style={{ backgroundColor: loading ? '#ccc' : getColor('primary') }}
        >
          {loading ? '로그인 중...' : '로그인'}
        </button>
      </div>
    </form>

    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
            소셜 계정으로 로그인
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <a
          href={getKakaoLoginUrl()}
          className="w-full flex items-center justify-center py-3 px-4 rounded-lg bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
        >
          <span className="text-sm font-medium text-gray-900">카카오 로그인</span>
        </a>

        <a
          href={getNaverLoginUrl()}
          className="w-full flex items-center justify-center py-3 px-4 rounded-lg bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <span className="text-sm font-medium text-white">네이버 로그인</span>
        </a>
      </div>
    </div>

    <div className="mt-6 text-center">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        계정이 없으신가요?{' '}
        <Link
          to="/signup"
          className="font-medium text-orange-500 hover:text-orange-600"
          style={{ color: getColor('primary') }}
        >
          회원가입
        </Link>
      </p>
    </div>
  </div>
</div>
  );
};

export default Login;
