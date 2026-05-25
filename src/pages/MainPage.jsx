import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import KakaoMap from "../KakaoMap";
import ReviewCard from "../components/ReviewCard";
import "./MainPage.css";

const categories = [
  "전체",
  "든든함",
  "간편함",
  "가성비",
  "혼밥",
  "카공",
  "감성",
  "단체",
];

async function deleteImgbbImage(deleteUrl) {
  if (!deleteUrl) return;
  await fetch(deleteUrl, { method: "GET", mode: "no-cors" });
}

function MainPage() {
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [deletingId, setDeletingId] = useState(null);
  const [selectedMapPlace, setSelectedMapPlace] = useState(null);
  const [mapClearSignal, setMapClearSignal] = useState(0);
  const [showMyReviewsOnly, setShowMyReviewsOnly] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    const reviewsQuery = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
    const unsubscribeSnapshot = onSnapshot(
      reviewsQuery,
      (snapshot) => {
        const currentUser = auth.currentUser;
        const nextReviews = snapshot.docs.map((reviewDoc) => {
          const data = reviewDoc.data();
          return {
            Reviewid: reviewDoc.id,
            reviewDocId: reviewDoc.id,
            isMine: currentUser && data.userId === currentUser.uid,
            ...data,
          };
        });
        setReviews(nextReviews);
        setIsLoading(false);
      },
      () => {
        setIsLoading(false);
        alert("리뷰를 불러올 수 없습니다");
      }
    );

    return () => {
      unsubscribeAuth();
      unsubscribeSnapshot();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("로그아웃 되었습니다.");
      setShowMyReviewsOnly(false);
      navigate("/");
    } catch (error) {
      alert("로그아웃에 실패했습니다.");
    }
  };

  const deletePlaceIfUnused = async (placeId) => {
    if (!placeId) return;
    const remainingReviews = await getDocs(query(collection(db, "reviews"), where("placeId", "==", placeId)));
    if (remainingReviews.empty) {
      await deleteDoc(doc(db, "places", placeId));
    }
  };

  const deleteReviewImages = async (review) => {
    const imageDeleteUrls = Array.isArray(review.images)
      ? review.images.map((imageItem) => imageItem.deleteUrl).filter(Boolean)
      : review.imageDeleteUrl ? [review.imageDeleteUrl] : [];
    await Promise.allSettled(imageDeleteUrls.map(deleteImgbbImage));
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm("리뷰를 삭제하시겠습니까?")) return;
    const targetReview = reviews.find((review) => review.Reviewid === id);
    setDeletingId(id);
    try {
      await deleteReviewImages(targetReview);
      await deleteDoc(doc(db, "reviews", id));
      await deletePlaceIfUnused(targetReview?.placeId);
    } catch (error) {
      alert("리뷰를 삭제하지 못했습니다.");
    } finally {
      setDeletingId(null);
    }
  };

  const isCategoryMatched = (reviewTags, category) => {
    if (category === "전체") return true;
    const categoryMap = {
      "든든함": ["든든", "양많음", "양 많음", "hearty", "large", "amount"],
      "간편함": ["간편", "빠른식사", "빠른 식사", "quick", "no-wait"],
      "가성비": ["가성비", "저렴", "value", "cheap"],
      "혼밥": ["혼밥", "solo"],
      "카공": ["카공", "조용함", "study", "quiet"],
      "감성": ["감성", "아늑함", "cozy", "date", "mood"],
      "단체": ["단체", "group", "large"],
    };
    const keywords = categoryMap[category] || [];
    return reviewTags.some((tag) => keywords.some((keyword) => tag.toLowerCase().includes(keyword)));
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesMyReview = !showMyReviewsOnly || review.isMine;
    const matchesCategory = isCategoryMatched(review.tags || [], selectedCategory);
    const matchesSearch = (review.storeName || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMyReview && matchesCategory && matchesSearch;
  });

  const mapReviews = selectedMapPlace ? reviews : filteredReviews;

  const selectedPlaceReviews = selectedMapPlace
    ? reviews.filter((review) => {
        const place = selectedMapPlace.place;
        if (review.placeId && review.placeId === place.id) return true;
        if (review.kakaoPlaceId && review.kakaoPlaceId === place.kakaoPlaceId) return true;
        return review.storeName === place.name;
      })
    : [];

  const handleSelectMapPlace = (selection) => {
    setSelectedMapPlace(selection);
    if (!selection) {
      setSelectedCategory("전체");
    }
  };

  const handleSelectCategory = (category) => {
    setSelectedMapPlace(null);
    setMapClearSignal((currentSignal) => currentSignal + 1);
    setSelectedCategory(category);
  };

  const handleWriteClick = () => {
    if (!auth.currentUser) {
      alert("리뷰를 작성하려면 로그인이 필요합니다.");
      navigate("/login");
    } else {
      navigate("/write");
    }
  };

  return (
    <div className="main-container">
      <header className="main-header">
        <div className="header-logo" onClick={() => { setShowMyReviewsOnly(false); setSelectedCategory("전체"); setSelectedMapPlace(null); }} style={{ cursor: "pointer" }}>
          {user ? `${user.displayName || "유저"}님 안녕하세요!` : "세종대 맛집 탐방"}
        </div>
        <div className="header-nav">
          {user ? (
            <>
              <button 
                className={`nav-btn ${showMyReviewsOnly ? "active" : ""}`} 
                onClick={() => setShowMyReviewsOnly(!showMyReviewsOnly)}
              >
                {showMyReviewsOnly ? "전체 리뷰 보기" : "내가 쓴 리뷰"}
              </button>
              <button className="nav-btn logout-btn" onClick={handleLogout}>
                로그아웃
              </button>
            </>
          ) : (
            <button className="nav-btn login-btn" onClick={() => navigate("/login")}>
              로그인
            </button>
          )}
        </div>
      </header>

      <div className="search-container">
        <input
          type="text"
          placeholder="가게 이름으로 리뷰 검색"
          className="search-input"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
      </div>

      <div className="category-grid">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? "active" : ""}`}
            onClick={() => handleSelectCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="map-container">
        <KakaoMap
          reviews={mapReviews}
          onSelectPlace={handleSelectMapPlace}
          clearSelectionSignal={mapClearSignal}
        />
      </div>

      {selectedMapPlace && selectedPlaceReviews.length > 0 && (
        <div className="map-review-section">
          <h3 className="feed-title">{selectedMapPlace.place.name} 리뷰</h3>
          <div className="review-feed">
            {selectedPlaceReviews.map((review) => (
              <ReviewCard
                key={review.Reviewid}
                {...review}
                isDeleting={deletingId === review.Reviewid}
                onDelete={() => handleDeleteReview(review.Reviewid)}
                onEdit={() => navigate(`/write/${review.Reviewid}`)}
              />
            ))}
          </div>
        </div>
      )}

      <button onClick={handleWriteClick} className="fab-button">
        리뷰 쓰기
      </button>

      {!selectedMapPlace && (
        <>
          <h3 className="feed-title">
            {showMyReviewsOnly 
              ? "내가 작성한 리뷰" 
              : selectedCategory === "전체" ? "전체 리뷰" : `${selectedCategory} 리뷰`
            }
          </h3>

          {isLoading ? (
            <div className="loading-message">불러오는 중...</div>
          ) : (
            <div className="review-feed">
              {filteredReviews.length > 0 ? (
                filteredReviews.map((review) => (
                  <ReviewCard
                    key={review.Reviewid}
                    {...review}
                    isDeleting={deletingId === review.Reviewid}
                    onDelete={() => handleDeleteReview(review.Reviewid)}
                    onEdit={() => navigate(`/write/${review.Reviewid}`)}
                  />
                ))
              ) : (
                <div className="empty-message">등록된 리뷰가 없습니다.</div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
export default MainPage;