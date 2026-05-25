import React from "react";
import { useParams } from "react-router-dom";
import { useReviewSubmit } from "../hooks/useReviewSubmit";
import "./WritePage.css";
import yellowStar from "../assets/노란별.png";
import grayStar from "../assets/회색별.png";
import StoreSelectModal from "../components/StoreSelectModal";

function WritePage() {
  const { reviewId } = useParams();
  const {
    isEditMode, selectedStore, setSelectedStore, isModalOpen, setIsModalOpen,
    rating, setRating, selectedTags, toggleTag, reviewText, setReviewText,
    imageItems, handleImageChange, handleReplaceImage, handleDeleteImage,
    isLoading, isSubmitting, handleSubmit, navigate
  } = useReviewSubmit(reviewId);

  const tags = ["#든든함", "#간편함", "#가성비", "#혼밥", "#카공", "#감성", "#단체"];

  if (isLoading) return <div className="write-container">리뷰를 불러오는 중...</div>;

  return (
    <div className="write-container">
      <button className="back-button" onClick={() => navigate(-1)}>뒤로</button>
      <h2>{isEditMode ? "리뷰 수정" : "리뷰 작성"}</h2>

      <div className="store-selector">
        <p className="store-selector-header">가게</p>
        <div className="store-selector-body">
          <span className={`store-name-display ${!selectedStore ? "placeholder" : ""}`}>
            {selectedStore ? selectedStore.name : "가게를 선택해 주세요."}
          </span>
          <button className="find-store-button" onClick={() => setIsModalOpen(true)}>가게 찾기</button>
        </div>
        {selectedStore?.address && <p className="selected-store-address">{selectedStore.address}</p>}
      </div>

      <div className="rating-section">
        <p>평점을 선택해 주세요.</p>
        <div className="stars">
          {[1, 2, 3, 4, 5].map((num) => (
            <img
              key={num}
              src={num <= rating ? yellowStar : grayStar}
              alt={`${num}점`}
              onClick={() => setRating(num)}
              style={{ width: "32px", height: "32px", cursor: "pointer" }}
            />
          ))}
        </div>
      </div>

      <div className="tag-section">
        <p>어떤 점이 좋았나요?</p>
        <div className="tag-list">
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              className={`tag-button ${selectedTags.includes(tag) ? "selected" : ""}`}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="image-upload-section">
        <input type="file" accept="image/*" id="review-image-input" multiple onChange={handleImageChange} style={{ display: "none" }} disabled={imageItems.length >= 5} />
        <div className="image-upload-wrapper" style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {imageItems.length < 5 && (
            <label htmlFor="review-image-input" className="image-upload-label">
              <span className="upload-icon">+</span>
              <span className="upload-text">사진 추가<br />({imageItems.length}/5)</span>
            </label>
          )}
          {imageItems.map((imageItem, index) => (
            <div key={imageItem.id} className="preview-container" style={{ position: "relative" }}>
              <img src={imageItem.url} alt="미리보기" className="image-preview" />
              <input type="file" accept="image/*" id={`replace-image-${index}`} onChange={(event) => handleReplaceImage(index, event)} style={{ display: "none" }} />
              <label htmlFor={`replace-image-${index}`} className="replace-image-btn">수정</label>
              <button type="button" className="delete-image-btn" onClick={() => handleDeleteImage(index)}>x</button>
            </div>
          ))}
        </div>
      </div>

      <textarea className="review-textarea" value={reviewText} onChange={(event) => setReviewText(event.target.value)} placeholder="리뷰를 작성해 주세요." />
      <button className="submit-button" onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? "저장 중..." : isEditMode ? "수정 저장" : "리뷰 저장"}
      </button>

      <StoreSelectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSelectStore={setSelectedStore} />
    </div>
  );
}

export default WritePage;