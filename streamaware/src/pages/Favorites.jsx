import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import styles from './Favorites.module.css';
import AuthRequiredPopup from '../components/AuthRequiredPopup';
import BottomNav from '../components/BottomNav.jsx';
import Logo from '../components/Logo.jsx';
import { auth } from '../firebase/firebase';
import { getUserFavorites } from '../firebase/firebaseAuth.js';
import { getAllMovies, getAllSeries } from '../firebase/firebaseData';

function isGuestUser() {
  return (typeof window !== 'undefined' && window.localStorage && localStorage.getItem('isGuest') === '1');
}

export default function Favorites() {
  const navigate = useNavigate();
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isGuestUser()) {
      // if someone navigated directly to /favorites as a guest, remember a sensible origin
      if (typeof window !== 'undefined' && window.sessionStorage && !sessionStorage.getItem('guestOrigin')) {
        sessionStorage.setItem('guestOrigin', '/homepage');
      }
      setShowAuthPopup(true);
      setLoading(false);
    }
      // load user's favorites
      const uid = auth?.currentUser?.uid;
      if (!uid) {
        setLoading(false);
        return;
      }

      (async () => {
        try {
          const favs = await getUserFavorites(uid);
          // load content and map favorites to full items
          const [movies, series] = await Promise.all([getAllMovies(), getAllSeries()]);
          const map = new Map();
          movies.forEach(m => map.set(m.id, { ...m, type: 'movie' }));
          series.forEach(s => map.set(s.id, { ...s, type: 'series' }));
          const items = favs.map(f => {
            const found = map.get(f.id);
            return found ? found : { id: f.id, title: f.id, image: '/images/placeholder.png', type: f.type || 'unknown' };
          });
          setFavorites(items);
        } catch (err) {
          console.error('Failed to load favorites', err);
        } finally {
          setLoading(false);
        }
      })();
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
      <header className={styles.header}>
        <Logo className={styles.logo} />
      </header>

      <div className={styles.titleContainer}>
        <h1>Favorites</h1>
      </div>

      <main className={styles.content}>
        {loading ? (
          <div className={styles.loading}>Loading favorites...</div>
        ) : favorites.length === 0 ? (
          <div className={styles.empty}>You haven't added any favorites yet.</div>
        ) : (
          <div className={styles.grid}>
            {favorites.map(item => (
              <div
                key={item.id}
                className={styles.card}
                onClick={() => navigate('/details', { state: { item } })}
                role="button"
                tabIndex={0}
              >
                <img src={item.image || '/images/placeholder.png'} alt={item.title} />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <BottomNav />
    </div>
  );
}
