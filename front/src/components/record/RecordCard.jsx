// src/components/record/RecordCard.jsx
import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const RecordCard = ({ title, subtitle, details, date, onClick }) => {
  const { darkMode } = useTheme();
  
  return (
    <div 
      onClick={onClick}
      className={`w-full rounded-xl shadow-md p-4 cursor-pointer transition-all duration-300 hover:shadow-lg ${
        darkMode 
          ? 'bg-gray-800 hover:bg-gray-700 text-white' 
          : 'bg-white hover:bg-gray-50 text-gray-800'
      }`}
    >
      <h3 className="text-lg font-semibold mb-1 truncate">{title}</h3>
      <div className="text-sm font-medium mb-2 text-orange-500">{subtitle}</div>
      <div className={`text-sm mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        {details}
      </div>
      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        {date}
      </div>
    </div>
  );
};

export default RecordCard;