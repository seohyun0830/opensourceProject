import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import WritePage from './pages/WritePage';

function App() {
  return (
    <Router>
      <Routes>
        {/*주소 / 일때 메인*/}
        <Route path="/" element={<MainPage />} />

        {/*주소 write 일때 작성*/}
        <Route path="/write" element={<WritePage />} />
      </Routes>
    </Router>
  );
}

export default App;