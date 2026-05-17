import React from 'react';
import './StoreSelectModal.css'; 

function StoreSelectModal({ isOpen, onClose, onSelectStore }) {
  // 일단은 하드코딩
  // 나중에 db랑 연결
  const storeList = [
    { id: 1, name: "맥도날드 세종대점" },
    { id: 2, name: "은혜떡볶이" },
    { id: 3, name: "미식당" },
    { id: 4, name: "화양제일시장 족발" },
    { id: 5, name: "빠오즈푸" }
  ];

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>가게 선택하기</h3>
        <ul className="store-list">
          {storeList.map((store) => (
            <li 
              key={store.id} 
              className="store-item"
              onClick={() => {
                onSelectStore(store); 
                onClose();            
              }}
            >
              {store.name}
            </li>
          ))}
        </ul>
        <button className="close-modal-button" onClick={onClose}>닫기</button>
      </div>
    </div>
  );
}

export default StoreSelectModal;