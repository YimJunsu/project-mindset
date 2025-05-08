// src/components/layout/Sidebar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [studyOpen, setStudyOpen] = useState(false);
  const [workoutOpen, setWorkoutOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleStudy = () => setStudyOpen(!studyOpen);
  const toggleWorkout = () => setWorkoutOpen(!workoutOpen);

  return (
    <>
      <button onClick={toggleSidebar} className="p-2 text-2xl z-50 relative">
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div className={`fixed top-0 left-0 h-full ${isOpen ? 'w-64' : 'w-0'} bg-white dark:bg-gray-900 shadow-lg transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} overflow-hidden transition-all duration-300 z-40`}>
        <nav className="p-6 flex flex-col space-y-6 text-lg font-semibold">
          
          {/* 공부 메뉴 */}
          <div className="flex flex-col">
            <button onClick={toggleStudy} className="flex justify-between items-center w-full text-left hover:text-orange-500">
            📚공부 {studyOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {studyOpen && (
              <div className="mt-2 flex flex-col space-y-2 text-base font-normal ml-4">
                <Link to="/study/timer" onClick={toggleSidebar} className="block hover:text-orange-500">타이머</Link>
                <Link to="/study/Todolist" onClick={toggleSidebar} className="block hover:text-orange-500">ToDoList</Link>
                <Link to="/study/record" onClick={toggleSidebar} className="block hover:text-orange-500">공부기록</Link>
                <Link to="/questions" onClick={toggleSidebar} className="block hover:text-orange-500">질문</Link>
                <Link to="/memo" onClick={toggleSidebar} className="block hover:text-orange-500">메모</Link>
              </div>
            )}
          </div>

          {/* 운동 메뉴 */}
          <div className="flex flex-col">
            <button onClick={toggleWorkout} className="flex justify-between items-center w-full text-left hover:text-orange-500">
            🏋️‍♂️운동 {workoutOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {workoutOpen && (
              <div className="mt-2 flex flex-col space-y-2 text-base font-normal ml-4">
                <Link to="/workout/record" onClick={toggleSidebar} className="block hover:text-orange-500">운동기록</Link>
                <Link to="/workout-posts" onClick={toggleSidebar} className="block hover:text-orange-500">오운완</Link>
                <Link to="/workout/diet" onClick={toggleSidebar} className="block hover:text-orange-500">식단 관리</Link>
              </div>
            )}
          </div>

        </nav>
      </div>
    </>
  );
};

export default Sidebar;
