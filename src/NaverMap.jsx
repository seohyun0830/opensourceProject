// /* global naver */
// import { useEffect, useRef } from "react";
// import { db } from "./firebase";
// import { collection, getDocs } from "firebase/firestore";

// function NaverMap() {
//   const mapRef = useRef(null);

//   useEffect(() => {
//     const map = new window.naver.maps.Map(mapRef.current, {
//       center: new window.naver.maps.LatLng(37.5665, 126.9780),
//       zoom: 15,
//     });

//     // Firebase에서 장소 불러와서 마커 찍기
//     const loadMarkers = async () => {
//       const snapshot = await getDocs(collection(db, "places"));
//       snapshot.forEach((doc) => {
//         const { name, lat, lng } = doc.data();

//         const marker = new window.naver.maps.Marker({
//           position: new window.naver.maps.LatLng(lat, lng),
//           map: map,
//           title: name,
//         });

//         // 마커 클릭하면 이름 팝업
//         window.naver.maps.Event.addListener(marker, "click", () => {
//           new window.naver.maps.InfoWindow({
//             content: `<div style="padding:10px">${name}</div>`,
//           }).open(map, marker);
//         });
//       });
//     };

//     loadMarkers();
//   }, []);

//   return (
//     <div ref={mapRef} style={{ width: "100%", height: "600px" }} />
//   );
// }

// export default NaverMap;

/* global naver */
import { useEffect, useRef, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

function NaverMap({ searchKeyword }) {
  const containerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [allPlaces, setAllPlaces] = useState([]);
  const markersRef = useRef([]);

  //지도 초기화 및 로드
  useEffect(() => {
    if (!containerRef.current || mapInstanceRef.current) return;

    const initMap = () => {
      const map = new window.naver.maps.Map(containerRef.current, {
        center: new window.naver.maps.LatLng(37.5502, 127.0731),
        zoom: 16,
        zoomControl: true,
      });
      mapInstanceRef.current = map;
      console.log("✅ 지도 객체 생성 완료");
    };

    if (window.naver && window.naver.maps) {
      initMap();
    }

    const loadData = async () => {
      try {
        const snapshot = await getDocs(collection(db, "places"));
        const places = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAllPlaces(places);
      } catch (err) {
        console.error("Firebase 로드 에러:", err);
      }
    };
    loadData();
  }, []);

  // 2. 검색어 대응 로직 (마커 업데이트 + 강제 이동)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !window.naver || !window.naver.maps) return;

    //기존 마커 삭제
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    //전체 표시
    if (!searchKeyword || searchKeyword.trim() === "") {
      allPlaces.forEach(place => {
        const marker = new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(place.lat, place.lng),
          map: map,
        });
        markersRef.current.push(marker);
      });
      return;
    }

    //검색어 필터링
    const query = searchKeyword.trim().replace(/\s+/g, "").toLowerCase();
    const filtered = allPlaces.filter(p =>
      p.name.replace(/\s+/g, "").toLowerCase().includes(query)
    );

    //필터링 결과처리
    if (filtered.length > 0) {
      // 마커 찍기
      filtered.forEach(place => {
        const marker = new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(place.lat, place.lng),
          map: map,
        });
        markersRef.current.push(marker);
      });

      //지도 이동 로직
      const { lat, lng } = filtered[0];
      const targetPos = new window.naver.maps.LatLng(lat, lng);

      console.log(`🚀 ${filtered[0].name}으로 이동 시도`);
      map.setZoom(17);
      map.panTo(targetPos);

    } else {
      //DB에 없는 주소면 강제 검색
      if (window.naver.maps.Service && window.naver.maps.Service.geocode) {
        window.naver.maps.Service.geocode({ query: searchKeyword }, (status, response) => {
          if (status === window.naver.maps.Service.Status.OK && response.v2.addresses.length > 0) {
            const result = response.v2.addresses[0];
            const newPos = new window.naver.maps.LatLng(result.y, result.x);
            console.log(`🚀 주소 검색 결과로 이동: ${result.roadAddress}`);
            map.setZoom(17);
            map.panTo(newPos);
          }
        });
      }
    }
  }, [searchKeyword, allPlaces]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        minHeight: "350px",
        borderRadius: "12px",
        border: "1px solid #ddd"
      }}
    />
  );
}

export default NaverMap;