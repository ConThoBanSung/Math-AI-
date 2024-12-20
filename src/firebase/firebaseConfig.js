// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCJT4iBkqMTy5qyyGAvHBK2pUpT30pIOQc",
    authDomain: "chatgpt-49032.firebaseapp.com",
    projectId: "chatgpt-49032",
    storageBucket: "chatgpt-49032.firebasestorage.app",
    messagingSenderId: "565934824596",
    appId: "1:565934824596:web:b5d89b053247516bc2e881",
    measurementId: "G-VN1E5RFDCT"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
