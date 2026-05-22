import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import "./WritePage.css";
import yellowStar from "../assets/노란별.png";
import grayStar from "../assets/회색별.png";
import StoreSelectModal from "../components/StoreSelectModal";

function createPreviewItem(file) {
  return {
    id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
    file,
    url: URL.createObjectURL(file),
    deleteUrl: null,
    isNew: true,
  };
}

function getReviewImages(reviewData) {
  if (Array.isArray(reviewData.images)) return reviewData.images;
  if (reviewData.image) return [{ url: reviewData.image, deleteUrl: reviewData.imageDeleteUrl || null }];
  return [];
}

async function deleteImgbbImage(deleteUrl) {
  if (!deleteUrl) return;

  await fetch(deleteUrl, {
    method: "GET",
    mode: "no-cors",
  });
}

function WritePage() {
  const navigate = useNavigate();
  const { reviewId } = useParams();
  const isEditMode = Boolean(reviewId);

  const [selectedStore, setSelectedStore] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [imageItems, setImageItems] = useState([]);
  const [removedImageDeleteUrls, setRemovedImageDeleteUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const imageItemsRef = useRef([]);

  const tags = [
    "#든든함",
    "#간편함",
    "#가성비",
    "#혼밥",
    "#카공",
    "#감성",
    "#단체",
  ];

  useEffect(() => {
    if (!isEditMode) return;

    const loadReview = async () => {
      try {
        const reviewSnapshot = await getDoc(doc(db, "reviews", reviewId));
        if (!reviewSnapshot.exists()) {
          alert("리뷰를 찾을 수 없습니다.");
          navigate("/");
          return;
        }

        const reviewData = reviewSnapshot.data();
        setSelectedStore({
          id: reviewData.kakaoPlaceId,
          name: reviewData.storeName,
          address: reviewData.storeAddress || "",
          category: reviewData.storeCategory || "",
          phone: reviewData.storePhone || "",
          placeUrl: reviewData.placeUrl || "",
          lat: reviewData.lat,
          lng: reviewData.lng,
          source: reviewData.source || "kakao",
        });
        setRating(reviewData.rating || 0);
        setSelectedTags(reviewData.tags || []);
        setReviewText(reviewData.reviewText || "");
        setImageItems(
          getReviewImages(reviewData).map((imageItem, index) => ({
            id: imageItem.url || `saved-${index}`,
            url: imageItem.url,
            deleteUrl: imageItem.deleteUrl || null,
            file: null,
            isNew: false,
          }))
        );
      } catch (error) {
        alert("리뷰를 불러오지 못했습니다.");
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    loadReview();
  }, [isEditMode, navigate, reviewId]);

  useEffect(() => {
    imageItemsRef.current = imageItems;
  }, [imageItems]);

  useEffect(() => {
    return () => {
      imageItemsRef.current.forEach((imageItem) => {
        if (imageItem.isNew) URL.revokeObjectURL(imageItem.url);
      });
    };
  }, []);

  const toggleTag = (tag) => {
    setSelectedTags((currentTags) =>
      currentTags.includes(tag)
        ? currentTags.filter((currentTag) => currentTag !== tag)
        : [...currentTags, tag]
    );
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    event.target.value = "";

    if (imageItems.length + files.length > 5) {
      alert("사진은 최대 5장까지 추가할 수 있습니다.");
      return;
    }

    setImageItems((currentItems) => [...currentItems, ...files.map(createPreviewItem)]);
  };

  const handleReplaceImage = (index, event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setImageItems((currentItems) => {
      const nextItems = [...currentItems];
      const previousItem = nextItems[index];

      if (previousItem?.isNew) URL.revokeObjectURL(previousItem.url);
      if (previousItem?.deleteUrl) {
        setRemovedImageDeleteUrls((currentUrls) => [...currentUrls, previousItem.deleteUrl]);
      }

      nextItems[index] = createPreviewItem(file);
      return nextItems;
    });
  };

  const handleDeleteImage = (index) => {
    setImageItems((currentItems) => {
      const targetItem = currentItems[index];
      if (targetItem?.isNew) URL.revokeObjectURL(targetItem.url);
      if (targetItem?.deleteUrl) {
        setRemovedImageDeleteUrls((currentUrls) => [...currentUrls, targetItem.deleteUrl]);
      }

      return currentItems.filter((_, itemIndex) => itemIndex !== index);
    });
  };

  const findExistingPlaceId = async () => {
    const placeQuery = query(
      collection(db, "places"),
      where("kakaoPlaceId", "==", selectedStore.id),
      limit(1)
    );
    const snapshot = await getDocs(placeQuery);

    if (!snapshot.empty) {
      return snapshot.docs[0].id;
    }

    return null;
  };

  const saveSelectedPlace = async () => {
    const existingPlaceId = await findExistingPlaceId();
    if (existingPlaceId) return existingPlaceId;

    const placeRef = await addDoc(collection(db, "places"), {
      kakaoPlaceId: selectedStore.id,
      name: selectedStore.name,
      category: selectedStore.category || "",
      address: selectedStore.address || "",
      phone: selectedStore.phone || "",
      placeUrl: selectedStore.placeUrl || "",
      lat: selectedStore.lat,
      lng: selectedStore.lng,
      source: selectedStore.source || "kakao",
      createdAt: serverTimestamp(),
    });

    return placeRef.id;
  };

  const uploadToImgbb = async (file) => {
    const apiKey = process.env.REACT_APP_IMGBB_API_KEY;

    if (!apiKey) {
      throw new Error("ImgBB API 키가 설정되지 않았습니다.");
    }

    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData,
    });
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result?.error?.message || "ImgBB 업로드에 실패했습니다.");
    }

    return {
      url: result.data.display_url || result.data.url,
      deleteUrl: result.data.delete_url || null,
    };
  };

  const uploadNewImages = async () => {
    const uploadedImages = await Promise.all(
      imageItems.map(async (imageItem) => {
        if (!imageItem.isNew) {
          return { url: imageItem.url, deleteUrl: imageItem.deleteUrl || null };
        }

        return uploadToImgbb(imageItem.file);
      })
    );

    return uploadedImages;
  };

  const deleteRemovedImages = async () => {
    await Promise.allSettled([...new Set(removedImageDeleteUrls)].map(deleteImgbbImage));
  };

  const buildReviewPayload = (placeId, images) => ({
    placeId,
    kakaoPlaceId: selectedStore.id,
    storeName: selectedStore.name,
    storeAddress: selectedStore.address || "",
    storeCategory: selectedStore.category || "",
    storePhone: selectedStore.phone || "",
    placeUrl: selectedStore.placeUrl || "",
    lat: selectedStore.lat,
    lng: selectedStore.lng,
    source: selectedStore.source || "kakao",
    rating,
    reviewText,
    tags: selectedTags,
    images,
    image: images[0]?.url || null,
    imageDeleteUrl: images[0]?.deleteUrl || null,
    date: new Date().toLocaleDateString(),
  });

  const saveReview = async (placeId) => {
    const reviewRef = doc(collection(db, "reviews"));
    const images = await uploadNewImages();

    await setDoc(reviewRef, {
      ...buildReviewPayload(placeId, images),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  };

  const updateReview = async (placeId) => {
    const images = await uploadNewImages();

    await updateDoc(doc(db, "reviews", reviewId), {
      ...buildReviewPayload(placeId, images),
      updatedAt: serverTimestamp(),
    });

    await deleteRemovedImages();
  };

  const handleSubmit = async () => {
    if (!selectedStore) {
      alert("먼저 가게를 선택해 주세요.");
      return;
    }

    if (rating === 0 || selectedTags.length === 0 || reviewText.trim() === "") {
      alert("평점, 태그, 리뷰 내용을 모두 입력해 주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const placeId = await saveSelectedPlace();

      if (isEditMode) {
        await updateReview(placeId);
        alert("리뷰가 수정되었습니다!");
      } else {
        await saveReview(placeId);
        alert(`${selectedStore.name} 리뷰가 저장되었습니다!`);
      }

      navigate("/");
    } catch (error) {
      alert(isEditMode ? "리뷰를 수정하지 못했습니다." : "리뷰를 저장하지 못했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="write-container">리뷰를 불러오는 중...</div>;
  }

  return (
    <div className="write-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        뒤로
      </button>

      <h2>{isEditMode ? "리뷰 수정" : "리뷰 작성"}</h2>

      <div className="store-selector">
        <p className="store-selector-header">가게</p>
        <div className="store-selector-body">
          <span className={`store-name-display ${!selectedStore ? "placeholder" : ""}`}>
            {selectedStore ? selectedStore.name : "가게를 선택해 주세요."}
          </span>
          <button className="find-store-button" onClick={() => setIsModalOpen(true)}>
            가게 찾기
          </button>
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
        <input
          type="file"
          accept="image/*"
          id="review-image-input"
          multiple
          onChange={handleImageChange}
          style={{ display: "none" }}
          disabled={imageItems.length >= 5}
        />
        <div className="image-upload-wrapper" style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {imageItems.length < 5 && (
            <label htmlFor="review-image-input" className="image-upload-label">
              <span className="upload-icon">+</span>
              <span className="upload-text">
                사진 추가
                <br />({imageItems.length}/5)
              </span>
            </label>
          )}
          {imageItems.map((imageItem, index) => (
            <div key={imageItem.id} className="preview-container" style={{ position: "relative" }}>
              <img src={imageItem.url} alt="미리보기" className="image-preview" />
              <input
                type="file"
                accept="image/*"
                id={`replace-image-${index}`}
                onChange={(event) => handleReplaceImage(index, event)}
                style={{ display: "none" }}
              />
              <label htmlFor={`replace-image-${index}`} className="replace-image-btn">
                수정
              </label>
              <button type="button" className="delete-image-btn" onClick={() => handleDeleteImage(index)}>
                x
              </button>
            </div>
          ))}
        </div>
      </div>

      <textarea
        className="review-textarea"
        value={reviewText}
        onChange={(event) => setReviewText(event.target.value)}
        placeholder="리뷰를 작성해 주세요."
      />

      <button className="submit-button" onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? "저장 중..." : isEditMode ? "수정 저장" : "리뷰 저장"}
      </button>

      <StoreSelectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectStore={setSelectedStore}
      />
    </div>
  );
}

export default WritePage;
