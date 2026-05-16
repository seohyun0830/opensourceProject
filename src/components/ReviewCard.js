import React from 'react';

const ReviewCard = ({ storeName, rating, reviewText, tags }) => {
  const tagStyle = {
    marginRight: '5px',
    fontSize: '0.75rem',
    color: '#2E7D32',
    backgroundColor: '#F1F8E9',
    padding: '2px 6px',
    borderRadius: '4px'
  };

  return (
    <div style={{ display: 'flex', backgroundColor: '#fff', borderRadius: '12px', padding: '12px', margin: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <div style={{ width: '80px', height: '80px', backgroundColor: '#eee', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>이미지</div>
      <div style={{ marginLeft: '15px', textAlign: 'left' }}>
        <h4 style={{ margin: '0 0 5px 0' }}>📍 {storeName}</h4>
        <p style={{ margin: '0', fontSize: '0.9rem' }}>평점: {"⭐".repeat(rating)}</p>
        <p style={{ margin: '5px 0', fontSize: '0.9rem' }}>한줄 리뷰: {reviewText}</p>
        <div style={{ marginTop: '8px' }}>
          {tags.map((tag, index) => (
            <span key={index} style={tagStyle}>{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;