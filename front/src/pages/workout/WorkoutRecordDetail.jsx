import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import workoutRecordAPI from '../../context/WorkoutRecordApi';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

const WorkoutRecordDetail = () => {
  const { workoutId } = useParams();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { darkMode, getColor } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    loadRecord();
  }, [workoutId]);

  const loadRecord = async () => {
    try {
      setLoading(true);
      const response = await workoutRecordAPI.getWorkoutRecord(workoutId);
      const recordData = response.data.workoutRecord || response.data;
      if (!recordData) {
        setError('해당 ID의 운동 기록을 찾을 수 없습니다.');
        return;
      }
      setRecord(recordData);
    } catch (err) {
      console.error('운동 기록 조회 실패:', err);
      setError('운동 기록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('정말로 이 기록을 삭제하시겠습니까?')) return;
    try {
      await workoutRecordAPI.deleteWorkoutRecord(workoutId);
      navigate('/workout/record');
    } catch (err) {
      console.error('운동 기록 삭제 실패:', err);
      alert('기록 삭제에 실패했습니다.');
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}시간 ${mins > 0 ? `${mins}분` : ''}` : `${mins}분`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "날짜 정보 없음";
    try {
      return format(new Date(dateString), 'yyyy년 MM월 dd일 (eee)', { locale: ko });
    } catch (error) {
      console.error("날짜 변환 오류:", error, dateString);
      return "유효하지 않은 날짜";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-300">로딩 중...</p>
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 p-4">
        <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="text-center py-8">
            <p className="text-red-500 dark:text-red-400 mb-4">{error || '기록을 찾을 수 없습니다.'}</p>
            <button
              onClick={() => navigate('/workout/record')}
              className="px-4 py-2 text-white rounded"
              style={{ backgroundColor: getColor('primary') }}
            >
              돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 mt-24 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 border-b pb-4 border-gray-300 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {record.workoutType || '운동 종류 없음'}
          </h1>
        </div>

        <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
          <div className="space-y-4 mb-8">
            <InfoRow label="운동 시간" value={formatDuration(record.duration)} />
            <InfoRow label="소모 칼로리" value={`${record.calories} kcal`} />
            <InfoRow label="운동 날짜" value={formatDate(record.workoutDate)} />
            <InfoRow label="작성일" value={formatDate(record.createdAt)} />

            <div className="pt-4">
              <h2 className="text-md font-medium mb-2 text-gray-700 dark:text-gray-300">메모</h2>
              <div className={`p-4 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                {record.memo || '메모가 없습니다.'}
              </div>
            </div>
          </div>

          <div className="flex space-x-4 mt-8">
            <button
              onClick={() => navigate('/workout/record')}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600"
            >
              목록으로
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              삭제하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:items-center py-2">
    <span className="text-md font-medium mb-1 sm:mb-0 sm:w-1/3 text-gray-700 dark:text-gray-300">{label}</span>
    <span className="sm:w-2/3">{value}</span>
  </div>
);

export default WorkoutRecordDetail;
