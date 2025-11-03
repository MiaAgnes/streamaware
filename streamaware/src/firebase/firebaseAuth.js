import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

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
      favorites: [],
      profileImage: '/images/cat-profile.svg' // Default profile image
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

// Get current user data from Firestore
export const getCurrentUserData = async (userId) => {
  try {
    const userDoc = doc(db, "users", userId);
    const userSnap = await getDoc(userDoc);
    
    if (userSnap.exists()) {
      console.log("✅ User data loaded:", userId);
      return userSnap.data();
    } else {
      console.log("❌ No user data found");
      return null;
    }
  } catch (error) {
    console.error("❌ Error loading user data:", error);
    throw error;
  }
};

// Add to favorites
export const addToFavorites = async (userId, contentId, contentType) => {
  try {
    const userDoc = doc(db, "users", userId);
    const favoriteItem = {
      id: contentId,
      type: contentType, // 'movie' or 'series'
      addedAt: new Date()
    };
    
    await updateDoc(userDoc, {
      favorites: arrayUnion(favoriteItem)
    });
    
    console.log("✅ Added to favorites:", contentId);
    return true;
  } catch (error) {
    console.error("❌ Error adding to favorites:", error);
    throw error;
  }
};

// Remove from favorites
export const removeFromFavorites = async (userId, contentId) => {
  try {
    const userDoc = doc(db, "users", userId);
    const userData = await getCurrentUserData(userId);
    
    if (userData && userData.favorites) {
      // Find the favorite item to remove
      const favoriteToRemove = userData.favorites.find(fav => fav.id === contentId);
      
      if (favoriteToRemove) {
        await updateDoc(userDoc, {
          favorites: arrayRemove(favoriteToRemove)
        });
        console.log("✅ Removed from favorites:", contentId);
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error("❌ Error removing from favorites:", error);
    throw error;
  }
};

// Get user favorites
export const getUserFavorites = async (userId) => {
  try {
    const userData = await getCurrentUserData(userId);
    return userData?.favorites || [];
  } catch (error) {
    console.error("❌ Error loading user favorites:", error);
    throw error;
  }
};

// Update user profile image
export const updateUserProfileImage = async (userId, profileImagePath) => {
  try {
    const userDoc = doc(db, "users", userId);
    await updateDoc(userDoc, {
      profileImage: profileImagePath
    });
    console.log("✅ Profile image updated:", profileImagePath);
    return true;
  } catch (error) {
    console.error("❌ Error updating profile image:", error);
    throw error;
  }
};

// Update user's country in Firestore
export const updateUserCountry = async (userId, country) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
      country: country,
      updatedAt: new Date()
    });
    console.log('✅ User country updated successfully');
  } catch (error) {
    console.error('❌ Error updating user country:', error);
    throw error;
  }
};

// Listen to auth state changes
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};
