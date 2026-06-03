import React, { useState } from "react";

const ReviewCard = ({
  Reviewid,
  storeName,
  rating,
  reviewText,
  tags,
  image,
  images,
  onDelete,
  onEdit,
  isDeleting,
  isMine,
  createdAt,
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const reviewImages = Array.isArray(images) && images.length > 0 ? images : image ? [{ url: image }] : [];

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    
    return `${year}.${month}.${day}`;
  };

  const tagStyle = {
    marginRight: "5px",
    fontSize: "0.75rem",
    color: "#dc143c",
    backgroundColor: "#fbf3f4",
    padding: "2px 6px",
    borderRadius: "4px",
    display: "inline-block",
    marginBottom: "4px",
  };

  const imageBoxStyle = {
    width: "72px",
    height: "72px",
    borderRadius: "8px",
    flexShrink: 0,
    overflow: "hidden",
    border: "1px solid #eee",
    cursor: "zoom-in",
  };

  return (
    <>
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          padding: "12px",
          margin: "10px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          position: "relative",
          opacity: isDeleting ? 0.5 : 1,
          transform: isDeleting ? "scale(0.98)" : "scale(1)",
          transition: "all 0.3s ease",
          textAlign: "left",
          display: "flex",       // 내부 요소를 유연하게 배치하기 위해 추가
          flexDirection: "column" // 위에서 아래로 쌓이도록 설정
        }}
      >
        <div style={{ paddingRight: isMine ? "84px" : 0 }}>
          <h4 style={{ margin: "0 0 5px 0", color: "#333" }}>{storeName}</h4>

          <p style={{ margin: "0", fontSize: "0.9rem" }}>평점: {"⭐️".repeat(rating)}</p>

          <p style={{ margin: "5px 0", fontSize: "0.9rem", color: "#555", lineHeight: "1.4" }}>
            {reviewText}
          </p>

          <div style={{ marginTop: "8px" }}>
            {tags &&
              tags.map((tag, index) => (
                <span key={index} style={tagStyle}>
                  {tag}
                </span>
              ))}
          </div>
        </div>

        {reviewImages.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginTop: "10px",
              overflowX: "auto",
              paddingBottom: "2px",
            }}
          >
            {reviewImages.map((reviewImage, index) => (
              <button
                key={reviewImage.url || index}
                type="button"
                onClick={() => setSelectedImage(reviewImage.url)}
                style={{
                  ...imageBoxStyle,
                  padding: 0,
                  background: "transparent",
                }}
              >
                <img
                  src={reviewImage.url}
                  alt={`리뷰 이미지 ${index + 1}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </button>
            ))}
          </div>
        )}

        {createdAt && (
          <div style={{ textAlign: "right", marginTop: "-10px", paddingTop: "0px" }}>
            <span style={{ fontSize: "0.75rem", color: "#999" }}>
              {formatDate(createdAt)}
            </span>
          </div>
        )}

        {isMine && (
          <div
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              display: "flex",
              gap: "6px",
            }}
          >
            <button
              onClick={(event) => {
                event.stopPropagation();
                onEdit(Reviewid);
              }}
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: "#4e4e4e",
                cursor: "pointer",
                fontSize: "0.8rem",
                fontWeight: "bold",
                padding: "5px",
              }}
            >
              수정
            </button>
            <button
              onClick={(event) => {
                event.stopPropagation();
                onDelete(Reviewid);
              }}
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: "#dc143c",
                cursor: "pointer",
                fontSize: "0.8rem",
                fontWeight: "bold",
                padding: "5px",
              }}
            >
              삭제
            </button>
          </div>
        )}
      </div>

      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2000,
            backgroundColor: "rgba(0,0,0,0.78)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <img
            src={selectedImage}
            alt="확대된 리뷰 이미지"
            style={{
              maxWidth: "100%",
              maxHeight: "90vh",
              objectFit: "contain",
              borderRadius: "8px",
              backgroundColor: "#fff",
            }}
          />
        </div>
      )}
    </>
  );
};

export default ReviewCard;
