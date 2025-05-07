// src/context/WorkoutRecordApi.jsx
import api from "./apiService";

const workoutRecordAPI = {
  createWorkoutRecord: (workoutRecordData) => {
    console.log(`운동 기록 추가 API 호출 - 데이터:`, workoutRecordData);
    return api.post('/workoutrecord/save', workoutRecordData);
  },
  getWorkoutRecordsByUser: (userId) => {
    console.log(`운동 기록 목록 API 호출 - 사용자 ID: ${userId}`);
    return api.get(`/workoutrecord/${userId}`);
  },
  getWorkoutRecord: (workoutId ) => {
    console.log(`운동 기록 상세 API 호출 - ID: ${workoutId }`);
    return api.get(`/workoutrecord/detail/${workoutId }`);
  },
  deleteWorkoutRecord: (workoutId ) => {
    console.log(`운동 기록 삭제 API 호출 - ID: ${workoutId }`);
    return api.delete(`/workoutrecord/${workoutId }`);
  }
};

export default workoutRecordAPI;