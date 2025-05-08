// src/context/MemoAPI.jsx
import api from './apiService';

// 메모 관련 API
const memoAPI = {
  // 메모 목록 조회 (사용자별)
  getMemosByUser: (userId) => {
    console.log(`메모 목록 API 호출 - 사용자 ID: ${userId}`);
    return api.get(`/memo/${userId}`);
  },
  
  // 메모 상세 조회
  getMemoDetail: (memoId) => {
    console.log(`메모 상세 API 호출 - ID: ${memoId}`);
    return api.get(`/memo/detail/${memoId}`);
  },
  
  // 메모 생성
  createMemo: (memoData) => {
    console.log(`메모 추가 API 호출 - 데이터:`, memoData);
    return api.post('/memo/save', memoData);
  },
  
  // 메모 수정
  updateMemo: (memoId, memoData) => {
    console.log(`메모 수정 API 호출 - ID: ${memoId}, 데이터:`, memoData);
    return api.put(`/memo/update/${memoId}`, memoData);
  },
  
  // 메모 삭제
  deleteMemo: (memoId) => {
    console.log(`메모 삭제 API 호출 - ID: ${memoId}`);
    return api.delete(`/memo/${memoId}`);
  }
};

export default memoAPI;