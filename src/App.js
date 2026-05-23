import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainPage from './pages/MainPage';
import WritePage from './pages/WritePage';
import Login from './Login';
import Signup from './Signin'; // ✅ 방금 만든 회원가입 전각을 불러옵니다!

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div className="App">
        <h1 style={{ textAlign: "center", color: "#2db400", margin: "20px 0" }}>
          캠퍼스 맛집 지도
        </h1>

        <Routes>
          {/* 1. 메인 (로그인 및 지도 화면) */}
          <Route 
            path="/" 
            element={
              !isLoggedIn ? (
                <Login onLogin={() => setIsLoggedIn(true)} />
              ) : (
                <MainPage />
              )
            } 
          />

          {/* 2. ✅ 새로 추가된 회원가입 도로망이옵니다 */}
          <Route path="/signup" element={<Signup />} />

          {/* 3. 글쓰기 화면 (로그인 안 된 자를 쫓아내는 보안 장치) */}
          <Route 
            path="/write" 
            element={
              isLoggedIn ? (
                <WritePage />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route
            path="/write/:reviewId"
            element={
              isLoggedIn ? (
                <WritePage />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
