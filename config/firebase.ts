// Import the functions you need from the SDKs you need
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCIvlc9kCENC3olKOi7qvpiCcAKqYzXxRc",
  authDomain: "expense-tracker-8dff7.firebaseapp.com",
  projectId: "expense-tracker-8dff7",
  storageBucket: "expense-tracker-8dff7.firebasestorage.app",
  messagingSenderId: "646981792718",
  appId: "1:646981792718:web:64f1029cdcc9593633b19f",
  measurementId: "G-YY1WFW3626"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
})

export const firestore = getFirestore(app)

const analytics = getAnalytics(app);
