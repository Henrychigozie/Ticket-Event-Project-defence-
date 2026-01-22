// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAk7X_rv4tMKNmB4s-cqhYhBmn50rDtX0Y",
  authDomain: "tix-ph.firebaseapp.com",
  projectId: "tix-ph",
  storageBucket: "tix-ph.firebasestorage.app",
  messagingSenderId: "96856975194",
  appId: "1:96856975194:web:46aec0b9b5039c4d0b3563",
  measurementId: "G-605R5GTC71"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);  // This is your database
export const auth = getAuth(app);    // This handles user login
export default app;