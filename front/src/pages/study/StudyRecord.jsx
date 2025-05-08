  // src/pages/study/StudyRecord.jsx
  import React, { useState, useEffect } from 'react';
  import { useNavigate } from 'react-router-dom';
  import { useAuth } from '../../context/AuthContext';
  import { useTheme } from '../../context/ThemeContext';
  import studyRecordAPI from '../../context/studyRecodeApi';
  import { format } from 'date-fns';
  import { ko } from 'date-fns/locale';

  const StudyRecord = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { darkMode, getColor } = useTheme();
    const navigate = useNavigate();

    // 시간 형식 변환 함수 - 먼저 선언
    const formatDuration = (minutes) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      
      if (hours > 0) {
        return `${hours}시간 ${mins > 0 ? `${mins}분` : ''}`;
      }
      return `${mins}분`;
    };

    // 날짜 형식 변환 함수 - 먼저 선언
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
        
        const response = await studyRecordAPI.getStudyRecordsByUser(user.userId);
        console.log("API 응답 데이터:", response.data);
        
        // ✅ studyRecord 껍데기 벗기기
        const records = response.data.map(item => item.studyRecord);
        console.log("껍데기 벗긴 데이터:", records);
        
        setRecords(records);
      } catch (error) {
        console.error('공부 기록 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    // 추가 버튼 클릭 핸들러
    const handleAddRecord = () => {
      navigate('/study/record/new');
    };

    const handleCardClick = (record) => {
      console.log('클릭한 레코드:', record);
      
      // 레코드 ID 추출
      const recordId = record.recordId;
      console.log('클릭한 기록 ID:', recordId);
      
      if (recordId) {
        navigate(`/study/record/${recordId}`);
      } else {
        alert('유효한 기록 ID를 찾을 수 없습니다.');
      }
    };

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8 border-b pb-4 border-gray-300 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">공부 기록</h1>
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
              <p className="text-gray-600 dark:text-gray-300">로딩 중...</p>
            </div>
          ) : records && records.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {records.map((record, index) => (
                <div 
                  key={record.recordId || `record-${index}`}
                  onClick={() => handleCardClick(record)}
                  className={`w-full rounded-xl shadow-md p-4 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    darkMode 
                      ? 'bg-gray-800 hover:bg-gray-700 text-white' 
                      : 'bg-white hover:bg-gray-50 text-gray-800'
                  }`}
                >
                  <h3 className="text-lg font-semibold mb-1 truncate">{record.subject || "제목 없음"}</h3>
                  <div className="text-sm font-medium mb-2 text-orange-500">
                    {formatDuration(record.duration || 0)}
                  </div>
                  <div className={`text-sm mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {record.memo ? (record.memo.length > 50 ? record.memo.substring(0, 50) + '...' : record.memo) : '메모 없음'}
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {formatDate(record.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-700 dark:text-gray-300">
                아직 기록이 없습니다. 첫 공부 기록을 추가해보세요!
              </p>
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
      </div>
    );  
  };

  export default StudyRecord;