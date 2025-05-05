// todoAPI.js (context/todoAPI.js 위치에 새로 생성)
import api from './apiService';

// Todo 관련 API
export const todoAPI = {
  // 할 일 목록 조회 (사용자별)
  getTodosByUser: (userId) => 
    api.get(`/todo/${userId}`),
  
  // 할 일 상세 조회
  getTodoDetail: (todoId) => 
    api.get(`/todo/detail/${todoId}`),
  
  // 할 일 생성
  createTodo: (todoData) => 
    api.post('/todo/save', todoData),
  
  // 할 일 상태 업데이트 (완료/미완료 토글 등)
  updateTodoStatus: (todoId, todoData) => 
    api.put(`/todo/status/${todoId}`, todoData),
  
  // 할 일 삭제
  deleteTodo: (todoId) => 
    api.delete(`/todo/${todoId}`),
};

export default todoAPI;