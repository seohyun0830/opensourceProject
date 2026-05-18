import React, { useState } from 'react';

// App.js에서 넘겨준 onLogin 권한을 받아옵니다.
function Login({ onLogin }) { 
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); 
    
    // (나중에는 여기서 아이디/비번이 맞는지 서버에 확인하는 절차가 들어갑니다)
    
    // 지금은 임시로, 버튼을 누르면 무조건 입궁(로그인 성공)을 허락하옵니다!
    alert(`환영하옵니다 대장님! 맛집 지도를 펼치겠사옵니다!`);
    onLogin(); // 이 명령이 실행되면 App.js의 지도가 짠! 하고 나타납니다.
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '10px', maxWidth: '300px', margin: '20px auto' }}>
      <h2 style={{ textAlign: 'center' }}>입궁을 허락받으소서</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>아이디: </label>
          <input 
            type="text" 
            value={id} 
            onChange={(e) => setId(e.target.value)} 
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>비밀번호: </label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', cursor: 'pointer', backgroundColor: '#2db400', color: 'white', border: 'none', borderRadius: '5px' }}>
          입궁하기 (지도 보기)
        </button>
      </form>
    </div>
  );
}

export default Login;