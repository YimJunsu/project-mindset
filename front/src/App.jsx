import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// 페이지 컴포넌트
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import OAuthCallback from './pages/OAuthCallback'; // 추가: OAuth 콜백 컴포넌트
import MyPage from './pages/MyPage';
import TimerPage from './pages/study/Timer';
import TodoDetail from './pages/study/TodoDetail';
import Todolist from './pages/study/Todolist';
import NotFound from './pages/NotFound';

// 공부 기록 페이지
import StudyRecord from './pages/study/StudyRecord';
import StudyRecordDetail from './pages/study/StudyRecordDetail';
import NewStudyRecord from './pages/study/NewStudyRecord';

// 운동 기록 페이지
import WorkoutRecord from './pages/workout/WorkoutRecord';
import WorkoutRecordDetail from './pages/workout/WorkoutRecordDetail';
import NewWorkoutRecord from './pages/workout/NewWorkoutRecord';

// 메모 페이지
import Memo from './pages/memo/Memo';
import MemoList from './pages/memo/MemoList';
import MemoSave from './pages/memo/MemoSave';
import MemoDetail from './pages/memo/MemoDetail';

// 오운완 게시판 페이지 (추가)
import WorkoutPostListPage from './pages/workout/WorkoutPostListPage';
import WorkoutPostCreatePage from './pages/workout/WorkoutPostCreatePage';
import WorkoutPostDetailPage from './pages/workout/WorkoutPostDetailPage';

// 레이아웃 컴포넌트
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// 공통 컴포넌트
import PrivateRoute from './components/common/PrivateRoute';

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <Routes>
                {/* ===== 공용 접근 가능 ===== */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/study/timer" element={<TimerPage />} />
                
                {/* ===== OAuth 콜백 ===== */}
                <Route path="/oauth/callback" element={<OAuthCallback />} />
                
                {/* ===== 마이페이지 ===== */}
                <Route
                  path="/mypage"
                  element={
                    <PrivateRoute>
                      <MyPage />
                    </PrivateRoute>
                  }
                />
                
                {/* ===== 투두리스트 관련 라우트 ===== */}
                <Route
                  path="/study/todolist"
                  element={
                    <PrivateRoute>
                      <Todolist />
                    </PrivateRoute>
                  }
                />
                <Route 
                  path="/study/todo/detail/:todoId" 
                  element={
                    <PrivateRoute>
                      <TodoDetail />
                    </PrivateRoute>
                  } 
                />
                
                {/* ===== 메모 관련 라우트 ===== */}
                <Route
                  path="/memo"
                  element={
                    <PrivateRoute>
                      <Memo />
                    </PrivateRoute>
                  }
                >
                  {/* 중첩 라우트 - 메모 목록 (기본) */}
                  <Route index element={<MemoList />} />
                  
                  {/* 중첩 라우트 - 메모 작성 */}
                  <Route path="save" element={<MemoSave />} />
                  
                  {/* 중첩 라우트 - 메모 상세 */}
                  <Route path="detail/:memoId" element={<MemoDetail />} />
                </Route>
                
                {/* ===== 공부 기록 관련 라우트 ===== */}
                <Route
                  path="/study/record"
                  element={
                    <PrivateRoute>
                      <StudyRecord />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/study/record/new"
                  element={
                    <PrivateRoute>
                      <NewStudyRecord />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/study/record/:recordId"
                  element={
                    <PrivateRoute>
                      <StudyRecordDetail />
                    </PrivateRoute>
                  }
                />
                
                {/* ===== 운동 기록 관련 라우트 ===== */}
                <Route
                  path="/workout/record"
                  element={
                    <PrivateRoute>
                      <WorkoutRecord />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/workout/record/new"
                  element={
                    <PrivateRoute>
                      <NewWorkoutRecord />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/workout/record/:workoutId"
                  element={
                    <PrivateRoute>
                      <WorkoutRecordDetail />
                    </PrivateRoute>
                  }
                />
                
                {/* ===== 오운완 게시판 관련 라우트 (추가) ===== */}
                <Route
                  path="/workout/post"
                  element={
                    <PrivateRoute>  
                      <WorkoutPostListPage />
                    </PrivateRoute>
                    }
                />
                <Route
                  path="/workout/post/create"
                  element={
                    <PrivateRoute>
                      <WorkoutPostCreatePage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/workout/post/:postId"
                  element={<WorkoutPostDetailPage />}
                />
                
                {/* ===== 404 처리 ===== */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;