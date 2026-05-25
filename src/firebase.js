import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD23qVAHdgQHfvkdjKI48QyuI5Fp_UbQhI",
  authDomain: "opensource-316fc.firebaseapp.com",
  projectId: "opensource-316fc",
  storageBucket: "opensource-316fc.firebasestorage.app",
  messagingSenderId: "302316016281",
  appId: "1:302316016281:web:d61e835d802e162659de08",
  measurementId: "G-PZJG68MQFQ"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth=getAuth(app);
