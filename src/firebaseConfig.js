import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBwbWOw_7aCIlzzXYGhjypsmLV387WqwhI",
    authDomain: "collin-onboarding-project.firebaseapp.com",
    projectId: "collin-onboarding-project",
    storageBucket: "collin-onboarding-project.appspot.com",
    messagingSenderId: "841292244567",
    appId: "1:841292244567:web:d88f03ef8b792422a66512",
    measurementId: "G-ZH61KS3DLF"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
const auth = getAuth(app);
const firestore = getFirestore(app); // Initialize Firestore

export { auth, firestore }; // Export only auth and firestore if using Firestore
export default app;
