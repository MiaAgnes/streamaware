import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import styles from './Favorites.module.css';
import AuthRequiredPopup from '../components/AuthRequiredPopup';
import BottomNav from '../components/BottomNav.jsx';

function isGuestUser() {
  return (typeof window !== 'undefined' && window.localStorage && localStorage.getItem('isGuest') === '1');
}

export default function Favorites() {
  const navigate = useNavigate();
  const [showAuthPopup, setShowAuthPopup] = useState(false);

  useEffect(() => {
    if (isGuestUser()) {
      // if someone navigated directly to /favorites as a guest, remember a sensible origin
      if (typeof window !== 'undefined' && window.sessionStorage && !sessionStorage.getItem('guestOrigin')) {
        sessionStorage.setItem('guestOrigin', '/homepage');
      }
      setShowAuthPopup(true);
    }
  }, []);

  

  if (showAuthPopup) {
    return (
      <div className={styles.container}>
        <AuthRequiredPopup
          isOpen={showAuthPopup}
          onClose={() => {
            setShowAuthPopup(false);
            const origin = (typeof window !== 'undefined' && window.sessionStorage && sessionStorage.getItem('guestOrigin')) || '/homepage';
            if (typeof window !== 'undefined' && window.sessionStorage) sessionStorage.removeItem('guestOrigin');
            navigate(origin);
          }}
          onLogin={() => {
            const origin = (typeof window !== 'undefined' && window.sessionStorage && sessionStorage.getItem('guestOrigin')) || '/homepage';
            if (typeof window !== 'undefined' && window.sessionStorage) sessionStorage.setItem('postLoginRedirect', origin);
            navigate('/login');
          }}
        />
        {/* Keep shared BottomNav visible behind popup */}
        <BottomNav />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>Favorites</h1>
      <p>Your favorites will appear here...</p>
      
      {/* Bottom Navigation Bar */}
      <BottomNav />
    </div>
  );
}
