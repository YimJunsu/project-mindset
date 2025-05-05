import React, { useState, useEffect } from 'react';

const Timer = () => {
  // 타이머 상태: 시간이 초 단위로 관리됨
  const [time, setTime] = useState(0); // 타이머 시간 (초 단위)
  const [isActive, setIsActive] = useState(false); // 타이머가 실행 중인지 여부
  const [mode, setMode] = useState('countup'); // 타이머 모드 ('countup' : 증가 타이머, 'countdown' : 50분 타이머)

  // 타이머 시작/일시정지 함수
  const toggleTimer = () => {
    setIsActive(!isActive); // 현재 상태를 반전시켜 실행/정지
  };

  // 타이머 리셋 함수
  const resetTimer = () => {
    setIsActive(false); // 타이머 정지
    setTime(mode === 'countdown' ? 50 * 60 : 0); // 모드에 따라 초기화 (50분 또는 0초)
  };

  // 모드 변경 함수 (시간 측정 모드, 50분 집중 모드)
  const changeMode = (newMode) => {
    setMode(newMode); // 새 모드로 변경
    setIsActive(false); // 타이머 정지
    setTime(newMode === 'countdown' ? 50 * 60 : 0); // 모드에 맞게 시간 설정
  };

  // 타이머 상태 변화 시마다 실행되는 useEffect
  useEffect(() => {
    let interval;

    if (isActive) {
      // 타이머가 활성화되면
      if (mode === 'countdown' && time > 0) {
        interval = setInterval(() => {
          setTime((prevTime) => prevTime - 1); // 50분 타이머는 시간이 줄어듬
        }, 1000);
      } else if (mode === 'countup') {
        interval = setInterval(() => {
          setTime((prevTime) => prevTime + 1); // 카운트업 모드는 시간이 증가
        }, 1000);
      }
    }

    // 타이머가 멈추면 interval 정리
    if (!isActive && interval) {
      clearInterval(interval);
    }

    // 타이머가 0초에 도달하면 멈추고 알림창 띄우기
    if (mode === 'countdown' && time === 0) {
      clearInterval(interval);
      alert("타이머가 끝났습니다, 쉬었다가 하세요!"); // 타이머 끝나면 알림창 표시
    }

    return () => {
      if (interval) clearInterval(interval); // 컴포넌트가 사라질 때 interval 정리
    };
  }, [isActive, time, mode]); // isActive, time, mode가 바뀔 때마다 실행

  // 시간을 hh:mm:ss 형식으로 포맷하는 함수
  const formatTime = (time) => {
    const hours = Math.floor(time / 3600); // 시간 계산
    const minutes = Math.floor((time % 3600) / 60); // 분 계산
    const seconds = time % 60; // 초 계산
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* 모드 선택 버튼 */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => changeMode('countup')}
          className={`px-8 py-4 rounded-lg text-xl ${
            mode === 'countup' ? 'bg-blue-500' : 'bg-gray-300'
          } hover:bg-blue-600 text-white`}
        >
          시간 측정
        </button>
        <button
          onClick={() => changeMode('countdown')}
          className={`px-8 py-4 rounded-lg text-xl ${
            mode === 'countdown' ? 'bg-orange-500' : 'bg-gray-300'
          } hover:bg-orange-600 text-white`}
        >
          50분 집중하기
        </button>
      </div>

      {/* 타이머 시간 표시 */}
      <h2 className="text-4xl font-mono mb-6">{formatTime(time)}</h2>

      <div className="flex gap-4">
        {/* 타이머 시작/일시정지 버튼 */}
        <button
          onClick={toggleTimer}
          className="px-8 py-4 bg-green-500 text-white rounded-lg text-2xl hover:bg-green-600 transition"
        >
          {isActive ? '정지' : '시작'}
        </button>
        {/* 타이머 리셋 버튼 */}
        <button
          onClick={resetTimer}
          className="px-8 py-4 bg-red-500 text-white rounded-lg text-2xl hover:bg-red-600 transition"
        >
          초기화
        </button>
      </div>
    </div>
  );
};

export default Timer;
