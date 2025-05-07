import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import workoutRecordAPI from '../../context/WorkoutRecordApi';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

const WorkoutRecord = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { darkMode, getColor } = useTheme();
  const navigate = useNavigate();

  // 시간 형식 변환 함수
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}시간 ${mins > 0 ? `${mins}분` : ''}`;
    }
    return `${mins}분`;
  };

  // 날짜 형식 변환 함수
  const formatDate = (dateString) => {
    if (!dateString) return "날짜 정보 없음";
    
    try {
      return format(new Date(dateString), 'yyyy년 MM월 dd일 (eee)', { locale: ko });
    } catch (error) {
      console.error("날짜 변환 오류:", error, dateString);
      return "유효하지 않은 날짜";
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      setLoading(true);
      if (!user?.userId) {
        console.error('사용자 정보가 없습니다.');
        setLoading(false);
        return;
      }
      
      const response = await workoutRecordAPI.getWorkoutRecordsByUser(user.userId);
      console.log("API 응답 데이터:", response.data);
      
      // 데이터 구조 분석을 위한 로그 추가
      console.log("첫 번째 데이터의 모든 키:", 
        response.data.length > 0 ? Object.keys(response.data[0]) : "데이터 없음");
  
      if (response.data.length > 0) {
        const firstItem = response.data[0];
        if (firstItem.workoutRecord) {
          console.log("workoutRecord 객체의 모든 키:", Object.keys(firstItem.workoutRecord));
        } else {
          console.log("중첩된 workoutRecord 객체 없음, 직접 데이터 구조:", firstItem);
        }
      }
      
      // ✅ workoutRecord 껍데기 벗기기
      const records = response.data.map(item => item.workoutRecord);
      console.log("껍데기 벗긴 데이터:", records);
      console.log("렌더링 전 데이터 길이:", records.length);
      
      setRecords(records);
    } catch (error) {
      console.error('운동 기록 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 추가 버튼 클릭 핸들러
  const handleAddRecord = () => {
    navigate('/workout/record/new');
  };


  const handleCardClick = (record) => {
    console.log('클릭한 레코드:', record);
    
    // workoutId로 변경
    const workoutId = record.workoutId;
    
    if (workoutId !== undefined && workoutId !== null) {
      console.log(`사용할 ID: ${workoutId}`);
      navigate(`/workout/record/${workoutId}`);
    } else {
      console.error('유효한 ID를 찾을 수 없음:', record);
      alert('유효한 기록 ID를 찾을 수 없습니다.');
    }
  };

  return (
    <div className={`container mx-auto px-4 py-8 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">운동 기록</h1>
        <button 
          onClick={handleAddRecord}
          className="px-4 py-2 text-white rounded transition-colors duration-300"
          style={{ backgroundColor: getColor('primary') }}
        >
          기록 추가
        </button>
      </div>
      
      {loading ? (
          <div className="flex justify-center p-12">
            <p>로딩 중...</p>
          </div>
        ) : records && records.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {console.log("렌더링 시도:", records)}
            {records.map((record, index) => (
              <div 
                key={record.workoutId || `record-${index}`}
                onClick={() => handleCardClick(record)}
                className={`w-full rounded-xl shadow-md p-4 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  darkMode 
                    ? 'bg-gray-800 hover:bg-gray-700 text-white' 
                    : 'bg-white hover:bg-gray-50 text-gray-800'
                }`}
              >
                <h3 className="text-lg font-semibold mb-1 truncate">{record.workoutType || "제목 없음"}</h3>
                <div className="text-sm font-medium mb-2 text-orange-500">
                  {`${formatDuration(record.duration || 0)} • ${record.calories || 0}kcal`}
                </div>
                <div className={`text-sm mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {record.memo ? (record.memo.length > 50 ? record.memo.substring(0, 50) + '...' : record.memo) : '메모 없음'}
                </div>
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {formatDate(record.workoutDate)}
                </div>
              </div>
            ))}
          </div>
        ) : (
        <div className="text-center py-12">
          <p className="text-lg">아직 기록이 없습니다. 첫 운동 기록을 추가해보세요!</p>
          <button 
            onClick={handleAddRecord}
            className="mt-4 px-4 py-2 text-white rounded transition-colors duration-300"
            style={{ backgroundColor: getColor('primary') }}
          >
            기록 추가하기
          </button>
        </div>
      )}
    </div>
  );
};

export default WorkoutRecord;