import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './WritePage.css'; 
import yellowStar from '../assets/노란별.png';
import grayStar from '../assets/회색별.png';
import StoreSelectModal from '../components/StoreSelectModal';

function WritePage() {
  const navigate = useNavigate();

  const [selectedStore, setSelectedStore] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const [reviewText, setReviewText] = useState("");

  const [imageFiles, setImageFiles] = useState([]); // 백엔드 보낼 용도
  const [imagePreviews, setImagePreviews] = useState([]); // 화면에 보여줄 용도
  // 일단은 하드코딩
  // 나중에 db랑 연결
  const storeList = [
    { id: 1, name: "맥도날드 세종대점" },
    { id: 2, name: "은혜떡볶이" },
    { id: 3, name: "미식당" },
    { id: 4, name: "화양제일시장 족발" },
    { id: 5, name: "빠오즈푸" }
  ];

  const tags = ["#혼밥", "#든든해요", "#가성비", "#친절해요", "#카공하기 좋아요", "#분위기가 좋아요", "#조용해요","#저렴해요" ,"#양이 많아요","#웨이팅 없어요"];

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (imageFiles.length + files.length > 5) {
      alert("사진은 최대 5장까지만 등록할 수 있습니다.");
      return;
    }

    const newFiles = [...imageFiles];
    const newPreviews = [...imagePreviews];

    files.forEach((file) => {
      newFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    });

    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  const handleDeleteImage = (index) => {
    URL.revokeObjectURL(imagePreviews[index]);

    setImageFiles(imageFiles.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
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
            <img
              key={num}
              src={num <= rating ? yellowStar : grayStar}
              alt={`${num}점`}
              onClick={() => setRating(num)}
              style={{ width: '32px', height: '32px', cursor: 'pointer' }}
            />
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

      {/* 이미지 미리보기 */}
      <div className="image-upload-section">
        <input 
          type="file" 
          type="file" 
          accept="image/*" 
          id="review-image-input"
          multiple 
          onChange={handleImageChange} 
          style={{ display: 'none' }} 
          disabled={imageFiles.length >= 5} 
        />
        
        <div className="image-upload-wrapper" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {imageFiles.length < 5 && (
            <label htmlFor="review-image-input" className="image-upload-label">
              <span className="upload-icon">📸</span>
              <span className="upload-text">사진 추가<br/>({imageFiles.length}/5)</span>
            </label>
          )}

          {imagePreviews.map((preview, index) => (
            <div key={index} className="preview-container" style={{ position: 'relative' }}>
              <img src={preview} alt={`리뷰 미리보기 ${index + 1}`} className="image-preview" />
              <button 
                type="button"
                className="delete-image-btn" 
                onClick={() => handleDeleteImage(index)}
                style={{ position: 'absolute', top: '5px', right: '5px' }}
              >
                ❌
              </button>
            </div>
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

      <StoreSelectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSelectStore={setSelectedStore} 
      />
    </div>
  );
}

export default WritePage;