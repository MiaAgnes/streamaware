import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

// Sign up (ny bruger)
export const registerUser = async (email, password, username, country) => {
  try {
    console.log("🔄 Attempting to register user:", email);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Gem ekstra brugerinfo i Firestore
    await setDoc(doc(db, "users", user.uid), {
      username: username,
      email: email,
      country: country,
      favorites: []
    });

    console.log("✅ Bruger oprettet:", user.uid);
    return user;
  } catch (error) {
    console.error("❌ Fejl ved oprettelse:", error);
    console.error("❌ Error code:", error.code);
    console.error("❌ Error message:", error.message);
    throw error;
  }
};

// Login
export const loginUser = async (email, password) => {
  try {
    console.log("🔄 Attempting to log in user:", email);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("✅ Logget ind som:", userCredential.user.uid);
    return userCredential.user;
  } catch (error) {
    console.error("❌ Fejl ved login:", error);
    console.error("❌ Error code:", error.code);
    console.error("❌ Error message:", error.message);
    throw error;
  }
};

// Logout
export const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log("👋 Bruger logget ud");
  } catch (error) {
    console.error("❌ Fejl ved logout:", error.message);
    throw error;
  }
};
