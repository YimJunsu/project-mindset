// src/pages/study/TodoDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import api from '../../context/apiService';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

const TodoDetail = () => {
  // URL 파라미터에서 todoId 가져오기
  const { todoId } = useParams();
  const navigate = useNavigate();
  
  // 인증, 테마 컨텍스트 사용
  const { user } = useAuth();
  const { getColor } = useTheme();
  
  // 상태 관리
  const [todo, setTodo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [content, setContent] = useState('');
  
  // 컴포넌트 마운트 시 할 일 상세 정보 가져오기
  useEffect(() => {
    fetchTodoDetail();
  }, [todoId]);
  
  // 할 일 상세 정보 가져오기 API 호출
  const fetchTodoDetail = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/todo/detail/${todoId}`);
      setTodo(response.data);
      setContent(response.data.content);
      setError(null);
    } catch (err) {
      console.error('Todo 상세 조회 오류:', err);
      setError('할 일 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };
  
  // 할 일 내용 업데이트
  const handleUpdate = async () => {
    if (!content.trim()) {
      return;
    }
    
    try {
      const updatedTodo = {
        ...todo,
        content: content
      };
      
      await api.put(`/todo/status/${todoId}`, updatedTodo);
      setTodo(updatedTodo);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      console.error('Todo 업데이트 오류:', err);
      setError('할 일을 업데이트하는데 실패했습니다.');
    }
  };
  
  // 할 일 삭제
  const handleDelete = async () => {
    if (!window.confirm('정말로 이 할 일을 삭제하시겠습니까?')) {
      return;
    }
    
    try {
      await api.delete(`/todo/${todoId}`);
      navigate('/study/todo');
    } catch (err) {
      console.error('Todo 삭제 오류:', err);
      setError('할 일을 삭제하는데 실패했습니다.');
    }
  };
  
  // 할 일 완료/미완료 상태 토글
  const toggleStatus = async () => {
    try {
      const updatedTodo = {
        ...todo,
        isCompleted: !todo.isCompleted,
        completedAt: !todo.isCompleted ? new Date().toISOString() : null
      };
      
      await api.put(`/todo/status/${todoId}`, updatedTodo);
      setTodo(updatedTodo);
    } catch (err) {
      console.error('Todo 상태 변경 오류:', err);
      setError('할 일 상태를 변경하는데 실패했습니다.');
    }
  };
  
  // 날짜 포맷팅 함수
  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return format(date, 'yyyy년 MM월 dd일 HH:mm', { locale: ko });
    } catch (err) {
      console.error('날짜 변환 오류:', err);
      return '';
    }
  };
  
  // 로딩 중일 때 표시할 UI
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }
  
  // 오류 발생 시 표시할 UI
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <button
            onClick={() => navigate('/study/todo')}
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            &larr; 목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }
  
  // 할 일을 찾을 수 없을 때 표시할 UI
  if (!todo) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-2xl mx-auto">
          <p className="text-center text-gray-500 dark:text-gray-400">할 일을 찾을 수 없습니다.</p>
          <div className="flex justify-center mt-4">
            <button
              onClick={() => navigate('/study/todo')}
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              &larr; 목록으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/study/todo')}
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            &larr; 목록으로
          </button>
          <h1 className="text-2xl font-bold text-center flex-grow text-gray-800 dark:text-white">할 일 상세</h1>
        </div>
        
        {/* 할 일 상세 정보 */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">
          {isEditing ? (
            // 수정 모드
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">할 일 내용</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 min-h-[100px]"
                  style={{ '--tw-ring-color': getColor('primary') }}
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setContent(todo.content);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md"
                >
                  취소
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={!content.trim()}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                    content.trim() ? 'bg-orange-500 hover:bg-orange-600' : 'bg-orange-300 cursor-not-allowed'
                  }`}
                  style={{ backgroundColor: content.trim() ? getColor('primary') : undefined }}
                >
                  저장
                </button>
              </div>
            </div>
          ) : (
            // 보기 모드
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div 
                    className={`w-3 h-3 rounded-full mr-2 ${
                      todo.isCompleted ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                  ></div>
                  <p className="text-xl font-semibold text-gray-800 dark:text-white">
                    {todo.content}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 border-t dark:border-gray-700 pt-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {todo.isCompleted 
                    ? `완료일: ${formatDateTime(todo.completedAt)}` 
                    : `생성일: ${formatDateTime(todo.createdAt)}`}
                </p>
              </div>
              
              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={toggleStatus}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    todo.isCompleted
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      : 'bg-green-500 text-white'
                  }`}
                  style={{ backgroundColor: !todo.isCompleted ? getColor('primary') : undefined }}
                >
                  {todo.isCompleted ? '미완료로 표시' : '완료로 표시'}
                </button>
                
                <div>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-2"
                  >
                    수정
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoDetail;