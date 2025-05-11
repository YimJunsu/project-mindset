// src/pages/workout/WorkoutPostCreatePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import workoutPostAPI from '../../context/WorkoutPostApi';
import { colors } from '../../styles/colors';

const WorkoutPostCreatePage = () => {
  const { user, isAuthenticated } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    workoutCategory: '헬스'
  });
  
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 이미지 선택 핸들러
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      setFile(null);
      setImagePreview(null);
      return;
    }
    
    // 이미지 파일인지 확인
    if (!selectedFile.type.startsWith('image/')) {
      setError('이미지 파일만 업로드 가능합니다.');
      return;
    }
    
    setFile(selectedFile);
    
    // 이미지 미리보기 생성
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('로그인이 필요한 기능입니다.');
      navigate('/login');
      return;
    }
    
    if (!formData.title.trim()) {
      setError('제목을 입력해주세요.');
      return;
    }
    
    if (!formData.content.trim()) {
      setError('내용을 입력해주세요.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await workoutPostAPI.createWorkoutPost(formData, file);
      navigate('/workout/post');
    } catch (err) {
      console.error('게시글 작성 중 오류 발생:', err);
      setError('게시글 작성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 카테고리 목록
  const categories = [
    '헬스', '러닝', '수영', '홈트', '요가', '필라테스', '기타'
  ];

  return (
    <div className={`min-h-screen p-4 pt-28 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          {/* 제목 입력 */}
          <div className="mb-4">
            <label className="block mb-2 font-medium" htmlFor="title">
              제목
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'
              }`}
              placeholder="제목을 입력하세요"
            />
          </div>
          
          {/* 카테고리 선택 */}
          <div className="mb-4">
            <label className="block mb-2 font-medium" htmlFor="workoutCategory">
              운동 종류
            </label>
            <select
              id="workoutCategory"
              name="workoutCategory"
              value={formData.workoutCategory}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'
              }`}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          {/* 내용 입력 */}
          <div className="mb-4">
            <label className="block mb-2 font-medium" htmlFor="content">
              내용
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="6"
              className={`w-full px-4 py-2 rounded-lg border ${
                darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'
              }`}
              placeholder="오늘 운동한 내용을 자유롭게 공유해보세요!"
            ></textarea>
          </div>
          
          {/* 이미지 업로드 */}
          <div className="mb-6">
            <label className="block mb-2 font-medium">
              인증 이미지 (선택사항)
            </label>
            <div className="flex items-center gap-4">
              <label 
                className={`px-4 py-2 rounded-lg border cursor-pointer text-center ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' 
                    : 'bg-white border-gray-300 hover:bg-gray-100'
                }`}
              >
                이미지 선택
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <span className="text-sm">
                {file ? file.name : '선택된 파일 없음'}
              </span>
            </div>
            
            {/* 이미지 미리보기 */}
            {imagePreview && (
              <div className="mt-4 relative">
                <img
                  src={imagePreview}
                  alt="미리보기"
                  className="w-full max-h-64 object-contain rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setImagePreview(null);
                  }}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
          </div>
          
          {/* 에러 메시지 */}
          {error && (
            <div className="text-red-500 mb-4 p-3 bg-red-100 rounded-lg">
              {error}
            </div>
          )}
          
          {/* 버튼 영역 */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg shadow transition"
              style={{ backgroundColor: loading ? '#ccc' : colors.primary.main }}
            >
              {loading ? '처리 중...' : '게시글 작성'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/workout/post')}
              className={`px-6 py-3 rounded-lg shadow transition ${
                darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'
              }`}
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkoutPostCreatePage;