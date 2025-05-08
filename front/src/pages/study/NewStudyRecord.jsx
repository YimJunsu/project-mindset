import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import studyRecordAPI from '../../context/studyRecodeApi';

const NewStudyRecord = () => {
  const { user } = useAuth();
  const { darkMode, getColor } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    subject: '',
    duration: 60,
    startTime: new Date().toISOString().slice(0, 16),
    endTime: new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16),
    memo: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateDuration = () => {
    const start = new Date(formData.startTime);
    const end = new Date(formData.endTime);
    const diffMs = end - start;
    const diffMinutes = Math.floor(diffMs / 60000);
    return diffMinutes > 0 ? diffMinutes : 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const duration = calculateDuration();
    if (duration <= 0) {
      setError('종료 시간은 시작 시간보다 이후여야 합니다.');
      return;
    }

    try {
      setLoading(true);

      const studyData = {
        userId: user.userId,
        subject: formData.subject,
        duration,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
        memo: formData.memo || '',
        createdAt: new Date().toISOString(),
      };

      await studyRecordAPI.createStudyRecord(studyData);
      navigate('/study/record');
    } catch (err) {
      console.error('공부 기록 생성 실패:', err);
      setError('공부 기록 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b pb-4 border-gray-300 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">새 공부 기록</h1>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form 
          onSubmit={handleSubmit} 
          className={`space-y-6 p-6 rounded-lg shadow-md ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}
        >
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              과목명
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="예: 수학, 영어, 프로그래밍 등"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                시작 시간
              </label>
              <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                종료 시간
              </label>
              <input
                type="datetime-local"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              학습 시간 (자동 계산)
            </label>
            <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-700 rounded-md bg-gray-100 dark:bg-gray-600">
              {formData.startTime && formData.endTime
                ? `${calculateDuration()}분`
                : '시작 및 종료 시간을 입력해주세요'}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              메모
            </label>
            <textarea
              name="memo"
              value={formData.memo}
              onChange={handleChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="학습 내용이나 메모를 입력하세요."
            ></textarea>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/study/record')}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-white rounded transition-colors duration-300 disabled:opacity-50"
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

export default NewStudyRecord;
