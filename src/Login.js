import React, { useState } from "react";

function Login({ onLogin }) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("환영합니다. 맛집 지도를 열어볼게요!");
    onLogin();
  };

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "10px", maxWidth: "300px", margin: "20px auto" }}>
      <h2 style={{ textAlign: "center" }}>로그인</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>아이디: </label>
          <input type="text" value={id} onChange={(e) => setId(e.target.value)} />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>비밀번호: </label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" style={{ width: "100%", padding: "10px", cursor: "pointer", backgroundColor: "#2db400", color: "white", border: "none", borderRadius: "5px" }}>
          로그인하고 지도 보기
        </button>
      </form>
    </div>
  );
}

export default Login;
