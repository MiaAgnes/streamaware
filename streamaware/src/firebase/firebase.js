// Importér de nødvendige Firebase-funktioner
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔥 Your NEW Firebase configuration from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyDVv2A230kO4rfrWyUpocZonZQ37cEdv6k",
  authDomain: "streamaware-app-3093a.firebaseapp.com",
  projectId: "streamaware-app-3093a",
  storageBucket: "streamaware-app-3093a.firebasestorage.app",
  messagingSenderId: "229925050973",
  appId: "1:229925050973:web:b31b592120302a8d3c0bb4"
};

// 🧩 Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log("✅ Firebase initialized successfully with new project:", firebaseConfig.projectId);
} catch (error) {
  console.error("❌ Firebase initialization error:", error);
  throw new Error("Failed to initialize Firebase: " + error.message);
}

// 🔐 Authentication (login, sign-up, logout)
export const auth = getAuth(app);

// 🗂️ Firestore database (film, serier, brugere osv.)
export const db = getFirestore(app);

// 📦 Eksporter appen (valgfrit, men nyttigt)
export default app;
