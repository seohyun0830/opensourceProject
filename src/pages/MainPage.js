import React from 'react';
import { useNavigate } from 'react-router-dom';
import NaverMap from "../NaverMap";
import ReviewCard from '../components/ReviewCard';

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
        <div style={{ padding: '20px', backgroundColor: '#F5F5F5', minHeight: '100vh', textAlign: 'center' }}>
            {/*헤더*/}
            <h1 style={{ textAlign: "center", color: "#2db400", marginBottom: '20px' }}>
                리뷰 메인페이지
            </h1>

            {/*검색*/}
            <div style={{ marginBottom: '20px' }}>
                <input type="text" placeholder="🔍 식당을 검색하세요" style={searchStyle} />
            </div>

            {/*카테고리*/}
            <div style={gridStyle}>
                {["든든한 한끼", "간편한 한끼", "글로벌 한끼", "카공 카페", "감성 카페", "회식/술자리", "기타"].map(cat => (
                    <button key={cat} style={btnStyle}>{cat}</button>
                ))}
            </div>

            {/*지도*/}
            <div style={mapContainerStyle}>
                <NaverMap />
            </div>

            {/*리뷰작성 버튼*/}
            <button
                onClick={() => navigate('/write')}
                style={fabStyle}
            >
                📝 리뷰 작성
            </button>

            {/*실시간 피드*/}
            <h3 style={{ textAlign: 'left', marginLeft: '10px' }}>⭐ 실시간 뜨고 있는 맛집</h3>
            {ReviewDB.map(review => (
                <ReviewCard
                    key={review.Rid}
                    storeName={review.storeName}
                    rating={review.rating}
                    reviewText={review.reviewText}
                    tags={review.tags}
                />
            ))}
        </div>
    );
}

//스타일 정의들
const searchStyle = { width: '90%', padding: '12px', borderRadius: '25px', border: '1px solid #000' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '20px' };
const btnStyle = { padding: '8px 4px', fontSize: '0.75rem', borderRadius: '15px', border: '1px solid #ccc', backgroundColor: '#f5f8c8' };
const mapContainerStyle = { height: '300px', borderRadius: '12px', overflow: 'hidden', marginBottom: '25px', border: '1px solid #ccc' };

const fabStyle = {
    position: 'fixed',
    bottom: '30px',
    right: '20px',
    padding: '15px 25px',
    backgroundColor: '#2db400',
    color: 'white',
    borderRadius: '30px',
    border: 'none',
    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
    fontWeight: 'bold',
    cursor: 'pointer',
    zIndex: 1000
};

export default MainPage;