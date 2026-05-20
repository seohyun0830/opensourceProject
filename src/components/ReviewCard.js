import React from 'react';

const ReviewCard = ({
  Reviewid,
  storeName,
  rating,
  reviewText,
  tags,
  onDelete,
  isDeleting,
  isMine
}) => {

  // 태그 개별 스타일
  const tagStyle = {
    marginRight: '5px',
    fontSize: '0.75rem',
    color: '#2E7D32',
    backgroundColor: '#F1F8E9',
    padding: '2px 6px',
    borderRadius: '4px',
    display: 'inline-block',
    marginBottom: '4px'
  };

  return (
    <div style={{
      display: 'flex',
      backgroundColor: '#fff',
      borderRadius: '12px',
      padding: '12px',
      margin: '10px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'relative', // 삭제 버튼 배치를 위한 기준점
      opacity: isDeleting ? 0.5 : 1, // 삭제 애니메이션 중일 때 흐릿하게
      transform: isDeleting ? 'scale(0.98)' : 'scale(1)', // 살짝 작아지는 효과
      transition: 'all 0.3s ease'
    }}>

      {/* 1. 이미지 영역 (등록된 이미지가 있으면 보여주고 없으면 기본 회색박스) */}
      <div style={{
        width: '80px',
        height: '80px',
        backgroundColor: '#eee',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.8rem',
        flexShrink: 0,
        overflow: 'hidden'
      }}>
        {/* 나중에 이미지 연동 시 <img src={image} /> 형태로 확장 가능 */}
        이미지
      </div>

      {/* 2. 텍스트 정보 영역 */}
      <div style={{ marginLeft: '15px', textAlign: 'left', flex: 1 }}>
        <h4 style={{ margin: '0 0 5px 0', paddingRight: '40px', color: '#333' }}>
          📍 {storeName}
        </h4>

        <p style={{ margin: '0', fontSize: '0.9rem' }}>
          평점: {"⭐".repeat(rating)}
        </p>

        <p style={{ margin: '5px 0', fontSize: '0.9rem', color: '#555', lineHeight: '1.4' }}>
          {reviewText}
        </p>

        {/* 태그 리스트 */}
        <div style={{ marginTop: '8px' }}>
          {tags && tags.map((tag, index) => (
            <span key={index} style={tagStyle}>{tag}</span>
          ))}
        </div>
      </div>

      {/* 3. 삭제 버튼 (내가 쓴 리뷰일 때만 노출) */}
      {isMine && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // 카드 클릭 이벤트와 겹치지 않게 방지
            onDelete(Reviewid);
          }}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#ff4d4f',
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            padding: '5px'
          }}
        >
          삭제
        </button>
      )}
    </div>
  );
};

export default ReviewCard;