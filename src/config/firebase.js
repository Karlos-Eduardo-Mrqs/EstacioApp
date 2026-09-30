// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAhgQaYyqB-D3Qu13wpZUziPJ3N5ZEwrXc",
  authDomain: "estacio-app-658ae.firebaseapp.com",
  projectId: "estacio-app-658ae",
  storageBucket: "estacio-app-658ae.firebasestorage.app",
  messagingSenderId: "442365855841",
  appId: "1:442365855841:web:c9d7585e33990163534220",
  measurementId: "G-PR9T63R2Z2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);