// src/pages/workout/WorkoutPostListPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import workoutPostAPI from '../../context/WorkoutPostApi';
import { getWorkoutPostImageUrl } from '../../utils/imageUtils';
import { colors } from '../../styles/colors';
import WorkoutPostCard from '../../components/workout/WorkoutPostCard';
import CategoryFilter from '../../components/workout/CategoryFilter';

const WorkoutPostListPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastPostId, setLastPostId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isPopular, setIsPopular] = useState(false);
  
  const observer = useRef();
  const lastPostElementRef = useRef();

  // 게시글 로드 함수
  const loadPosts = async (reset = false) => {
    if (loading || (!hasMore && !reset)) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // 초기화 시 lastPostId를 null로 설정
      const currentLastPostId = reset ? null : lastPostId;
      
      let response;
      if (isPopular) {
        response = await workoutPostAPI.getPopularWorkoutPosts(currentLastPostId);
      } else {
        response = await workoutPostAPI.getWorkoutPosts(currentLastPostId, 10, selectedCategory);
      }
      
      const newPosts = response.data.posts;
      
      setPosts(prev => reset ? newPosts : [...prev, ...newPosts]);
      setHasMore(response.data.hasNext);
      setLastPostId(response.data.lastPostId);
    } catch (err) {
      console.error('게시글 로드 중 오류 발생:', err);
      setError('게시글을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 초기 로드 및 필터 변경 시 데이터 로드
  useEffect(() => {
    loadPosts(true);
  }, [selectedCategory, isPopular]);

  // 무한 스크롤 관찰자 설정
  useEffect(() => {
    if (loading) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadPosts();
      }
    });
    
    if (lastPostElementRef.current) {
      observer.current.observe(lastPostElementRef.current);
    }
    
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [loading, hasMore, posts]);

  // 카테고리 변경 핸들러
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // 인기 게시글 토글 핸들러
  const togglePopular = () => {
    setIsPopular(prev => !prev);
  };

  // 게시글 작성 페이지로 이동
  const handleCreatePost = () => {
    if (!isAuthenticated) {
      alert('로그인이 필요한 기능입니다.');
      navigate('/login');
      return;
    }
    navigate('/workout/post/create');
  };

  return (
    <div className={`min-h-screen p-4 pt-28 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-4xl mx-auto">

        {/* 필터 영역 */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <CategoryFilter 
            selectedCategory={selectedCategory} 
            onSelectCategory={handleCategoryChange} 
          />
          <button
            className={`px-4 py-2 rounded-lg transition ${
              isPopular 
                ? 'bg-orange-500 text-white' 
                : darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-700'
            }`}
            onClick={togglePopular}
          >
            {isPopular ? '인기 게시글 보는 중' : '인기 게시글 보기'}
          </button>
          <button
            onClick={handleCreatePost}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg shadow transition"
            style={{ backgroundColor: colors.primary.main }}
          >
            운동 인증하기
          </button>
        </div>

        {/* 게시글 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map((post, index) => (
            <div 
              key={post.workoutPost.postId}
              ref={index === posts.length - 1 ? lastPostElementRef : null}
            >
              <WorkoutPostCard post={post} />
            </div>
          ))}
        </div>

        {/* 로딩 상태 */}
        {loading && (
          <div className="text-center my-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-2">게시글을 불러오는 중...</p>
          </div>
        )}

        {/* 에러 메시지 */}
        {error && (
          <div className="text-red-500 text-center my-4 p-4 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        {/* 결과 없음 메시지 */}
        {!loading && posts.length === 0 && (
          <div className="text-center my-8 p-6 border rounded-lg shadow-sm">
            <p className="text-xl">게시글이 없습니다. 첫 번째 인증을 작성해보세요!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutPostListPage;