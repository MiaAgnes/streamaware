import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import styles from './Profile.module.css';
import DeleteProfilePopup from '../components/DeleteProfilePopup';
import Button from '../components/Button';
import ProfileImageSelector from '../components/ProfileImageSelector';
import CountryPopup from '../components/CountryPopup';
import { logoutUser, getCurrentUserData, updateUserProfileImage, updateUserCountry } from '../firebase/firebaseAuth.js';
import { deleteUser as firebaseDeleteUser } from 'firebase/auth';
import { auth, db } from '../firebase/firebase';
import { deleteDoc, doc } from 'firebase/firestore';
import BottomNav from '../components/BottomNav.jsx';
import { getImagePath } from '../utils/imageHelpers.js';

function isGuestUser() {
  return (typeof window !== 'undefined' && window.localStorage && localStorage.getItem('isGuest') === '1');
}

export default function Profile() {
  const navigate = useNavigate();
  const [guest, setGuest] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showProfileImageSelector, setShowProfileImageSelector] = useState(false);
  const [showCountryPopup, setShowCountryPopup] = useState(false);
  const [guestCountry, setGuestCountry] = useState(null);

  useEffect(() => {
    setGuest(isGuestUser());
    
    // Load guest country from localStorage if guest
    if (isGuestUser() && typeof window !== 'undefined' && window.localStorage) {
      const savedGuestCountry = localStorage.getItem('guestCountry');
      setGuestCountry(savedGuestCountry);
    }
    
    // If logged in, try to fetch profile info
    const uid = auth?.currentUser?.uid;
    if (uid) {
      getCurrentUserData(uid).then(data => setUserData(data)).catch(() => {});
    }
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      if (typeof window !== 'undefined' && window.localStorage) localStorage.removeItem('isGuest');
      navigate('/');
    } catch (err) {
      alert('Logout failed: ' + err.message);
    }
  };

  const handleDelete = async () => {
    // attempt to delete firestore doc and auth user
    try {
      const user = auth.currentUser;
      if (user) {
        // delete firestore doc
        await deleteDoc(doc(db, 'users', user.uid));
        // delete auth account
        await firebaseDeleteUser(user);
      }
      if (typeof window !== 'undefined' && window.localStorage) localStorage.removeItem('isGuest');
      navigate('/');
    } catch (err) {
      console.error('Delete failed', err);
      alert('Could not delete account: ' + (err.message || err));
    }
  };

    const handleProfileImageChange = async (newImagePath) => {
    try {
      const userId = auth?.currentUser?.uid;
      if (!userId) {
        console.error('No user logged in');
        return;
      }
      
      await updateUserProfileImage(userId, newImagePath);
      // Update the userData state to reflect the new profile image
      setUserData(prev => prev ? { ...prev, profileImage: newImagePath } : null);
      setShowProfileImageSelector(false);
      
      // Dispatch custom event to update BottomNav
      window.dispatchEvent(new CustomEvent('profileImageUpdated', {
        detail: { profileImage: newImagePath }
      }));
    } catch (error) {
      console.error('Error updating profile image:', error);
    }
  };

  const handleCountryChange = async (selectedCountry) => {
    if (guest) {
      // For guest users, save to localStorage and update state
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('guestCountry', selectedCountry);
      }
      setGuestCountry(selectedCountry);
    } else {
      // For authenticated users, save to Firestore
      try {
        const userId = auth?.currentUser?.uid;
        if (userId) {
          await updateUserCountry(userId, selectedCountry);
          // Update userData state to reflect the new country
          setUserData(prev => prev ? { ...prev, country: selectedCountry } : null);
        }
      } catch (error) {
        console.error('❌ Error updating country:', error);
        alert('Failed to update country. Please try again.');
        return; // Don't close popup if there was an error
      }
    }
    
    setShowCountryPopup(false);
  };

  if (guest) {
    return (
      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.guestMessage}>
          <h1>Hi Guest</h1>
          <p>You are browsing as a guest. Some features (like Favorites) are locked.</p>
          </div>
          <div className={styles.stackButtons}>
            <Button onClick={() => navigate('/signup')}>Sign Up</Button>
            <Button onClick={() => navigate('/login')}>Log In</Button>
            <div className={styles.countryButtonWrapper}>
              <Button onClick={() => setShowCountryPopup(true)}>Change country</Button>
              <p className={styles.currentCountryText}>
                Current country: {guestCountry || 'Not selected'}
              </p>
            </div>
          </div>
        </div>

        {showCountryPopup && (
          <CountryPopup
            isOpen={showCountryPopup}
            onClose={() => setShowCountryPopup(false)}
            onSelect={handleCountryChange}
            title="Change country"
          />
        )}

        {/* Bottom Navigation Bar */}
        <BottomNav />
      </div>
    );
  }

  return (
    <div className={styles.container}>
        <div className={styles.main}>
        <h1 className={styles.greeting}>Hi {userData?.username || auth.currentUser?.displayName}</h1>
        
        {/* Profile Image */}
        <div className={styles.profileImageContainer}>
          <img 
            src={userData?.profileImage || getImagePath('images/cat-profile.svg')} 
            alt="Profile" 
            className={styles.profileImage}
            onClick={() => setShowProfileImageSelector(true)}
          />
        </div>
        
        <div className={styles.stackButtons}>
          <Button onClick={handleLogout}>Log out</Button>
          <div className={styles.countryButtonWrapper}>
            <Button onClick={() => setShowCountryPopup(true)}>Change country</Button>
            <p className={styles.currentCountryText}>
              Current country: {userData?.country || 'Not selected'}
            </p>
          </div>
          <Button onClick={() => setConfirmDelete(true)} className={styles.deleteButton}>Delete profile</Button>
        </div>
      </div>

      {confirmDelete && (
        <DeleteProfilePopup
          isOpen={confirmDelete}
          onClose={() => setConfirmDelete(false)}
          onConfirm={handleDelete}
        />
      )}

      {showProfileImageSelector && (
        <ProfileImageSelector
          isOpen={showProfileImageSelector}
          currentImage={userData?.profileImage || getImagePath('images/cat-profile.svg')}
          onClose={() => setShowProfileImageSelector(false)}
          onSelect={handleProfileImageChange}
        />
      )}

      {showCountryPopup && (
        <CountryPopup
          isOpen={showCountryPopup}
          onClose={() => setShowCountryPopup(false)}
          onSelect={handleCountryChange}
          title="Change country"
        />
      )}

      {/* Bottom Navigation Bar */}
      <BottomNav />
    </div>
  );
}
