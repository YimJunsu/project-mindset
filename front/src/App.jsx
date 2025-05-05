import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import Register from './pages/Register';
import MyPage from './pages/MyPage';
import Home from './pages/Home';
import TimerPage from './pages/study/Timer'; // TimerPage 추가
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
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
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/mypage" element={
                  <PrivateRoute>
                    <MyPage />
                  </PrivateRoute>
                } />
                <Route path="/study/timer" element={<TimerPage />} /> {/* 추가된 경로 */}
                <Route path="*" element={<Navigate to="/" replace />} />
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