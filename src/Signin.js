import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 다른 전각으로 이동시켜주는 전령(마차)입니다.

function Signup() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. 비밀번호가 일치하는지 엄격히 심사하옵니다.
    if (password !== passwordConfirm) {
      alert("대장님, 입력한 비밀번호가 서로 일치하지 않사옵니다!");
      return; 
    }

    // 2. 가입 완료 처리 (나중에는 이곳에서 대장님의 서버/DB로 정보를 보냅니다)
    alert(`경사 났네! 새로운 백성 '${id}'님이 대장님의 왕국에 등록되었사옵니다!`);
    
    // 3. 가입이 끝났으니, 다시 로그인(메인) 화면으로 돌려보냅니다.
    navigate('/'); 
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '10px', maxWidth: '350px', margin: '40px auto' }}>
      <h2 style={{ textAlign: 'center', color: '#2db400' }}>왕국의 백성이 되소서</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>아이디: </label>
          <input 
            type="text" 
            value={id} 
            onChange={(e) => setId(e.target.value)} 
            required 
            style={{ width: '100%', padding: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>비밀번호: </label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ width: '100%', padding: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label>비밀번호 확인: </label>
          <input 
            type="password" 
            value={passwordConfirm} 
            onChange={(e) => setPasswordConfirm(e.target.value)} 
            required 
            style={{ width: '100%', padding: '5px' }}
          />
        </div>
        
        <button type="submit" style={{ width: '100%', padding: '10px', cursor: 'pointer', backgroundColor: '#2db400', color: 'white', border: 'none', borderRadius: '5px', marginBottom: '10px' }}>
          가입 완료하기
        </button>
        
        {/* 마음이 바뀌어 가입을 취소하고 싶을 때 돌아가는 버튼이옵니다 */}
        <button type="button" onClick={() => navigate('/')} style={{ width: '100%', padding: '10px', cursor: 'pointer', backgroundColor: '#f1f3f5', border: '1px solid #ccc', borderRadius: '5px' }}>
          뒤로 가기 (로그인으로)
        </button>
      </form>
    </div>
  );
}

export default Signup;