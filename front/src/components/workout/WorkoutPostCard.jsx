// src/components/workout/WorkoutPostCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { getWorkoutPostImageUrl } from '../../utils/imageUtils';

const WorkoutPostCard = ({ post }) => {
  const { darkMode } = useTheme();
  
  // 게시글 내용 일부만 보여주기 (최대 100자)
  const truncateContent = (content) => {
    if (!content) return '';
    return content.length > 100 ? content.substring(0, 97) + '...' : content;
  };

  return (
    <Link to={`/workout/post/${post.workoutPost.postId}`}>
      <div 
        className={`border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}
      >
        {/* 이미지가 있으면 표시 */}
        {post.workoutPost.imageUrl && (
          <div className="relative h-48 overflow-hidden">
            <img 
              src={getWorkoutPostImageUrl(post.workoutPost.imageUrl)}
              alt={post.workoutPost.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/placeholder-image.png';
              }}
            />
          </div>
        )}
        
        <div className="p-4">
          {/* 카테고리 */}
          <div className="flex items-center mb-2">
            <span className="inline-block px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-600">
              {post.workoutPost.workoutCategory || '기타'}
            </span>
          </div>
          
          {/* 제목 */}
          <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {post.workoutPost.title}
          </h3>
          
          {/* 내용 미리보기 */}
          <p className={`text-sm mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {truncateContent(post.workoutPost.content)}
          </p>
          
          {/* 작성자 및 메타 정보 */}
          <div className="flex justify-between items-center text-xs">
            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
              작성자: {post.authorName || '알 수 없음'}
            </span>
            <div className="flex items-center gap-3">
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {post.workoutPost.viewCount}
              </span>
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {post.workoutPost.likeCount}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default WorkoutPostCard;