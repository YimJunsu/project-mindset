// src/context/todoAPI.js
import api from './apiService';

// Todo 관련 API
const todoAPI = {
  // 할 일 목록 조회 (사용자별)
  getTodosByUser: (userId) => {
    console.log(`할 일 목록 API 호출 - 사용자 ID: ${userId}`);
    return api.get(`/todo/${userId}`);  // '/api' 접두사 제거
  },
  
  // 할 일 상세 조회
  getTodoDetail: (todoId) => {
    console.log(`할 일 상세 API 호출 - ID: ${todoId}`);
    return api.get(`/todo/detail/${todoId}`);  // '/api' 접두사 제거
  },
  
  // 할 일 생성
  createTodo: (todoData) => {
    console.log(`할 일 추가 API 호출 - 데이터:`, todoData);
    return api.post('/todo/save', todoData);  // '/api' 접두사 제거
  },
  
  // 할 일 상태 업데이트 (완료/미완료 토글 등)
  updateTodoStatus: (todoId, todoData) => {
    console.log(`할 일 상태 업데이트 API 호출 - ID: ${todoId}, 데이터:`, todoData);
    return api.put(`/todo/status/${todoId}`, todoData);  // '/api' 접두사 제거
  },
  
  // 할 일 삭제
  deleteTodo: (todoId) => {
    console.log(`할 일 삭제 API 호출 - ID: ${todoId}`);
    return api.delete(`/todo/${todoId}`);  // '/api' 접두사 제거
  }
};

export default todoAPI;