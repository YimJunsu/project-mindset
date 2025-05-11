// src/context/WorkoutPostApi.jsx
import api from "./apiService";

const workoutPostAPI = {
  // 게시글 생성 (파일 업로드 포함)
  createWorkoutPost: (postData, file) => {
    console.log(`운동 인증 게시글 추가 API 호출 - 데이터:`, postData);
    
    const formData = new FormData();
    formData.append('post', new Blob([JSON.stringify(postData)], { type: 'application/json' }));
    
    if (file) {
      formData.append('file', file);
    }

    return api.post('/workoutpost/save', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  // 전체 게시글 목록 (무한 스크롤)
  getWorkoutPosts: (lastPostId, size = 10, category) => {
    console.log(`운동 인증 게시글 목록 API 호출 - 마지막ID: ${lastPostId}, 크기: ${size}, 카테고리: ${category}`);
    let url = `/workoutpost/list?size=${size}`;
    
    if (lastPostId) {
      url += `&lastPostId=${lastPostId}`;
    }
    
    if (category) {
      url += `&category=${encodeURIComponent(category)}`;
    }
    
    return api.get(url);
  },
  
  // 인기 게시글 목록 (좋아요 많은 순)
  getPopularWorkoutPosts: (lastPostId, size = 10) => {
    console.log(`인기 운동 인증 게시글 목록 API 호출 - 마지막ID: ${lastPostId}, 크기: ${size}`);
    let url = `/workoutpost/popular?size=${size}`;
    
    if (lastPostId) {
      url += `&lastPostId=${lastPostId}`;
    }
    
    return api.get(url);
  },
  
  // 내가 쓴 게시글 목록
  getUserWorkoutPosts: (userId, lastPostId, size = 10) => {
    console.log(`사용자 운동 인증 게시글 목록 API 호출 - 사용자ID: ${userId}, 마지막ID: ${lastPostId}`);
    let url = `/workoutpost/user/${userId}?size=${size}`;
    
    if (lastPostId) {
      url += `&lastPostId=${lastPostId}`;
    }
    
    return api.get(url);
  },
  
  // 게시글 상세 조회
  getWorkoutPostDetail: (postId) => {
    console.log(`운동 인증 게시글 상세 API 호출 - ID: ${postId}`);
    return api.get(`/workoutpost/detail/${postId}`);
  },
  
  // 게시글 수정
  updateWorkoutPost: (postId, postData, file) => {
    console.log(`운동 인증 게시글 수정 API 호출 - ID: ${postId}, 데이터:`, postData);
    
    const formData = new FormData();
    formData.append('post', new Blob([JSON.stringify(postData)], { type: 'application/json' }));
    
    if (file) {
      formData.append('file', file);
    }

    return api.put(`/workoutpost/update/${postId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  // 게시글, 삭제
  deleteWorkoutPost: (postId) => {
    console.log(`운동 인증 게시글 삭제 API 호출 - ID: ${postId}`);
    return api.delete(`/workoutpost/${postId}`);
  },

  // 좋아요 토글 (추가/취소)
  toggleLike: (postId) => {
    console.log(`게시글 좋아요 토글 API 호출 - ID: ${postId}`);
    return api.post(`/post-likes`, { postId });
  },
  
  // 좋아요 상태 확인
  getLikeStatus: (postId) => {
    console.log(`게시글 좋아요 상태 확인 API 호출 - ID: ${postId}`);
    return api.get(`/post-likes/status/${postId}`);
  }
};

export default workoutPostAPI;