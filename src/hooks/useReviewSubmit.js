import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { addDoc, collection, doc, getDoc, getDocs, limit, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { auth, db } from "../firebase";

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
  await fetch(deleteUrl, { method: "GET", mode: "no-cors" });
}

export function useReviewSubmit(reviewId) {
  const navigate = useNavigate();
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

  useEffect(() => { imageItemsRef.current = imageItems; }, [imageItems]);

  useEffect(() => {
    return () => {
      imageItemsRef.current.forEach((imageItem) => {
        if (imageItem.isNew) URL.revokeObjectURL(imageItem.url);
      });
    };
  }, []);

  const toggleTag = (tag) => {
    setSelectedTags((currentTags) =>
      currentTags.includes(tag) ? currentTags.filter((t) => t !== tag) : [...currentTags, tag]
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
      if (previousItem?.deleteUrl) setRemovedImageDeleteUrls((urls) => [...urls, previousItem.deleteUrl]);
      nextItems[index] = createPreviewItem(file);
      return nextItems;
    });
  };

  const handleDeleteImage = (index) => {
    setImageItems((currentItems) => {
      const targetItem = currentItems[index];
      if (targetItem?.isNew) URL.revokeObjectURL(targetItem.url);
      if (targetItem?.deleteUrl) setRemovedImageDeleteUrls((urls) => [...urls, targetItem.deleteUrl]);
      return currentItems.filter((_, itemIndex) => itemIndex !== index);
    });
  };

  const findExistingPlaceId = async () => {
    const placeQuery = query(collection(db, "places"), where("kakaoPlaceId", "==", selectedStore.id), limit(1));
    const snapshot = await getDocs(placeQuery);
    return !snapshot.empty ? snapshot.docs[0].id : null;
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
    if (!apiKey) throw new Error("ImgBB API 키가 설정되지 않았습니다.");

    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, { method: "POST", body: formData });
    const result = await response.json();

    if (!response.ok || !result.success) throw new Error(result?.error?.message || "ImgBB 업로드에 실패했습니다.");
    return { url: result.data.display_url || result.data.url, deleteUrl: result.data.delete_url || null };
  };

  const uploadNewImages = async () => {
    return Promise.all(
      imageItems.map(async (imageItem) => {
        if (!imageItem.isNew) return { url: imageItem.url, deleteUrl: imageItem.deleteUrl || null };
        return uploadToImgbb(imageItem.file);
      })
    );
  };

  const deleteRemovedImages = async () => {
    await Promise.allSettled([...new Set(removedImageDeleteUrls)].map(deleteImgbbImage));
  };

  const buildReviewPayload = (placeId, images) => ({
    userId: auth.currentUser?.uid || null,
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
    await setDoc(reviewRef, { ...buildReviewPayload(placeId, images), createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  };

  const updateReview = async (placeId) => {
    const images = await uploadNewImages();
    await updateDoc(doc(db, "reviews", reviewId), { ...buildReviewPayload(placeId, images), updatedAt: serverTimestamp() });
    await deleteRemovedImages();
  };

  const handleSubmit = async () => {
    if (!auth.currentUser) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/");
      return;
    }
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

  return {
    isEditMode, selectedStore, setSelectedStore, isModalOpen, setIsModalOpen,
    rating, setRating, selectedTags, toggleTag, reviewText, setReviewText,
    imageItems, handleImageChange, handleReplaceImage, handleDeleteImage,
    isLoading, isSubmitting, handleSubmit, navigate
  };
}