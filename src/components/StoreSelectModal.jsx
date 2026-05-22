import React, { useState } from "react";
import "./StoreSelectModal.css";
import { loadKakaoMapSdk } from "../kakaoMapLoader";

function StoreSelectModal({ isOpen, onClose, onSelectStore }) {
  const [keyword, setKeyword] = useState("");
  const [stores, setStores] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [message, setMessage] = useState("");

  const handleSearch = (event) => {
    event.preventDefault();

    const query = keyword.trim();
    if (!query) {
      setMessage("검색어를 입력해 주세요.");
      return;
    }

    setIsSearching(true);
    setMessage("");

    loadKakaoMapSdk()
      .then(() => {
        const places = new window.kakao.maps.services.Places();
        places.keywordSearch(query, (data, status) => {
          setIsSearching(false);

          if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
            setStores([]);
            setMessage("검색 결과가 없습니다.");
            return;
          }

          if (status !== window.kakao.maps.services.Status.OK) {
            setStores([]);
            setMessage("장소를 검색하지 못했습니다. 다시 시도해 주세요.");
            return;
          }

          const items = data.map((item) => ({
            id: item.id,
            name: item.place_name,
            category: item.category_name || "",
            address: item.road_address_name || item.address_name || "",
            phone: item.phone || "",
            placeUrl: item.place_url || "",
            lat: Number(item.y),
            lng: Number(item.x),
            source: "kakao",
          }));

          setStores(items);
          setMessage("");
        });
      })
      .catch(() => {
        setIsSearching(false);
        setMessage("JavaScript 키를 확인해 주세요.");
      });
  };

  const handleSelect = (store) => {
    onSelectStore(store);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>가게 찾기</h3>

        <form className="store-search-form" onSubmit={handleSearch}>
          <input
            className="store-search-input"
            type="text"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="예: 세종대 카페"
          />
          <button className="store-search-button" type="submit" disabled={isSearching}>
            {isSearching ? "검색 중..." : "찾기"}
          </button>
        </form>

        {message && <p className="store-search-message">{message}</p>}

        <ul className="store-list">
          {stores.map((store) => (
            <li key={store.id} className="store-item" onClick={() => handleSelect(store)}>
              <strong>{store.name}</strong>
              <span>{store.category}</span>
              <small>{store.address}</small>
              {store.phone && <small>{store.phone}</small>}
            </li>
          ))}
        </ul>

        <button className="close-modal-button" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
}

export default StoreSelectModal;
