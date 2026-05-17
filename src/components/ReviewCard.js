import React from 'react';

const ReviewCard = ({ Reviewid, storeName, rating, reviewText, tags, image, onDelete, isDeleting }) => {
  const tagStyle = {
    marginRight: '5px',
    fontSize: '0.75rem',
    color: '#2E7D32',
    backgroundColor: '#F1F8E9',
    padding: '2px 6px',
    borderRadius: '4px'
  };

  const deleteBtnStyle = {
    position: 'absolute',
    bottom: '12px',
    right: '12px',
    border: 'none',
    background: 'none',
    color: '#FF5252',
    fontSize: '0.8rem',
    cursor: 'pointer',
    textDecoration: 'underline',
    padding: '4px'
  };

  const containerStyle = {
    display: 'flex',
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '12px',
    margin: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    position: 'relative',
    paddingBottom: '24px',

    transition: 'all 0.3s ease-out',
    opacity: isDeleting ? 0 : 1,
    transform: isDeleting ? 'translateX(50px)' : 'translateX(0)',
    pointerEvents: isDeleting ? 'none' : 'auto'
  };

  return (
    <div style={containerStyle}>
      <div style={{
        width: '80px',
        height: '80px',
        backgroundColor: '#eee',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.8rem',
        overflow: 'hidden'
      }}>
        {image ? (
          <img
            src={image}
            alt={storeName}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          "이미지"
        )}
      </div>

      <div style={{ marginLeft: '15px', textAlign: 'left', flex: 1 }}>
        <h4 style={{ margin: '0 0 5px 0' }}>📍 {storeName}</h4>
        <p style={{ margin: '0', fontSize: '0.9rem' }}>평점: {"⭐".repeat(rating)}</p>
        <p style={{ margin: '5px 0', fontSize: '0.9rem' }}>한줄 리뷰: {reviewText}</p>
        <div style={{ marginTop: '8px' }}>
          {tags.map((tag, index) => (
            <span key={index} style={tagStyle}>{tag}</span>
          ))}
        </div>
      </div>

      {/* 내가 작성한 리뷰만 삭제 버튼 노출 */}
      {Reviewid > 100 && (
        <button
          style={deleteBtnStyle}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          삭제
        </button>
      )}
    </div>
  );
};

export default ReviewCard;