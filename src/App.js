import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainPage from './pages/MainPage';
import WritePage from './pages/WritePage';
import Login from './Login';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div className="App">
        <h1 style={{ textAlign: "center", color: "#2db400", margin: "20px 0" }}>
          캠퍼스 맛집 지도
        </h1>

        <Routes>
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
