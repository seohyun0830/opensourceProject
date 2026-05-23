import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 마차를 불러옵니다!

function Login({ onLogin }) { 
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate(); // 마차 객체 생성

  const handleSubmit = (e) => {
    e.preventDefault(); 
    alert(`환영하옵니다 대장님! 맛집 지도를 펼치겠사옵니다!`);
    onLogin(); 
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '10px', maxWidth: '300px', margin: '20px auto' }}>
      <h2 style={{ textAlign: 'center' }}>입궁을 허락받으소서</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>아이디: </label>
          <input type="text" value={id} onChange={(e) => setId(e.target.value)} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>비밀번호: </label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', cursor: 'pointer', backgroundColor: '#2db400', color: 'white', border: 'none', borderRadius: '5px' }}>
          입궁하기 (지도 보기)
        </button>
      </form>

      <div style={{ marginTop: '15px', textAlign: 'center' }}>
        {/* 이 버튼을 누르면 '/signup' 주소로 마차가 출발하옵니다! */}
        <button 
          onClick={() => navigate('/signup')} 
          style={{ width: '100%', padding: '8px', cursor: 'pointer', backgroundColor: '#f1f3f5', border: '1px solid #ccc', borderRadius: '5px' }}
        >
          회원가입하러 가기
        </button>
      </div>
    </div> 
  );
}

export default Login;