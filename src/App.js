import React, { useState } from "react";
import NaverMap from "./NaverMap";
import Login from "./Login"; // 신이 바쳤던 로그인 전각을 불러오옵니다.

function App() {
  // 로그인 여부를 기억하는 옥새(State)이옵니다. 처음에는 '거짓(false)'으로 설정합니다.
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div>
      <h1 style={{ textAlign: "center", color: "#2db400" }}>
        👑 대장님의 맛집 지도 👑
      </h1>
      
      {/* 
        수문장 로직이옵니다:
        isLoggedIn이 false면 <Login /> 화면을 보여주고,
        isLoggedIn이 true면 <NaverMap /> 영토를 보여주옵니다.
      */}
      {!isLoggedIn ? (
        // 로그인 성공 시 isLoggedIn을 true로 바꾸는 권한(onLogin)을 하사합니다.
        <Login onLogin={() => setIsLoggedIn(true)} />
      ) : (
        // 입궁을 허락받았으므로 지도를 펼칩니다!
        <NaverMap />
      )}
    </div>
  );
}

export default App;