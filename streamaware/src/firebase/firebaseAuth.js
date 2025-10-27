// Import Firebase functions
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// 👇 Your Firebase Auth app configuration
const firebaseAuthConfig = {
  apiKey: "AIzaSyC1yei4KQeu6i58hFmXSUsNHs38d3U3C3I",
  authDomain: "streamaware-app.firebaseapp.com",
  projectId: "streamaware-app",
  storageBucket: "streamaware-app.firebasestorage.app",
  messagingSenderId: "260697150513",
  appId: "1:260697150513:web:b40e48f95a91eda2b7b110"
};

// 👇 Initialize this Firebase app (named so it doesn’t conflict with your dataApp later)
const authApp = initializeApp(firebaseAuthConfig, "authApp");

// 👇 Get Firebase Authentication service for this app
export const auth = getAuth(authApp);
