import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './WritePage.css'; 

function WritePage() {
  const navigate = useNavigate();

  const [selectedStore, setSelectedStore] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const [reviewText, setReviewText] = useState("");

  const storeList = [
    { id: 1, name: "맥도날드 세종대점" },
    { id: 2, name: "은혜떡볶이" },
    { id: 3, name: "미식당" },
    { id: 4, name: "화양제일시장 족발" },
    { id: 5, name: "빠오즈푸" }
  ];

  const tags = ["#혼밥하기 좋아요", "#든든해요", "#가성비", "#친절해요", "#카공하기 좋아요"];

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = () => {
    if (!selectedStore) {
      alert("리뷰를 남길 가게를 선택해 주세요!");
      return;
    }
    if (rating === 0 || selectedTags.length === 0 || reviewText.trim() === "") {
      alert("모든 항목을 작성해 주세요!");
      return;
    }
    alert(`${selectedStore.name} 리뷰 등록 완료!`);
    navigate(-1);
  };

  return (
    <div className="write-container">
      <button className="back-button" onClick={() => navigate(-1)}>⬅️ 뒤로</button>

      <h2>📝 리뷰 작성하기</h2>

      {/* 가게 선택 섹션 */}
      <div className="store-selector">
        <p className="store-selector-header">리뷰할 가게</p>
        <div className="store-selector-body">
          <span className={`store-name-display ${!selectedStore ? 'placeholder' : ''}`}>
            {selectedStore ? selectedStore.name : "가게를 선택해 주세요"}
          </span>
          <button className="find-store-button" onClick={() => setIsModalOpen(true)}>
            가게 찾기
          </button>
        </div>
      </div>

      {/* 별점 섹션 */}
      <div className="rating-section">
        <p>별점을 선택해 주세요</p>
        <div className="stars">
          {[1, 2, 3, 4, 5].map((num) => (
            <span key={num} onClick={() => setRating(num)}>
              {num <= rating ? "⭐" : "☆"}
            </span>
          ))}
        </div>
      </div>

      {/* 태그 섹션 */}
      <div className="tag-section">
        <p>어떤 점이 좋았나요?</p>
        <div className="tag-list">
          {tags.map(tag => (
            <button 
              key={tag} 
              className={`tag-button ${selectedTags.includes(tag) ? 'selected' : ''}`}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* 리뷰 입력 */}
      <textarea
        className="review-textarea"
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        placeholder="한 줄 리뷰를 남겨주세요!"
      />

      <button className="submit-button" onClick={handleSubmit}>리뷰 등록하기</button>

      {/* 가게 찾기 모달 */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>가게 선택하기</h3>
            <ul className="store-list">
              {storeList.map(store => (
                <li 
                  key={store.id} 
                  className="store-item"
                  onClick={() => {
                    setSelectedStore(store);
                    setIsModalOpen(false);
                  }}
                >
                  {store.name}
                </li>
              ))}
            </ul>
            <button className="close-modal-button" onClick={() => setIsModalOpen(false)}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default WritePage;