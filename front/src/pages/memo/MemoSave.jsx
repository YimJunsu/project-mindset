// src/pages/memo/MemoSave.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import memoAPI from '../../context/MemoApi';

const MemoSave = () => {
  const { user } = useAuth();
  const { getColor } = useTheme();
  const navigate = useNavigate();
  const { refreshStats } = useOutletContext() || {};
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // 기존 카테고리 목록 가져오기
  useEffect(() => {
    if (user && user.userId) {
      fetchCategories();
    }
  }, [user]);
  
  // 기존 메모에서 카테고리 목록 가져오기
  const fetchCategories = async () => {
    try {
      const response = await memoAPI.getMemosByUser(user.userId);
      // 메모 데이터 추출
      const memoData = response.data.map(item => item.memo);
      // 고유 카테고리 추출
      const uniqueCategories = [...new Set(memoData.filter(memo => memo.category).map(memo => memo.category))];
      setCategories(uniqueCategories);
    } catch (err) {
      console.error("카테고리 목록 조회 오류:", err);
    }
  };
  
  // 메모 저장
  const handleSaveMemo = async () => {
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // 간단한 HTML 포맷팅 (줄바꿈 유지)
      const formattedContent = content.replace(/\n/g, '<br>');
      
      const memoData = {
        userId: user.userId,
        title: title,
        content: formattedContent,
        category: category
      };
      
      await memoAPI.createMemo(memoData);
      
      // 메모 통계 새로고침
      if (refreshStats) {
        refreshStats();
      }
      
      // 목록 페이지로 이동
      navigate('/memo');
    } catch (err) {
      console.error("메모 저장 오류:", err);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("메모 저장에 실패했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">새 메모 작성</h2>
      
      {/* 오류 메시지 */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        {/* 제목 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            제목
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="메모 제목을 입력하세요"
            style={{ '--tw-ring-color': getColor('primary') }}
          />
        </div>
        
        {/* 카테고리 선택/입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            카테고리
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex-grow p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="카테고리를 입력하거나 선택하세요"
              list="categories"
              style={{ '--tw-ring-color': getColor('primary') }}
            />
            <datalist id="categories">
              {categories.map((cat, index) => (
                <option key={index} value={cat} />
              ))}
            </datalist>
          </div>
        </div>
        
        {/* 내용 입력 (기본 textarea) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            내용
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 h-80 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="메모 내용을 입력하세요"
            style={{ '--tw-ring-color': getColor('primary') }}
          />
        </div>
      </div>
      
      {/* 버튼 영역 */}
      <div className="flex justify-end space-x-2 mt-6">
        <button
          onClick={() => navigate('/memo')}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md"
        >
          취소
        </button>
        <button
          onClick={handleSaveMemo}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white rounded-md bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
          style={{ backgroundColor: getColor('primary') }}
        >
          {loading ? '저장 중...' : '저장'}
        </button>
      </div>
    </div>
  );
};

export default MemoSave;