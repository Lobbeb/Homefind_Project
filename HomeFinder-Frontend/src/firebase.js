// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "homefind-627eb.firebaseapp.com",
  projectId: "homefind-627eb",
  storageBucket: "homefind-627eb.appspot.com",
  messagingSenderId: "193467655575",
  appId: "1:193467655575:web:05d76255111e406656d0d2",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
