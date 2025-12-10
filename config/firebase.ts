import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase config from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyBKF1P1gwMXnYp7vsbe0X-_U-jO6LMoTCc",
  authDomain: "my-calendar-d35e4.firebaseapp.com",
  projectId: "my-calendar-d35e4",
  storageBucket: "my-calendar-d35e4.firebasestorage.app",
  messagingSenderId: "494991583236",
  appId: "1:494991583236:web:e1f3a6d87e330462362d51",
  measurementId: "G-3HXDEMSK61"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth with AsyncStorage persistence
const auth = getAuth(app);


// Initialize Firestore
export const db = getFirestore(app);

export { app, auth };
