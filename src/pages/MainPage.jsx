import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NaverMap from "../NaverMap";
import ReviewCard from '../components/ReviewCard';
import './MainPage.css';

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

            // 1. 기본 더미 데이터 (isMine: false)
            const dummyData = [
                { Reviewid: 1, storeName: "맥도날드 세종대점", rating: 4, reviewText: "모짜렐라가 미국까지 늘어나요", tags: ["#간편한 한끼", "#혼밥"], image: null, isMine: false },
                { Reviewid: 2, storeName: "춘천골 닭갈비", rating: 5, reviewText: "닭갈비 양이 정말 많아요", tags: ["#든든한 한끼", "#가성비"], image: null, isMine: false }
            ];

            // 2. 사용자가 쓴 데이터 (isMine: true)
            const savedReviews = JSON.parse(localStorage.getItem('myReviews') || '[]').map(review => ({
                ...review,
                isMine: true // 내가 쓴 리뷰임을 표시
            }));

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
        </div>
    );
}

export default MainPage;