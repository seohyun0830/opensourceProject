import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { auth } from '../../firebase'; 
import { signInWithEmailAndPassword } from 'firebase/auth'; 
import './LoginPage.css'; 

function Login({ onLogin }) { 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      alert("로그인에 성공했습니다! 맛집 지도를 불러옵니다.");
      onLogin(); 
      
      navigate('/'); 
      
    } catch (error) {
      console.error("로그인 에러 발생:", error);
      
      if (
        error.code === 'auth/user-not-found' || 
        error.code === 'auth/wrong-password' || 
        error.code === 'auth/invalid-credential' 
      ) {
        alert("이메일 아이디 또는 비밀번호가 일치하지 않습니다.");
      } else if (error.code === 'auth/invalid-email') {
        alert("올바른 이메일 형식이 아닙니다.");
      } else {
        alert(`로그인 실패: ${error.message}`);
      }
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">로그인</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>이메일 아이디: </label>
          <input 
            type="email" 
            placeholder="example@email.com"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>비밀번호: </label>
          <input 
            type="password" 
            placeholder="비밀번호 입력"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" className="btn-login">
          로그인하고 지도 보기
        </button>
      </form>

      <div className="signup-link-container">
        <button 
          onClick={() => navigate('/signup')} 
          className="btn-go-signup"
        >
          회원가입하러 가기
        </button>
      </div>
    </div> 
  );
}

export default Login;