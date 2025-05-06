// src/pages/study/todolist.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import todoAPI from '../../context/todoAPI';
import TodoItem from '../../components/todo/TodoItem';
import TodoForm from '../../components/todo/TodoForm';
import TodoFilter from '../../components/todo/TodoFilter';

const Todolist = () => {
  // 사용자 정보와 테마 색상 가져오기
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const { getColor } = useTheme();
  const navigate = useNavigate();

  // 상태 관리
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  // 컴포넌트 마운트 시 인증 확인 및 할 일 목록 가져오기
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
        console.log(`사용자 ID: ${user.userId}로 할 일 목록 조회 시작`);
        fetchTodos();
      } else {
        console.log("사용자 정보가 없습니다.");
        setLoading(false);
        setError("사용자 정보를 불러올 수 없습니다.");
      }
    }
  }, [user, authLoading, isAuthenticated, navigate]);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      console.log(`할 일 목록 조회 - 사용자 ID: ${user.userId}`);
      
      const response = await todoAPI.getTodosByUser(user.userId);
      console.log("할 일 목록 응답:", response.data);
      
      // ✅ todolist 껍데기 벗기기
      const todos = response.data.map(item => item.todolist);
      
      setTodos(todos);
      setError(null);
    } catch (err) {
      console.error("할 일 목록 조회 오류:", err);
      
      if (err.response && err.response.status === 401) {
        console.log("인증이 만료되었습니다. 로그인 페이지로 이동합니다.");
        navigate('/login');
        return;
      }
      
      setError("할 일 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };  

  // 할 일 추가
  const addTodo = async (content) => {
    try {
      if (!user || !user.userId) {
        setError("사용자 정보를 불러올 수 없습니다.");
        return;
      }
      
      console.log("할 일 추가 시작:", content);
      
      // 요청 데이터 구성
      const todoData = {
        userId: user.userId,
        content: content,
        isCompleted: false
      };
      
      console.log("할 일 추가 요청 데이터:", todoData);
      
      const response = await todoAPI.createTodo(todoData);
      console.log("할 일 추가 응답:", response.data);
      
      // 할 일 목록 새로고침
      fetchTodos();
    } catch (err) {
      console.error("할 일 추가 오류:", err);
      
      // 401 오류인 경우 로그인 페이지로 리다이렉트
      if (err.response && err.response.status === 401) {
        console.log("인증이 만료되었습니다. 로그인 페이지로 이동합니다.");
        navigate('/login');
        return;
      }
      
      setError("할 일을 추가하는데 실패했습니다.");
    }
  };

  // 할 일 상태 토글 (완료/미완료)
  const toggleTodoStatus = async (todo) => {
    try {
      console.log(`할 일 상태 토글 - ID: ${todo.todoId}, 현재 상태: ${todo.isCompleted}`);
      
      // 요청 데이터 구성
      const updatedTodo = {
        todoId: todo.todoId,
        userId: user.userId,
        content: todo.content,
        isCompleted: !todo.isCompleted
      };
      
      await todoAPI.updateTodoStatus(todo.todoId, updatedTodo);
      
      // 할 일 목록 새로고침
      fetchTodos();
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

  // 할 일 삭제
  const deleteTodo = async (todoId) => {
    try {
      console.log(`할 일 삭제 - ID: ${todoId}`);
      
      await todoAPI.deleteTodo(todoId);
      
      // 할 일 목록 새로고침
      fetchTodos();
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

  // 할 일 상세 페이지로 이동
  const viewTodoDetail = (todoId) => {
    navigate(`/study/todo/detail/${todoId}`);
  };

  // 필터링된 할 일 목록
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.isCompleted;
    if (filter === 'completed') return todo.isCompleted;
    return true; // 'all'인 경우 모든 항목 표시
  });

  // 로딩 중일 때 표시할 UI
  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-40 p-4">

      <div className="max-w-4xl mx-auto">
        {/* 오류 메시지 */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {/* 할 일 추가 폼 */}
        <TodoForm onAddTodo={addTodo} getColor={getColor} />
        
        {/* 필터 */}
        <div className="mt-6">
          <TodoFilter currentFilter={filter} onFilterChange={setFilter} getColor={getColor} />
        </div>
        
        {/* 할 일 목록 */}
        <div className="mt-6 space-y-4">
          {filteredTodos.length === 0 ? (
            <p className="text-center text-gray-500 pt-20 dark:text-gray-400">오늘의 계획을 세워보세요!</p>
          ) : (
            filteredTodos.map(todo => (
              <TodoItem 
                key={todo.todoId} 
                todo={todo} 
                onToggleStatus={() => toggleTodoStatus(todo)} 
                onDelete={() => deleteTodo(todo.todoId)}
                onViewDetail={() => viewTodoDetail(todo.todoId)}
                getColor={getColor}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Todolist;