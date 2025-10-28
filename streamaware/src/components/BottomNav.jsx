import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import styles from './BottomNav.module.css';
import AuthRequiredPopup from './AuthRequiredPopup';

function isGuestUser() {
  return (typeof window !== 'undefined' && window.localStorage && localStorage.getItem('isGuest') === '1');
}

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showAuthPopup, setShowAuthPopup] = useState(false);

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
          <img src={location.pathname === '/profile' ? '/images/profile-full.svg' : '/images/profile-opacity.svg'} alt="Profile" />
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
