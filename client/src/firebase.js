import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBBqSVKC87-ZXg2Du2G35shVeFTSRHtzDc",
  authDomain: "chattranslator-15830.firebaseapp.com",
  projectId: "chattranslator-15830",
  storageBucket: "chattranslator-15830.firebasestorage.app",
  messagingSenderId: "401039750509",
  appId: "1:401039750509:web:bc0ddc851dec5dcfdf5664",
  measurementId: "G-QDNC6NXLNC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
