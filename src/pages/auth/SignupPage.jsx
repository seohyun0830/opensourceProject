import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword,updateProfile } from 'firebase/auth'; 
import './SignupPage.css'; 

function Signup() {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  
  const navigate = useNavigate();


const handleSubmit = async (e) => {
    e.preventDefault();

    if (!displayName.trim()) {
      alert("이름을 입력해 주세요!");
      return;
    }

    if (password !== passwordConfirm) {
      alert("입력한 비밀번호가 서로 일치하지 않습니다!");
      return; 
    }

    try {
      // 1. 계정 생성 완료될 때까지 대기
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      await updateProfile(userCredential.user, {
        displayName: displayName,
      });

      await userCredential.user.reload();
      
      alert(`회원가입이 완료되었습니다! 반갑습니다, ${displayName}님.`);
      navigate('/'); 
      
    } catch (error) {
      console.error("회원가입 에러 발생:", error);
      
      if (error.code === 'auth/email-already-in-use') {
        alert("이미 존재하는 이메일(아이디)입니다.");
      } else if (error.code === 'auth/weak-password') {
        alert("비밀번호는 최소 6자리 이상이어야 합니다.");
      } else if (error.code === 'auth/invalid-email') {
        alert("올바른 이메일 형식이 아닙니다 (예: user@example.com).");
      } else {
        alert(`회원가입 실패: ${error.message}`);
      }
    }
  };
  
  return (
    <div className="signup-container">
      <h2 className="signup-title">회원가입</h2>
      <form onSubmit={handleSubmit}>
        
        <div className="form-group">
          <label>이메일: </label>
          <input 
            type="email" 
            placeholder="example@email.com"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>

        <div className="form-group">
          <label>이름: </label>
          <input 
            type="text" 
            placeholder="이름을 입력해 주세요"
            value={displayName} 
            onChange={(e) => setDisplayName(e.target.value)} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label>비밀번호: </label>
          <input 
            type="password" 
            placeholder="6자리 이상 입력"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        
        <div className="form-group last">
          <label>비밀번호 확인: </label>
          <input 
            type="password" 
            value={passwordConfirm} 
            onChange={(e) => setPasswordConfirm(e.target.value)} 
            required 
          />
        </div>
        
        <button type="submit" className="btn-submit">
          가입 완료하기
        </button>
        
        <button type="button" onClick={() => navigate('/')} className="btn-cancel">
          뒤로 가기 (로그인으로)
        </button>
        
      </form>
    </div>
  );
}

export default Signup;