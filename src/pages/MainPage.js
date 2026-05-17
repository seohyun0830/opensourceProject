// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import NaverMap from "../NaverMap";
// import ReviewCard from '../components/ReviewCard';
// import './MainPage.css';

// function MainPage() {
//     const navigate = useNavigate();

//     const [reviews, setReviews] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [searchQuery, setSearchQuery] = useState("");
//     const [selectedCategory, setSelectedCategory] = useState("전체");
//     const [deletingId, setDeletingId] = useState(null);

//     useEffect(() => {
//         const fetchReviews = async () => {
//             setIsLoading(true);

//             //[리뷰 데이터들 서버 연결 필요]
//             const dummyData = [
//                 { Reviewid: 1, storeName: "맥도날드 세종대점", rating: 4, reviewText: "모짜렐라가 미국까지 늘어나요", tags: ["#간편한 한끼", "#혼밥"] },
//                 { Reviewid: 2, storeName: "춘천골 닭갈비", rating: 5, reviewText: "닭갈비 양이 정말 많아요", tags: ["#든든한 한끼", "#가성비"] }
//             ];

//             const savedReviews = JSON.parse(localStorage.getItem('myReviews') || '[]');
//             setReviews([...savedReviews, ...dummyData]);
//             setIsLoading(false);
//         };
//         fetchReviews();
//     }, []);

//     const handleSearch = (e) => setSearchQuery(e.target.value);

//     const handleDeleteReview = (id) => {
//         if (!window.confirm("이 리뷰를 정말 삭제하시겠습니까?")) return;

//         setDeletingId(id);

//         setTimeout(() => {
//             //[서버에서 리뷰 삭제]
//             setReviews(prev => prev.filter(review => review.Reviewid !== id));

//             const savedReviews = JSON.parse(localStorage.getItem('myReviews') || '[]');
//             const filteredSaved = savedReviews.filter(review => review.Reviewid !== id);
//             localStorage.setItem('myReviews', JSON.stringify(filteredSaved));

//             setDeletingId(null);
//         }, 300);
//     };

//     const isCategoryMatched = (reviewTags, category) => {
//         if (category === "전체") return true;
//         const categoryMap = {
//             "든든한 한끼": ["든든", "양"],
//             "간편한 한끼": ["간편", "혼밥"],
//             "가성비 한끼": ["가성비", "저렴", "싼"],
//             "글로벌 한끼": ["글로벌", "외국"],
//             "카공 카페": ["카공", "조용"],
//             "감성 카페": ["감성", "분위기", "예쁜"],
//             "회식/술자리": ["회식", "술", "단체"]
//         };
//         const keywords = categoryMap[category] || [category.split(' ')[0]];
//         return reviewTags.some(tag => keywords.some(keyword => tag.includes(keyword)));
//     };

//     const filteredReviews = reviews.filter(review => {
//         const matchesCategory = isCategoryMatched(review.tags, selectedCategory);
//         const matchesSearch = review.storeName.toLowerCase().includes(searchQuery.toLowerCase());
//         return matchesCategory && matchesSearch;
//     });

//     return (
//         <div className="main-container">
//             <h1 className="main-title">세종대 근처 맛집</h1>

//             <div className="search-container">
//                 <input
//                     type="text"
//                     placeholder="🔍 식당을 검색하세요"
//                     className="search-input"
//                     value={searchQuery}
//                     onChange={handleSearch}
//                 />
//             </div>

//             <div className="category-grid">
//                 {["전체", "든든한 한끼", "간편한 한끼", "가성비 한끼", "글로벌 한끼", "카공 카페", "감성 카페", "회식/술자리"].map(cat => (
//                     <button
//                         key={cat}
//                         className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
//                         onClick={() => setSelectedCategory(cat)}
//                     >
//                         {cat}
//                     </button>
//                 ))}
//             </div>

//             <div className="map-container">
//                 <NaverMap searchKeyword={searchQuery} />
//             </div>

//             <button onClick={() => navigate('/write')} className="fab-button">📝 리뷰 작성</button>

//             <h3 className="feed-title">
//                 {selectedCategory === "전체" ? "⭐ 실시간 뜨고 있는 맛집" : `📌 ${selectedCategory} 맛집`}
//             </h3>

//             {isLoading ? (
//                 <div className="loading-message">정보를 불러오는 중...</div>
//             ) : (
//                 <div className="review-feed">
//                     {filteredReviews.length > 0 ? (
//                         filteredReviews.map(review => (
//                             <ReviewCard
//                                 key={review.Reviewid}
//                                 {...review}
//                                 isDeleting={deletingId === review.Reviewid}
//                                 onDelete={() => handleDeleteReview(review.Reviewid)}
//                             />
//                         ))
//                     ) : (
//                         <div className="empty-message">해당 조건에 맞는 맛집이 없습니다.</div>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// }

// export default MainPage;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NaverMap from "../NaverMap";
import ReviewCard from '../components/ReviewCard';
<<<<<<< Updated upstream:src/pages/MainPage.js

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
=======
import './MainPage.css';
>>>>>>> Stashed changes:src/pages/MainPage.jsx

function MainPage() {
    const navigate = useNavigate();

    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("전체");
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            setIsLoading(true);

            //[리뷰 데이터들 서버 연결 필요]
            const dummyData = [
                { Reviewid: 1, storeName: "맥도날드 세종대점", rating: 4, reviewText: "모짜렐라가 미국까지 늘어나요", tags: ["#간편한 한끼", "#혼밥"], image: null },
                { Reviewid: 2, storeName: "춘천골 닭갈비", rating: 5, reviewText: "닭갈비 양이 정말 많아요", tags: ["#든든한 한끼", "#가성비"], image: null }
            ];

            const savedReviews = JSON.parse(localStorage.getItem('myReviews') || '[]');
            setReviews([...savedReviews, ...dummyData]);
            setIsLoading(false);
        };
        fetchReviews();
    }, []);

    const handleSearch = (e) => setSearchQuery(e.target.value);

    const handleDeleteReview = (id) => {
        if (!window.confirm("이 리뷰를 정말 삭제하시겠습니까?")) return;

        setDeletingId(id);

        setTimeout(() => {
            //[서버에서 리뷰 삭제]
            setReviews(prev => prev.filter(review => review.Reviewid !== id));

            const savedReviews = JSON.parse(localStorage.getItem('myReviews') || '[]');
            const filteredSaved = savedReviews.filter(review => review.Reviewid !== id);
            localStorage.setItem('myReviews', JSON.stringify(filteredSaved));

            setDeletingId(null);
        }, 300);
    };

    const isCategoryMatched = (reviewTags, category) => {
        if (category === "전체") return true;
        const categoryMap = {
            "든든한 한끼": ["든든", "양"],
            "간편한 한끼": ["간편", "혼밥"],
            "가성비 한끼": ["가성비", "저렴", "싼"],
            "글로벌 한끼": ["글로벌", "외국"],
            "카공 카페": ["카공", "조용"],
            "감성 카페": ["감성", "분위기", "예쁜"],
            "회식/술자리": ["회식", "술", "단체"]
        };
        const keywords = categoryMap[category] || [category.split(' ')[0]];
        return reviewTags.some(tag => keywords.some(keyword => tag.includes(keyword)));
    };

    const filteredReviews = reviews.filter(review => {
        const matchesCategory = isCategoryMatched(review.tags, selectedCategory);
        const matchesSearch = review.storeName.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            console.log("엔터키 감지: ", searchQuery);
        }
    };

    return (
<<<<<<< Updated upstream:src/pages/MainPage.js
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
=======
        <div className="main-container">
            <h1 className="main-title">세종대 근처 맛집</h1>

            <div className="search-container">
                <input
                    type="text"
                    placeholder="🔍 식당을 검색하세요"
                    className="search-input"
                    value={searchQuery}
                    onChange={handleSearch}
                    onKeyDown={handleKeyDown}
                />
            </div>

            <div className="category-grid">
                {["전체", "든든한 한끼", "간편한 한끼", "가성비 한끼", "글로벌 한끼", "카공 카페", "감성 카페", "회식/술자리"].map(cat => (
                    <button
                        key={cat}
                        className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="map-container">
                <NaverMap searchKeyword={searchQuery} />
            </div>

            <button onClick={() => navigate('/write')} className="fab-button">📝 리뷰 작성</button>

            <h3 className="feed-title">
                {selectedCategory === "전체" ? "⭐ 실시간 뜨고 있는 맛집" : `📌 ${selectedCategory} 맛집`}
            </h3>

            {isLoading ? (
                <div className="loading-message">정보를 불러오는 중...</div>
            ) : (
                <div className="review-feed">
                    {filteredReviews.length > 0 ? (
                        filteredReviews.map(review => (
                            <ReviewCard
                                key={review.Reviewid}
                                {...review}
                                isDeleting={deletingId === review.Reviewid}
                                onDelete={() => handleDeleteReview(review.Reviewid)}
                            />
                        ))
                    ) : (
                        <div className="empty-message">해당 조건에 맞는 맛집이 없습니다.</div>
                    )}
                </div>
            )}
>>>>>>> Stashed changes:src/pages/MainPage.jsx
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