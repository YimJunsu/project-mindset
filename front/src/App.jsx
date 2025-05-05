import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// 페이지 컴포넌트
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MyPage from './pages/MyPage';
import TimerPage from './pages/study/Timer';
import TodoDetail from './pages/study/TodoDetail';
import Todolist from './pages/study/Todolist';
import NotFound from './pages/NotFound';

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
                {/* 공용 접근 가능 */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/study/timer" element={<TimerPage />} />
                {/* 로그인 사용자만 접근 가능 */}
                <Route
                  path="/mypage"
                  element={
                    <PrivateRoute>
                      <MyPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/study/todolist"
                  element={
                    <PrivateRoute>
                      <Todolist />
                    </PrivateRoute>
                  }
                />
                <Route path="/study/todo/detail/:todoId" element={
                <PrivateRoute>
                  <TodoDetail />
                </PrivateRoute>
              } />
                {/* 404 처리 */}
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
