// src/app/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainPage from '../pages/MainPage';
import WritePage from '../pages/WritePage';
import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';
import './App.css'; 

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div className="App">
        <h1 className="main-title">세종대학교 맛집 찾기</h1>

        <Routes>
          {/* 로그인 또는 메인 페이지 */}
          <Route path="/" element={!isLoggedIn ? <LoginPage onLogin={() => setIsLoggedIn(true)} /> : <MainPage />} />
          {/* 회원가입 페이지 */}
          <Route path="/signup" element={<SignupPage />} />

         {/* 새 리뷰 작성 페이지 */}
          <Route path="/write" element={isLoggedIn ? <WritePage /> : <Navigate to="/" replace />} />
          {/* 리뷰 수정 페이지 */}
          <Route path="/write/:reviewId" element={isLoggedIn ? <WritePage /> : <Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;