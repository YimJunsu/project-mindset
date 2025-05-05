// src/components/todo/TodoFilter.jsx
import React from 'react';

/**
 * 할 일 목록 필터링 컴포넌트
 * @param {string} currentFilter - 현재 선택된 필터 ('all', 'active', 'completed')
 * @param {Function} onFilterChange - 필터 변경 처리 함수
 * @param {Function} getColor - 테마 색상을 가져오는 함수
 */
const TodoFilter = ({ currentFilter, onFilterChange, getColor }) => {
  // 필터 옵션 정의
  const filters = [
    { value: 'all', label: '전체' },
    { value: 'active', label: '진행 중' },
    { value: 'completed', label: '완료' }
  ];

  return (
    <div className="flex justify-center border-b dark:border-gray-700">
      {filters.map(filter => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={`px-4 py-2 mx-1 text-sm font-medium transition-colors duration-200 border-b-2 ${
            currentFilter === filter.value
              ? 'text-orange-600 dark:text-orange-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
          style={{ 
            borderColor: currentFilter === filter.value ? getColor('primary') : 'transparent',
            color: currentFilter === filter.value ? getColor('primary') : undefined
          }}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default TodoFilter;