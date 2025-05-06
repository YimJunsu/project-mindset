// src/pages/study/TodoDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import todoAPI from '../../context/todoAPI';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

const TodoDetail = () => {
  // URL 파라미터에서 todoId 가져오기
  const { todoId } = useParams();
  const navigate = useNavigate();
  
  // 인증, 테마 컨텍스트 사용
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const { getColor } = useTheme();
  
  // 상태 관리
  const [todo, setTodo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [content, setContent] = useState('');
  
  // 컴포넌트 마운트 시 인증 확인 및 할 일 상세 정보 가져오기
  useEffect(() => {
    // 인증 로딩이 완료되었는지 확인
    if (!authLoading) {
      // 로그인 상태 확인
      if (!isAuthenticated) {
        console.log("인증되지 않은 사용자입니다. 로그인 페이지로 이동합니다.");
        navigate('/login');
        return;
      }

      // 사용자 정보가 있는지 확인
      if (user && user.userId) {
        console.log(`할 일 상세 조회 시작 - ID: ${todoId}`);
        fetchTodoDetail();
      } else {
        console.log("사용자 정보가 없습니다.");
        setLoading(false);
        setError("사용자 정보를 불러올 수 없습니다.");
      }
    }
  }, [todoId, user, authLoading, isAuthenticated, navigate]);
  
  const fetchTodoDetail = async () => {
    try {
      setLoading(true);
      console.log(`할 일 상세 조회 - ID: ${todoId}`);
      
      const response = await todoAPI.getTodoDetail(todoId);
      console.log("할 일 상세 응답:", response.data);
      
      // ✅ 껍데기 벗기기
      const todoData = response.data.todolist || response.data;
  
      // 권한 확인
      if (todoData.userId !== user.userId) {
        console.error("권한이 없습니다. 다른 사용자의 할 일입니다.");
        setError("이 할 일에 접근할 권한이 없습니다.");
        setLoading(false);
        return;
      }
  
      setTodo(todoData);
      setContent(todoData.content);
      setError(null);
    } catch (err) {
      console.error("할 일 상세 조회 오류:", err);
  
      if (err.response && err.response.status === 401) {
        console.log("인증이 만료되었습니다. 로그인 페이지로 이동합니다.");
        navigate('/login');
        return;
      }
  
      setError("할 일 정보를 불러오는데 실패했습니다.");
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
      console.log(`할 일 업데이트 - ID: ${todoId}, 내용: ${content}`);
      
      // 요청 데이터 구성
      const updatedTodo = {
        todoId: todoId,
        userId: user.userId,
        content: content,
        isCompleted: todo.isCompleted
      };
      
      await todoAPI.updateTodoStatus(todoId, updatedTodo);
      
      // 할 일 정보 갱신
      setTodo({...todo, content: content});
      setIsEditing(false);
      setError(null);
    } catch (err) {
      console.error("할 일 업데이트 오류:", err);
      
      // 401 오류인 경우 로그인 페이지로 리다이렉트
      if (err.response && err.response.status === 401) {
        console.log("인증이 만료되었습니다. 로그인 페이지로 이동합니다.");
        navigate('/login');
        return;
      }
      
      setError("할 일을 업데이트하는데 실패했습니다.");
    }
  };
  
  // 할 일 삭제
  const handleDelete = async () => {
    if (!window.confirm('정말로 이 할 일을 삭제하시겠습니까?')) {
      return;
    }
    
    try {
      console.log(`할 일 삭제 - ID: ${todoId}`);
      
      await todoAPI.deleteTodo(todoId);
      
      // 목록 페이지로 이동
      navigate('/study/todolist');
    } catch (err) {
      console.error("할 일 삭제 오류:", err);
      
      // 401 오류인 경우 로그인 페이지로 리다이렉트
      if (err.response && err.response.status === 401) {
        console.log("인증이 만료되었습니다. 로그인 페이지로 이동합니다.");
        navigate('/login');
        return;
      }
      
      setError("할 일을 삭제하는데 실패했습니다.");
    }
  };
  
  // toggleStatus 함수 수정
  const toggleStatus = async () => {
    try {
      console.log(`할 일 상태 토글 - ID: ${todoId}, 현재 상태: ${todo.isCompleted}`);
      
      // 요청 데이터 구성
      const updatedTodo = {
        todoId: todoId,
        userId: user.userId,
        content: todo.content,
        isCompleted: !todo.isCompleted
      };
      
      await todoAPI.updateTodoStatus(todoId, updatedTodo);
      
      // 상태 변경 후 목록 페이지로 이동
      console.log("상태 변경 완료, 목록 페이지로 이동합니다.");
      navigate('/study/todolist');
    } catch (err) {
      console.error("할 일 상태 변경 오류:", err);
      
      // 401 오류인 경우 로그인 페이지로 리다이렉트
      if (err.response && err.response.status === 401) {
        console.log("인증이 만료되었습니다. 로그인 페이지로 이동합니다.");
        navigate('/login');
        return;
      }
      
      setError("할 일 상태를 변경하는데 실패했습니다.");
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
  if (authLoading || loading) {
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
            onClick={() => navigate('/study/todolist')}
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-40 p-4">
      <div className="max-w-2xl mx-auto">
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
                    onClick={() => navigate('/study/todolist')}
                    className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                  &larr; 목록으로
                </button>
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
                    수정하기
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                  >
                    삭제하기
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