import React from 'react';
import { useNavigate } from 'react-router-dom';
import NaverMap from "../NaverMap";
import ReviewCard from '../components/ReviewCard';
import './MainPage.css'; 

const ReviewDB = [
    {
        Reviewid: 1,
        storeName: "맥도날드 세종대점",
        rating: 4,
        reviewText: "모짜렐라가 미국까지 늘어나요",
        tags: ["#간편해요", "#혼밥"]
    },
    {
        Reviewid: 2,
        storeName: "춘천골 닭갈비",
        rating: 5,
        reviewText: "닭갈비 양이 정말 많아요",
        tags: ["#든든해요", "#가성비"]
    }
];

function MainPage() {
    const navigate = useNavigate();

    return (
        <div className="main-container">
            {/*헤더*/}
            <h1 className="main-title">
                세종대 근처 맛집
            </h1>

            {/*검색*/}
            <div className="search-container">
                <input type="text" placeholder="🔍 식당을 검색하세요" className="search-input" />
            </div>

            {/*카테고리*/}
            <div className="category-grid">
                {["든든한 한끼", "간편한 한끼", "글로벌 한끼", "카공 카페", "감성 카페", "회식/술자리", "기타"].map(cat => (
                    <button key={cat} className="category-btn">{cat}</button>
                ))}
            </div>

            {/*지도*/}
            <div className="map-container">
                <NaverMap />
            </div>

            {/*리뷰작성 버튼*/}
            <button
                onClick={() => navigate('/write')}
                className="fab-button"
            >
                📝 리뷰 작성
            </button>

            {/*실시간 피드*/}
            <h3 className="feed-title">⭐ 실시간 뜨고 있는 맛집</h3>
            {ReviewDB.map(review => (
                <ReviewCard
                    key={review.Reviewid} // 🐛 오타 수정: review.Rid -> review.Reviewid
                    storeName={review.storeName}
                    rating={review.rating}
                    reviewText={review.reviewText}
                    tags={review.tags}
                />
            ))}
        </div>
    );
}

export default MainPage;