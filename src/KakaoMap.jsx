import { useEffect, useRef } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import { loadKakaoMapSdk } from "./kakaoMapLoader";

const DEFAULT_CENTER = { lat: 37.5509, lng: 127.0738 };

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getPlacePosition(place) {
  if (typeof place.lat !== "number" || typeof place.lng !== "number") {
    return null;
  }

  return new window.kakao.maps.LatLng(place.lat, place.lng);
}

function getPlaceReviews(place, reviews) {
  return reviews.filter((review) => {
    if (review.placeId && review.placeId === place.id) return true;
    if (review.kakaoPlaceId && review.kakaoPlaceId === place.kakaoPlaceId) return true;
    return review.storeName === place.name;
  });
}

function buildInfoWindowContent(place, placeReviews) {
  const reviewItems =
    placeReviews.length > 0
      ? placeReviews
          .slice(0, 3)
          .map(
            (review) => `
              <li style="margin-top:8px;padding-top:8px;border-top:1px solid #eee">
                <div style="font-size:12px;color:#f5a400">${"★".repeat(review.rating || 0)}</div>
                <div style="margin-top:3px;font-size:12px;color:#444;line-height:1.35;overflow-wrap:anywhere;word-break:break-word">
                  ${escapeHtml(review.reviewText)}
                </div>
              </li>
            `
          )
          .join("")
      : `<li style="margin-top:8px;color:#777;font-size:12px">아직 등록된 리뷰가 없습니다.</li>`;

  return `
    <div style="box-sizing:border-box;width:260px;max-width:260px;padding:12px;white-space:normal;overflow-wrap:anywhere;word-break:break-word">
      <strong style="display:block;color:#222;font-size:14px;line-height:1.35;overflow-wrap:anywhere;word-break:break-word">
        ${escapeHtml(place.name || "이름 없는 장소")}
      </strong>
      <div style="margin-top:6px;color:#666;font-size:12px;line-height:1.35;overflow-wrap:anywhere;word-break:break-word">
        ${escapeHtml(place.address || "")}
      </div>
      <div style="margin-top:10px;font-size:12px;font-weight:bold;color:#2db400">
        리뷰 ${placeReviews.length}개
      </div>
      <ul style="list-style:none;padding:0;margin:0">
        ${reviewItems}
      </ul>
    </div>
  `;
}

function KakaoMap({ reviews = [], onSelectPlace, clearSelectionSignal = 0 }) {
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const infoWindowRef = useRef(null);
  const ignoreNextMapClickRef = useRef(false);

  useEffect(() => {
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
    }
  }, [clearSelectionSignal]);

  useEffect(() => {
    let unsubscribePlaces;
    let isMounted = true;

    loadKakaoMapSdk()
      .then(() => {
        if (!isMounted || !mapRef.current) return;

        const map = new window.kakao.maps.Map(mapRef.current, {
          center: new window.kakao.maps.LatLng(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng),
          level: 4,
        });

        infoWindowRef.current = new window.kakao.maps.InfoWindow();

        window.kakao.maps.event.addListener(map, "click", () => {
          if (ignoreNextMapClickRef.current) {
            ignoreNextMapClickRef.current = false;
            return;
          }

          infoWindowRef.current.close();
          onSelectPlace?.(null);
        });

        unsubscribePlaces = onSnapshot(collection(db, "places"), (snapshot) => {
          markersRef.current.forEach((marker) => marker.setMap(null));
          markersRef.current = [];
          infoWindowRef.current.close();

          const bounds = new window.kakao.maps.LatLngBounds();
          let markerCount = 0;
          let firstPosition = null;

          snapshot.forEach((docSnapshot) => {
            const place = { id: docSnapshot.id, ...docSnapshot.data() };
            const placeReviews = getPlaceReviews(place, reviews);
            const position = getPlacePosition(place);

            if (!position || placeReviews.length === 0) return;

            const marker = new window.kakao.maps.Marker({
              position,
              map,
              title: place.name,
            });

            window.kakao.maps.event.addListener(marker, "click", () => {
              ignoreNextMapClickRef.current = true;
              window.setTimeout(() => {
                ignoreNextMapClickRef.current = false;
              }, 0);
              infoWindowRef.current.setContent(buildInfoWindowContent(place, placeReviews));
              infoWindowRef.current.open(map, marker);
              onSelectPlace?.({ place, reviews: placeReviews });
            });

            markersRef.current.push(marker);
            bounds.extend(position);
            markerCount += 1;
            firstPosition = firstPosition || position;
          });

          if (markerCount === 1) {
            map.setCenter(firstPosition);
            map.setLevel(3);
          } else if (markerCount > 1) {
            map.setBounds(bounds);
          }
        });
      })
      .catch((error) => {
        console.error(error.message);
      });

    return () => {
      isMounted = false;
      if (unsubscribePlaces) unsubscribePlaces();
      markersRef.current.forEach((marker) => marker.setMap(null));
      if (infoWindowRef.current) infoWindowRef.current.close();
    };
  }, [onSelectPlace, reviews]);

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
}

export default KakaoMap;
