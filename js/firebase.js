// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// Firebase Ayarları
const firebaseConfig = {
  apiKey: "AIzaSyAQ0ses6c9fJnk5xDsh37-0-fLcCj-MVQw",
  authDomain: "neris-78944.firebaseapp.com",
  projectId: "neris-78944",
  storageBucket: "neris-78944.firebasestorage.app",
  messagingSenderId: "58960639184",
  appId: "1:58960639184:web:dc25f186f8887f64f1dad5"
};

// Firebase Başlat
const app = initializeApp(firebaseConfig);

// Firestore Başlat
const db = getFirestore(app);

// Dışa Aktar
export { db };