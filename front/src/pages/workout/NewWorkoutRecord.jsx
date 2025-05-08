import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import workoutRecordAPI from '../../context/WorkoutRecordApi';

const workoutTypes = [
  '유산소', '근력 운동', '요가', '필라테스', '걷기/산책', 
  '달리기', '수영', '자전거', '등산', '축구', '농구', '테니스',
  '기타'
];

const NewWorkoutRecord = () => {
  const { user } = useAuth();
  const { darkMode, getColor } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    workoutType: '유산소',
    duration: 60,
    calories: 200,
    workoutDate: new Date().toISOString().slice(0, 10),
    memo: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const workoutData = {
        userId: user.userId,
        workoutType: formData.workoutType,
        duration: parseInt(formData.duration, 10),
        calories: parseInt(formData.calories, 10),
        workoutDate: new Date(formData.workoutDate).toISOString(),
        memo: formData.memo,
        createdAt: new Date().toISOString()
      };
      
      await workoutRecordAPI.createWorkoutRecord(workoutData);
      navigate('/workout/record');
    } catch (err) {
      console.error('운동 기록 생성 실패:', err);
      setError('운동 기록 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 p-4">
      <div className={`max-w-3xl mx-auto p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
        <div className="mb-6 border-b pb-4 border-gray-300 dark:border-gray-700">
          <h1 className="text-2xl font-bold">새 운동 기록</h1>
        </div>

        {error && (
          <div className="bg-red-200 text-red-800 px-4 py-3 rounded mb-6 dark:bg-red-600 dark:text-white">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">운동 유형</label>
            <select
              name="workoutType"
              value={formData.workoutType}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {workoutTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">운동 시간 (분)</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                min="1"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">소모 칼로리 (kcal)</label>
              <input
                type="number"
                name="calories"
                value={formData.calories}
                onChange={handleChange}
                min="0"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">운동 날짜</label>
            <input
              type="date"
              name="workoutDate"
              value={formData.workoutDate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">메모</label>
            <textarea
              name="memo"
              value={formData.memo}
              onChange={handleChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="운동 내용이나 메모를 입력하세요."
            ></textarea>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/workout/record')}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 text-white rounded transition-colors duration-300 disabled:opacity-50 ${
                loading ? 'cursor-not-allowed' : 'hover:opacity-90'
              }`}
              style={{ backgroundColor: getColor('primary') }}
            >
              {loading ? '저장 중...' : '저장하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewWorkoutRecord;
