// src/components/todo/TodoForm.jsx
import React, { useState } from 'react';

/**
 * 새로운 할 일을 추가하는 폼 컴포넌트
 * @param {Function} onAddTodo - 할 일 추가 함수
 * @param {Function} getColor - 테마 색상을 가져오는 함수
 */
const TodoForm = ({ onAddTodo, getColor }) => {
  // 폼 데이터 상태
  const [content, setContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  
  // 할 일 제출 처리
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 비어있는 할 일은 추가하지 않음
    if (!content.trim()) {
      return;
    }
    
    // 부모 컴포넌트의 onAddTodo 함수 호출
    onAddTodo({ content });
    
    // 폼 초기화
    setContent('');
    setIsExpanded(false);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700">
      <form onSubmit={handleSubmit}>
        {/* 할 일 입력 필드 */}
        <div className="mb-4">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            placeholder="할 일을 입력하세요"
            className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            style={{ 
              '--tw-ring-color': getColor('primary'),
              borderColor: isExpanded ? getColor('primary') : undefined 
            }}
            autoComplete="off"
          />
        </div>
        
        {/* 버튼 영역 */}
        <div className="flex justify-end">
          {/* 취소 버튼 (확장된 상태에서만 표시) */}
          {isExpanded && (
            <button
              type="button"
              onClick={() => {
                setIsExpanded(false);
                setContent('');
              }}
              className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              style={{ '--tw-ring-color': getColor('primary') }}
            >
              취소
            </button>
          )}
          
          {/* 추가 버튼 */}
          <button
            type="submit"
            disabled={!content.trim()}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${
              content.trim() 
                ? 'bg-orange-500 hover:bg-orange-600' 
                : 'bg-orange-300 dark:bg-orange-700 cursor-not-allowed'
            }`}
            style={{ 
              backgroundColor: content.trim() ? getColor('primary') : undefined,
              '--tw-ring-color': getColor('primary')
            }}
          >
            {isExpanded ? '추가하기' : '+ 할 일 추가'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TodoForm;