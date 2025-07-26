// src/firebase/config.js

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBuO5owWE88vsxKDzNchsf4v4KiYXvWgMU",
  authDomain: "quorith-78c19.firebaseapp.com",
  projectId: "quorith-78c19",
  storageBucket: "quorith-78c19.firebasestorage.app",
  messagingSenderId: "913548830286",
  appId: "1:913548830286:web:deedfd46b30eb2d2c0851f",
  measurementId: "G-BJ60F0YTKQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();