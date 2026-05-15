import React from 'react';
import { useNavigate } from 'react-router-dom';

function WritePage() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '20px', textAlign: 'left' }}>

      <button onClick={() => navigate(-1)} style={{ border: 'none', background: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>
        ⬅️ 뒤로
      </button>

      <h2>📝 리뷰 작성하기</h2>

      {/*가게이름*/}
      <div style={{ marginBottom: '20px' }}>
        <h3>맥도날드 세종대점</h3>
      </div>

      {/*별점*/}
      <div style={{ marginBottom: '20px' }}>
        <p>별점을 선택해 주세요</p>
        <div style={{ fontSize: '1.5rem' }}>⭐⭐⭐⭐⭐</div>
      </div>

      {/*태그선택*/}
      <div style={{ marginBottom: '20px' }}>
        <p>어떤 점이 좋았나요? (필수 선택)</p>
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
          {["#혼밥", "#든든해요", "#가성비", "#친절해요"].map(tag => (
            <button key={tag} style={tagButtonStyle}>{tag}</button>
          ))}
        </div>
      </div>

      {/*리뷰작성*/}
      <textarea
        placeholder="한 줄 리뷰를 남겨주세요!"
        style={{ width: '100%', height: '100px', borderRadius: '10px', padding: '10px' }}
      />

      {/*등록*/}
      <button style={submitButtonStyle}>리뷰 등록하기</button>
    </div>
  );
}

const tagButtonStyle = { padding: '5px 10px', borderRadius: '15px', border: '1px solid #ccc', backgroundColor: '#fff' };
const submitButtonStyle = { width: '100%', padding: '15px', backgroundColor: '#2db400', color: '#fff', border: 'none', borderRadius: '10px', marginTop: '20px', fontWeight: 'bold' };

export default WritePage;