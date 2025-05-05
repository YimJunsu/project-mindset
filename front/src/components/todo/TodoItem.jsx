// src/components/todo/TodoItem.jsx
import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

/**
 * 개별 할 일 항목을 표시하는 컴포넌트
 * @param {Object} todo - 할 일 객체
 * @param {Function} onToggleStatus - 완료 상태 토글 함수
 * @param {Function} onDelete - 삭제 함수
 * @param {Function} onViewDetail - 상세 페이지로 이동하는 함수
 * @param {Function} getColor - 테마 색상을 가져오는 함수
 */
const TodoItem = ({ todo, onToggleStatus, onDelete, onViewDetail, getColor }) => {
  // 마우스 호버 상태
  const [isHovered, setIsHovered] = useState(false);
  
  // 날짜 포맷팅 함수 - "n일 전", "n시간 전" 등의 형식으로 표시
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true, locale: ko });
    } catch (err) {
      console.error('날짜 변환 오류:', err);
      return '';
    }
  };

  return (
    <div 
      className={`p-4 border rounded-lg shadow-sm transition duration-200 ${
        todo.isCompleted ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-700'
      } ${isHovered ? 'shadow-md' : ''} dark:border-gray-600`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* 완료 체크박스 */}
          <input
            type="checkbox"
            checked={todo.isCompleted}
            onChange={onToggleStatus}
            className="h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300 rounded cursor-pointer"
            style={{ color: getColor('primary') }}
          />
          
          {/* 할 일 내용 */}
          <div>
            <p 
              className={`text-lg font-medium ${
                todo.isCompleted 
                  ? 'line-through text-gray-500 dark:text-gray-400' 
                  : 'text-gray-800 dark:text-white'
              }`}
            >
              {todo.content}
            </p>
            
            {/* 생성일 또는 완료일 */}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {todo.isCompleted 
                ? `완료: ${formatDate(todo.completedAt)}` 
                : `생성: ${formatDate(todo.createdAt)}`}
            </p>
          </div>
        </div>
        
        {/* 작업 버튼 */}
        <div className="flex items-center space-x-2">
          {/* 상세 보기 버튼 */}
          <button
            onClick={onViewDetail}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 p-1"
          >
            상세
          </button>
          
          {/* 삭제 버튼 */}
          <button
            onClick={onDelete}
            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-1"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;