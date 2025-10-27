// Importér de nødvendige Firebase-funktioner
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔥 Din Firebase-konfiguration (fra Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyBaBan72lAaxWgiCp31B1KKQUH0RcuTYKs",
  authDomain: "streamaware-3f91a.firebaseapp.com",
  projectId: "streamaware-3f91a",
  storageBucket: "streamaware-3f91a.appspot.com",
  messagingSenderId: "959006923590",
  appId: "1:959006923590:web:bf9dfe1053dfb29a8ba347"
};

// 🧩 Initialiser Firebase
const app = initializeApp(firebaseConfig);

// 🔐 Authentication (login, sign-up, logout)
export const auth = getAuth(app);

// 🗂️ Firestore database (film, serier, brugere osv.)
export const db = getFirestore(app);

// 📦 Eksporter appen (valgfrit, men nyttigt)
export default app;
