// src/pages/study/todolist.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import api from '../../context/apiService';
import TodoItem from '../../components/todo/TodoItem';
import TodoForm from '../../components/todo/TodoForm';
import TodoFilter from '../../components/todo/TodoFilter';

const Todolist = () => {
  // 사용자 정보와 테마 색상 가져오기
  const { user } = useAuth();
  const { getColor } = useTheme();
  const navigate = useNavigate();

  // 상태 관리
  const [todos, setTodos] = useState([]); // 할 일 목록
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 오류 메시지
  const [filter, setFilter] = useState('all'); // 필터 ('all', 'active', 'completed')
  
  // 컴포넌트가 마운트되거나 user가 변경될 때 할 일 목록 가져오기
  useEffect(() => {
    if (user && user.id) {
      fetchTodos();
    }
  }, [user]);

  // 할 일 목록 가져오기 API 호출
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/todo/${user.id}`);
      setTodos(response.data);
      setError(null);
    } catch (err) {
      console.error('Todo 목록 조회 오류:', err);
      setError('할 일 목록을 불러오는데 실패했습니다!');
    } finally {
      setLoading(false);
    }
  };

  // 새 할 일 추가
  const addTodo = async (newTodo) => {
    try {
      const todoData = {
        userId: user.id,
        content: newTodo.content,
        isCompleted: false
      };

      const response = await api.post('/todo/save', todoData);
      setTodos([...todos, response.data]); // 기존 목록에 새 할 일 추가
    } catch (err) {
      console.error('Todo 추가 오류:', err);
      setError('할 일을 추가하는데 실패했습니다!');
    }
  };

  // 할 일 완료/미완료 상태 토글
  const toggleTodoStatus = async (todo) => {
    try {
      const updatedTodo = {
        ...todo,
        isCompleted: !todo.isCompleted,
        completedAt: !todo.isCompleted ? new Date().toISOString() : null
      };
      
      await api.put(`/todo/status/${todo.todoId}`, updatedTodo);
      
      // 상태 업데이트
      setTodos(todos.map(t => 
        t.todoId === todo.todoId ? updatedTodo : t
      ));
    } catch (err) {
      console.error('Todo 상태 변경 오류:', err);
      setError('할 일 상태를 변경하는데 실패했습니다.');
    }
  };

  // 할 일 삭제
  const deleteTodo = async (todoId) => {
    try {
      await api.delete(`/todo/${todoId}`);
      // 삭제된 할 일을 제외한 목록으로 상태 업데이트
      setTodos(todos.filter(todo => todo.todoId !== todoId));
    } catch (err) {
      console.error('Todo 삭제 오류:', err);
      setError('할 일을 삭제하는데 실패했습니다.');
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
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          할 일 목록
        </h1>
        
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
            <p className="text-center text-gray-500 dark:text-gray-400">할 일이 없습니다.</p>
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