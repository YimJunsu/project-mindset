// src/pages/memo/Memo.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import memoAPI from '../../context/MemoApi';

const Memo = () => {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const { getColor } = useTheme();
  const navigate = useNavigate();
  
  const [memoStats, setMemoStats] = useState({ count: 0, canCreate: true, limit: 2 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 인증 확인 및 메모 통계 가져오기
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        console.log("인증되지 않은 사용자입니다. 로그인 페이지로 이동합니다.");
        navigate('/login');
        return;
      }

      if (user && user.userId) {
        fetchMemoStats();
      } else {
        setLoading(false);
      }
    }
  }, [authLoading, isAuthenticated, user, navigate]);

  // 메모 통계 가져오기
  const fetchMemoStats = async () => {
    try {
      setLoading(true);
      const response = await memoAPI.getMemoCount(user.userId);
      setMemoStats(response.data);
      setError(null);
    } catch (err) {
      console.error("메모 통계 조회 오류:", err);
      setError("메모 정보를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 새 메모 생성 페이지로 이동
  const handleCreateMemo = () => {
    if (!memoStats.canCreate) {
      alert(`메모는 최대 ${memoStats.limit}개까지만 생성할 수 있습니다.`);
      return;
    }
    navigate('/memo/save');
  };

  // 로딩 중일 때 표시할 UI
  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 pt-28">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">나의 메모</h1>
          
          <div className="flex items-center space-x-4">
            {/* 메모 통계 정보 */}
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {memoStats.count}/{memoStats.limit} 메모 사용 중
            </div>
            
            {/* 새 메모 생성 버튼 */}
            <button
              onClick={handleCreateMemo}
              disabled={!memoStats.canCreate}
              className={`px-4 py-2 rounded-md text-white font-medium ${
                memoStats.canCreate 
                  ? 'bg-orange-500 hover:bg-orange-600'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
              style={{ backgroundColor: memoStats.canCreate ? getColor('primary') : undefined }}
            >
              새 메모 작성
            </button>
          </div>
        </div>
        
        {/* 오류 메시지 */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {/* 중요: 자식 라우트를 렌더링하는 Outlet 컴포넌트 */}
        <Outlet context={{ refreshStats: fetchMemoStats }} />
      </div>
    </div>
  );
};

export default Memo;