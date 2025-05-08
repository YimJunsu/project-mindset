// src/pages/memo/MemoDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import memoAPI from '../../context/MemoAPi';

const MemoDetail = () => {
  const { memoId } = useParams();
  const { user } = useAuth();
  const { getColor } = useTheme();
  const navigate = useNavigate();
  const { refreshStats } = useOutletContext() || {};
  
  const [memo, setMemo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 메모 상세 정보와 카테고리 목록 가져오기
  useEffect(() => {
    if (user && user.userId && memoId) {
      Promise.all([
        fetchMemoDetail(),
        fetchCategories()
      ]);
    }
  }, [user, memoId]);
  
  // 메모 상세 정보 가져오기
  const fetchMemoDetail = async () => {
    try {
      setLoading(true);
      const response = await memoAPI.getMemoDetail(memoId);
      const memoData = response.data.memo;
      
      setMemo(memoData);
      setTitle(memoData.title);
      setCategory(memoData.category);
      
      // 편집을 위한 컨텐츠 - <br>을 줄바꿈으로 변환
      const plainContent = memoData.content.replace(/<br\s*\/?>/g, '\n').replace(/<[^>]*>/g, '');
      setContent(plainContent);
      
      setError(null);
    } catch (err) {
      console.error("메모 상세 조회 오류:", err);
      setError("메모 정보를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };
  
  // 카테고리 목록 가져오기
  const fetchCategories = async () => {
    try {
      const response = await memoAPI.getMemosByUser(user.userId);
      const memoData = response.data.map(item => item.memo);
      const uniqueCategories = [...new Set(memoData.filter(memo => memo.category).map(memo => memo.category))];
      setCategories(uniqueCategories);
    } catch (err) {
      console.error("카테고리 목록 조회 오류:", err);
    }
  };
  
  // 메모 업데이트
  const handleUpdateMemo = async () => {
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    
    try {
      setLoading(true);
      
      // 줄바꿈을 <br>로 변환
      const formattedContent = content.replace(/\n/g, '<br>');
      
      const updatedMemoData = {
        memoId: memo.memoId,
        userId: memo.userId,
        title: title,
        content: formattedContent,
        category: category
      };
      
      await memoAPI.updateMemo(memo.memoId, updatedMemoData);
      
      // 메모 정보 새로고침
      await fetchMemoDetail();
      
      // 수정 모드 종료
      setIsEditing(false);
    } catch (err) {
      console.error("메모 업데이트 오류:", err);
      setError("메모 업데이트에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };
  
  // 메모 삭제
  const handleDeleteMemo = async () => {
    if (!window.confirm('정말로 이 메모를 삭제하시겠습니까?')) {
      return;
    }
    
    try {
      await memoAPI.deleteMemo(memo.memoId);
      
      // 메모 통계 새로고침
      if (refreshStats) {
        refreshStats();
      }
      
      // 목록 페이지로 이동
      navigate('/memo');
    } catch (err) {
      console.error("메모 삭제 오류:", err);
      setError("메모 삭제에 실패했습니다.");
    }
  };
  
  // 로딩 중일 때 표시할 UI
  if (loading && !memo) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }
  
  // 메모가 없을 때 표시할 UI
  if (!memo && !loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">메모를 찾을 수 없습니다.</p>
        <button
          onClick={() => navigate('/memo')}
          className="mt-4 px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
        >
          목록으로 돌아가기
        </button>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      {/* 오류 메시지 */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* 헤더: 제목, 카테고리, 버튼 (항상 표시) */}
      <div className="flex justify-between mb-6">
        <div>
          {isEditing ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl font-bold w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 mb-2"
              placeholder="메모 제목을 입력하세요"
              style={{ '--tw-ring-color': getColor('primary') }}
            />
          ) : (
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              {memo.title}
            </h1>
          )}
          
          {isEditing ? (
            <div className="mt-2">
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
          ) : (
            memo.category && (
              <span className="inline-block mt-2 px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                {memo.category}
              </span>
            )
          )}
        </div>
        
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 border border-gray-300 dark:border-gray-600 rounded"
              >
                취소
              </button>
              <button
                onClick={handleUpdateMemo}
                disabled={loading}
                className="px-3 py-1 text-sm text-white border rounded"
                style={{ backgroundColor: getColor('primary'), borderColor: getColor('primary') }}
              >
                {loading ? '저장 중...' : '저장'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 border border-blue-600 dark:border-blue-400 rounded"
              >
                수정
              </button>
              <button
                onClick={handleDeleteMemo}
                className="px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 border border-red-600 dark:border-red-400 rounded"
              >
                삭제
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* 메모 내용 (편집 모드 또는 보기 모드) */}
      <div className="mb-6">
        {isEditing ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 h-80 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="메모 내용을 입력하세요"
            style={{ '--tw-ring-color': getColor('primary') }}
          />
        ) : (
          <div 
            className="prose prose-lg max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: memo.content }} 
          />
        )}
      </div>
      
      {/* 메타 정보 */}
      <div className="border-t border-gray-100 dark:border-gray-700 pt-4 text-sm text-gray-500 dark:text-gray-400">
        생성일: {new Date(memo.createdAt).toLocaleString()}
      </div>
      
      {/* 목록으로 돌아가기 버튼 */}
      <div className="mt-6">
        <button
          onClick={() => navigate('/memo')}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md"
        >
          목록으로
        </button>
      </div>
    </div>
  );
};

export default MemoDetail;