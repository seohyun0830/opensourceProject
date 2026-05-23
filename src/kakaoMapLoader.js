let kakaoMapSdkPromise;

export function loadKakaoMapSdk() {
  if (window.kakao?.maps?.services) {
    return Promise.resolve(window.kakao);
  }

  if (kakaoMapSdkPromise) {
    return kakaoMapSdkPromise;
  }

  const appKey = process.env.REACT_APP_KAKAO_JAVASCRIPT_KEY;

  kakaoMapSdkPromise = new Promise((resolve, reject) => {
    if (!appKey) {
      reject(new Error("Kakao JavaScript key is missing."));
      return;
    }

    const existingScript = document.querySelector("script[data-kakao-map-sdk]");
    if (existingScript) {
      existingScript.addEventListener("load", () => {
        window.kakao.maps.load(() => resolve(window.kakao));
      });
      existingScript.addEventListener("error", () => {
        reject(new Error("Failed to load Kakao map SDK."));
      });
      return;
    }

    const script = document.createElement("script");
    script.dataset.kakaoMapSdk = "true";
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&libraries=services&autoload=false`;
    script.async = true;

    script.onload = () => {
      if (!window.kakao?.maps) {
        reject(new Error("Kakao map SDK loaded without maps object."));
        return;
      }

      window.kakao.maps.load(() => resolve(window.kakao));
    };

    script.onerror = () => {
      reject(new Error("Failed to load Kakao map SDK."));
    };

    document.head.appendChild(script);
  });

  return kakaoMapSdkPromise;
}
