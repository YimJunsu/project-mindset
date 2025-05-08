// src/pages/memo/MemoList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import memoAPI from '../../context/MemoApi';

const MemoList = () => {
  const { user } = useAuth();
  const { getColor } = useTheme();
  const navigate = useNavigate();
  const { refreshStats } = useOutletContext();
  
  const [memos, setMemos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);

  // 메모 목록 가져오기
  useEffect(() => {
    if (user && user.userId) {
      fetchMemos();
    }
  }, [user]);

  // 메모 목록 가져오기
  const fetchMemos = async () => {
    try {
      setLoading(true);
      const response = await memoAPI.getMemosByUser(user.userId);
      
      // 메모 데이터 추출 (API 응답 구조에 따라 조정 필요)
      const memoData = response.data.map(item => item.memo);
      setMemos(memoData);
      
      // 고유 카테고리 추출
      const uniqueCategories = [...new Set(memoData.filter(memo => memo.category).map(memo => memo.category))];
      setCategories(uniqueCategories);
      
      setError(null);
    } catch (err) {
      console.error("메모 목록 조회 오류:", err);
      setError("메모 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 메모 삭제
  const handleDeleteMemo = async (memoId) => {
    if (!window.confirm('정말로 이 메모를 삭제하시겠습니까?')) {
      return;
    }
    
    try {
      await memoAPI.deleteMemo(memoId);
      // 목록 새로고침
      fetchMemos();
      // 통계 새로고침
      refreshStats();
    } catch (err) {
      console.error("메모 삭제 오류:", err);
      alert("메모 삭제에 실패했습니다.");
    }
  };

  // 메모 상세 페이지로 이동
  const handleViewMemo = (memoId) => {
    navigate(`/memo/detail/${memoId}`);
  };

  // 카테고리별 필터링
  const filteredMemos = selectedCategory === 'all'
    ? memos
    : memos.filter(memo => memo.category === selectedCategory);

  // 로딩 중일 때 표시할 UI
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // 메모가 없을 때 표시할 UI
  if (memos.length === 0) {
    return (
      <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">메모가 없습니다</h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">새 메모 작성 버튼을 눌러 첫 메모를 작성해보세요.</p>
      </div>
    );
  }

  return (
    <div>
      {/* 카테고리 필터 */}
      {categories.length > 0 && (
        <div className="mb-6">
          <div className="flex border-b dark:border-gray-700 overflow-x-auto">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 mx-1 text-sm font-medium transition-colors duration-200 border-b-2 ${
                selectedCategory === 'all'
                  ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              style={{ borderColor: selectedCategory === 'all' ? getColor('primary') : 'transparent',
                      color: selectedCategory === 'all' ? getColor('primary') : undefined }}
            >
              전체
            </button>
            
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 mx-1 text-sm font-medium transition-colors duration-200 border-b-2 ${
                  selectedCategory === category
                    ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                style={{ borderColor: selectedCategory === category ? getColor('primary') : 'transparent',
                        color: selectedCategory === category ? getColor('primary') : undefined }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* 메모 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMemos.map(memo => (
          <div
            key={memo.memoId}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5 transition-shadow duration-200 hover:shadow-md"
          >
            {/* 메모 제목 및 카테고리 */}
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-medium text-gray-800 dark:text-white line-clamp-1">
                {memo.title}
              </h3>
              
              {memo.category && (
                <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                  {memo.category}
                </span>
              )}
            </div>
            
            {/* 메모 내용 미리보기 */}
            <div 
              className="mb-4 text-gray-600 dark:text-gray-400 line-clamp-3 h-18 text-sm"
              dangerouslySetInnerHTML={{ 
                __html: memo.content?.length > 200 
                  ? memo.content.substring(0, 200) + '...' 
                  : memo.content 
              }}
            />
            
            {/* 메모 작성 시간 및 액션 버튼 */}
            <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(memo.createdAt).toLocaleDateString()}
              </span>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleViewMemo(memo.memoId)}
                  className="px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  보기
                </button>
                
                <button
                  onClick={() => handleDeleteMemo(memo.memoId)}
                  className="px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemoList;