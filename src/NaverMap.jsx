/* global naver */
import { useEffect, useRef } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

function NaverMap() {
  const mapRef = useRef(null);

  useEffect(() => {
    const map = new window.naver.maps.Map(mapRef.current, {
      center: new window.naver.maps.LatLng(37.5665, 126.9780),
      zoom: 15,
    });

    // Firebase에서 장소 불러와서 마커 찍기
    const loadMarkers = async () => {
      const snapshot = await getDocs(collection(db, "places"));
      snapshot.forEach((doc) => {
        const { name, lat, lng } = doc.data();

        const marker = new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(lat, lng),
          map: map,
          title: name,
        });

        // 마커 클릭하면 이름 팝업
        window.naver.maps.Event.addListener(marker, "click", () => {
          new window.naver.maps.InfoWindow({
            content: `<div style="padding:10px">${name}</div>`,
          }).open(map, marker);
        });
      });
    };

    loadMarkers();
  }, []);

  return (
    <div ref={mapRef} style={{ width: "100%", height: "600px" }} />
  );
}

export default NaverMap;