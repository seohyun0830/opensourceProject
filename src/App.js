import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainPage from './pages/MainPage';
import WritePage from './pages/WritePage';
import Login from './Login'; // 로그인 전각을 불러옵니다.

function App() {
  // 로그인 여부를 기억하는 옥새(State)이옵니다.
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div className="App">
        {/* 모든 페이지에서 공통으로 보일 전각의 현판(타이틀)이옵니다. */}
        <h1 style={{ textAlign: "center", color: "#2db400", margin: "20px 0" }}>
          👑 대장님의 맛집 지도 👑
        </h1>

        <Routes>
          {/* [주소: / ] 메인 맛집 지도 주소이옵니다.
            로그인이 안 되어 있으면 <Login />을 보여주고, 완료되면 <MainPage />를 펼칩니다.
          */}
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

          {/* [주소: /write ] 글쓰기 주소이옵니다.
            로그인 없이 주소창에 직접 입력해 침입하려는 자들을 막기 위해 보안 장치를 심었습니다.
            로그인이 안 되어 있다면 무조건 메인(/) 즉, 로그인 화면으로 쫓아냅니다(Navigate).
          */}
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;