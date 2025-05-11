// src/pages/workout/WorkoutPostDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import workoutPostAPI from '../../context/WorkoutPostApi';
import { getWorkoutPostImageUrl } from '../../utils/imageUtils';
import { colors } from '../../styles/colors';
import WorkoutPostEditForm from '../../components/workout/WorkoutPostEditForm';

const WorkoutPostDetailPage = () => {
  const { postId } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // 게시글 상세 정보 로드
  const loadPostDetail = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await workoutPostAPI.getWorkoutPostDetail(postId);
      setPost(response.data);
      setLikeCount(response.data.workoutPost.likeCount);
      setIsLiked(response.data.likedByUser);
    } catch (err) {
      console.error('게시글 상세 정보 로드 중 오류 발생:', err);
      setError('게시글을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 게시글 좋아요 토글
  const handleLikeToggle = async () => {
    if (!isAuthenticated) {
      alert('로그인이 필요한 기능입니다.');
      navigate('/login');
      return;
    }
    
    try {
      const response = await workoutPostAPI.toggleLike(postId);
      setIsLiked(response.data.isLiked);
      setLikeCount(response.data.likeCount);
    } catch (err) {
      console.error('좋아요 처리 중 오류 발생:', err);
      alert('좋아요 처리 중 오류가 발생했습니다.');
    }
  };

  // 게시글 삭제
  const handleDelete = async () => {
    if (confirmDelete) {
      try {
        await workoutPostAPI.deleteWorkoutPost(postId);
        navigate('/workout/post');
      } catch (err) {
        console.error('게시글 삭제 중 오류 발생:', err);
        alert('게시글 삭제 중 오류가 발생했습니다.');
      }
    } else {
      setConfirmDelete(true);
      // 5초 후 삭제 확인 상태 리셋
      setTimeout(() => setConfirmDelete(false), 5000);
    }
  };

  // 초기 로드
  useEffect(() => {
    loadPostDetail();
  }, [postId]);

  // 수정 완료 후 처리
  const handleEditComplete = (updatedPost) => {
    setPost(updatedPost);
    setEditing(false);
  };

  // 로딩 중 표시
  if (loading) {
    return (
      <div className={`min-h-screen p-4 flex items-center justify-center ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4">게시글 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 표시
  if (error) {
    return (
      <div className={`min-h-screen p-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="max-w-3xl mx-auto">
          <div className="text-red-500 p-4 bg-red-100 rounded-lg">
            <p>{error}</p>
            <button 
              onClick={() => navigate('/workout/post')}
              className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg"
            >
              목록으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 게시글이 없을 때
  if (!post) {
    return (
      <div className={`min-h-screen p-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center p-8 border rounded-lg shadow-sm">
            <p className="text-xl">게시글을 찾을 수 없습니다.</p>
            <button 
              onClick={() => navigate('/workout/post')}
              className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg"
            >
              목록으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 현재 로그인한 사용자가 작성자인지 확인
  const isAuthor = isAuthenticated && user && user.userId === post.workoutPost.userId;

  return (
    <div className={`min-h-screen p-4 pt-28 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-3xl mx-auto">
        {/* 편집 모드 */}
        {editing ? (
          <WorkoutPostEditForm 
            post={post} 
            onCancel={() => setEditing(false)} 
            onComplete={handleEditComplete}
          />
        ) : (
          <>
            {/* 상단 메뉴 */}
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => navigate('/workout/post')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                목록으로
              </button>
              
              {isAuthor && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditing(true)}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                  >
                    수정
                  </button>
                  <button
                    onClick={handleDelete}
                    className={`px-4 py-2 rounded-lg ${
                      confirmDelete 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : 'bg-red-500 hover:bg-red-600'
                    } text-white`}
                  >
                    {confirmDelete ? '정말 삭제하시겠습니까?' : '삭제'}
                  </button>
                </div>
              )}
            </div>
            
            {/* 게시글 헤더 */}
            <div className={`mb-6 p-4 rounded-lg border ${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="inline-block px-3 py-1 text-sm rounded-full bg-orange-100 text-orange-600 mb-2">
                    {post.workoutPost.workoutCategory || '기타'}
                  </span>
                  <h1 className="text-2xl font-bold">{post.workoutPost.title}</h1>
                </div>
                
                {/* 좋아요 버튼 (자신의 글이 아닌 경우만) */}
                {!isAuthor && isAuthenticated && (
                  <button 
                    onClick={handleLikeToggle}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg transition ${
                      isLiked 
                        ? 'bg-red-500 text-white'
                        : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={isLiked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isLiked ? 0 : 2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>{likeCount}</span>
                  </button>
                )}
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  작성자: {post.authorName || '알 수 없음'}
                </span>
                <div className="flex items-center gap-4">
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {post.workoutPost.viewCount}
                  </span>
                  {isAuthor && (
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {likeCount}
                    </span>
                  )}
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {new Date(post.workoutPost.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            
            {/* 이미지 */}
            {post.workoutPost.imageUrl && (
              <div className="mb-6">
                <img 
                  src={getWorkoutPostImageUrl(post.workoutPost.imageUrl)}
                  alt={post.workoutPost.title}
                  className="w-full max-h-96 object-contain rounded-lg border shadow-sm"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder-image.png';
                  }}
                />
              </div>
            )}
            
            {/* 내용 */}
            <div className={`mb-6 p-6 rounded-lg border whitespace-pre-line ${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <p>{post.workoutPost.content}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WorkoutPostDetailPage;