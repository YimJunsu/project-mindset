// src/context/StudyRecordApi.jsx
import api from "./apiService";

const studyRecordAPI = {
  createStudyRecord: (studyRecordData) => {
    console.log(`공부 기록 추가 API 호출 - 데이터:`, studyRecordData);
    return api.post('/studyrecord/save', studyRecordData);
  },
  getStudyRecordsByUser: (userId) => {
    console.log(`공부 기록 목록 API 호출 - 사용자 ID: ${userId}`);
    return api.get(`/studyrecord/${userId}`);
  },
  getStudyRecord: (recordId) => {
    console.log(`공부 기록 상세 API 호출 - ID: ${recordId}`);
    if (!recordId) {
      console.error('유효하지 않은 recordId:', recordId);
      return Promise.reject(new Error('유효한 기록 ID가 필요합니다.'));
    }
    return api.get(`/studyrecord/detail/${recordId}`);
  },
  deleteStudyRecord: (recordId) => {
    console.log(`공부 기록 삭제 API 호출 - ID: ${recordId}`);
    if (!recordId) {
      return Promise.reject(new Error('기록 ID가 필요합니다.'));
    }
    return api.delete(`/studyrecord/${recordId}`);
  }
};

export default studyRecordAPI;