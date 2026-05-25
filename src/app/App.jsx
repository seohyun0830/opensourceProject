import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import MainPage from '../pages/MainPage';
import WritePage from '../pages/WritePage';
import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';
import './App.css'; 

function App() {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setInitializing(false);
    });
    return () => unsubscribe();
  }, []);

  if (initializing) return <div className="loading-message">초기화 중...</div>;

  return (
    <Router>
      <div className="App">
        <h1 className="main-title">세종대학교 맛집 찾기</h1>

        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" replace />} />
          <Route path="/signup" element={!user ? <SignupPage /> : <Navigate to="/" replace />} />
          <Route path="/write" element={user ? <WritePage /> : <Navigate to="/login" replace />} />
          <Route path="/write/:reviewId" element={user ? <WritePage /> : <Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;