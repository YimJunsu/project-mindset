// src/components/workout/CategoryFilter.jsx
import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const CategoryFilter = ({ selectedCategory, onSelectCategory }) => {
  const { darkMode } = useTheme();
  
  const categories = [
    { id: '', name: '전체' },
    { id: '헬스', name: '헬스' },
    { id: '러닝', name: '러닝' },
    { id: '수영', name: '수영' },
    { id: '홈트', name: '홈트' },
    { id: '요가', name: '요가' },
    { id: '필라테스', name: '필라테스' },
    { id: '기타', name: '기타' }
  ];
  
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map(category => (
        <button
          key={category.id}
          className={`px-3 py-1 rounded-full text-sm transition ${
            selectedCategory === category.id
              ? 'bg-orange-500 text-white'
              : darkMode
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => onSelectCategory(category.id)}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;