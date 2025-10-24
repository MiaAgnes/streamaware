// Import Firebase functions
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 👇 Your Firebase Data app configuration
const firebaseDataConfig = {
  apiKey: "AIzaSyC1yei4KQeu6i58hFmXSUsNHs38d3U3C3I",
  authDomain: "streamaware-app.firebaseapp.com",
  projectId: "streamaware-app",
  storageBucket: "streamaware-app.firebasestorage.app",
  messagingSenderId: "260697150513",
  appId: "1:260697150513:web:106157bd6f402402b7b110"
};

// 👇 Initialize this Firebase app as "dataApp"
// (This name keeps it separate from your authApp)
const dataApp = initializeApp(firebaseDataConfig, "dataApp");

// 👇 Get Firestore instance (for movies & series data)
export const db = getFirestore(dataApp);
