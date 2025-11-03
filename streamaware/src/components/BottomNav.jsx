import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { getCurrentUserData } from '../firebase/firebaseAuth';
import { auth } from '../firebase/firebase';
import styles from './BottomNav.module.css';
import AuthRequiredPopup from './AuthRequiredPopup';

function isGuestUser() {
  return (typeof window !== 'undefined' && window.localStorage && localStorage.getItem('isGuest') === '1');
}

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [userProfileImage, setUserProfileImage] = useState('/images/profile-opacity.svg');

  useEffect(() => {
    const loadUserProfileImage = async () => {
      if (!isGuestUser()) {
        try {
          const userId = auth?.currentUser?.uid;
          if (userId) {
            const user = await getCurrentUserData(userId);
            if (user && user.profileImage) {
              setUserProfileImage(user.profileImage);
            }
          }
        } catch (error) {
          console.error('Error loading user profile image:', error);
        }
      }
    };

    loadUserProfileImage();

    // Listen for profile image updates
    const handleProfileImageUpdate = (event) => {
      setUserProfileImage(event.detail.profileImage);
    };

    window.addEventListener('profileImageUpdated', handleProfileImageUpdate);

    return () => {
      window.removeEventListener('profileImageUpdated', handleProfileImageUpdate);
    };
  }, []);

  const handleNav = (path) => {
    if (path === '/favorites' && isGuestUser()) {
      // remember where the guest clicked from so we can return them there after the popup
      if (typeof window !== 'undefined' && window.sessionStorage) {
        sessionStorage.setItem('guestOrigin', location.pathname);
      }
      setShowAuthPopup(true);
      return;
    }
    navigate(path);
  };

  return (
    <>
      <nav className={styles.bottomNav}>
        <button className={styles.navButton} onClick={() => handleNav('/homepage')}>
          <img src={location.pathname === '/homepage' ? '/images/home-full.svg' : '/images/home-opacity.svg'} alt="Home" />
        </button>
        <button className={styles.navButton} onClick={() => handleNav('/search')}>
          <img src={location.pathname === '/search' ? '/images/search-full.svg' : '/images/search-opacity.svg'} alt="Search" />
        </button>
        <button className={styles.navButton} onClick={() => handleNav('/favorites')}>
          <img src={location.pathname === '/favorites' ? '/images/heart-full.svg' : '/images/heart-opacity.svg'} alt="Favorites" />
        </button>
        <button className={styles.navButton} onClick={() => handleNav('/profile')}>
          {!isGuestUser() ? (
            <img 
              src={userProfileImage} 
              alt="Profile" 
              className={location.pathname === '/profile' ? styles.profileImageActive : styles.profileImage}
            />
          ) : (
            <img src={location.pathname === '/profile' ? '/images/profile-full.svg' : '/images/profile-opacity.svg'} alt="Profile" />
          )}
        </button>
      </nav>

      <AuthRequiredPopup
        isOpen={showAuthPopup}
        onClose={() => {
          setShowAuthPopup(false);
          // navigate back to origin (default to homepage)
          const origin = (typeof window !== 'undefined' && window.sessionStorage && sessionStorage.getItem('guestOrigin')) || '/homepage';
          if (typeof window !== 'undefined' && window.sessionStorage) {
            sessionStorage.removeItem('guestOrigin');
          }
          navigate(origin);
        }}
        onLogin={() => {
          // when logging in, store a post-login redirect and go to login
          const origin = (typeof window !== 'undefined' && window.sessionStorage && sessionStorage.getItem('guestOrigin')) || '/homepage';
          if (typeof window !== 'undefined' && window.sessionStorage) {
            sessionStorage.setItem('postLoginRedirect', origin);
            sessionStorage.removeItem('guestOrigin');
          }
          navigate('/login');
        }}
        // use local styling so we don't affect global buttons
      />
    </>
  );
}
