import { useNavigate, useLocation } from 'react-router';
import styles from './DetailsScreen.module.css';
import Button from '../components/Button';
import BottomNav from '../components/BottomNav.jsx';

const SAMPLE = {
  title: 'Wednesday',
  year: '2022',
  type: 'Serie',
  genre: 'Thriller',
  description:
    'Clever, sarcastic, and a little dead inside, Wednesday Addams investigates twisted mysteries while making new friends – and enemies – at Nevermore Academy.',
  // use existing assets in public/images
  hero: '/images/wednesday.png',
  services: [
    { id: 'netflix', name: 'Netflix', price: 'DKK 89.00 / month', logo: '/images/netflix.webp' },
    { id: 'prime', name: 'Prime video', price: 'DKK 69.00 / month', logo: '/images/primevideo.svg' }
  ]
};
import { useEffect, useState } from 'react';
import AuthRequiredPopup from '../components/AuthRequiredPopup';
import { addToFavorites, removeFromFavorites, getUserFavorites } from '../firebase/firebaseAuth.js';
import { auth } from '../firebase/firebase';

export default function DetailsScreen() {
  const navigate = useNavigate();
  const { state } = useLocation();
  let raw = state?.item || {};

  // Ensure we have all required fields even if navigation passed a minimal item
  const item = {
    title: raw.title || SAMPLE.title,
    year: raw.year || SAMPLE.year,
    type: raw.type || SAMPLE.type,
    genre: raw.genre || SAMPLE.genre,
    description: raw.description || SAMPLE.description,
    // prefer explicit hero, then an 'image' prop from previews, then SAMPLE
    hero: raw.hero || raw.image || SAMPLE.hero,
    services: raw.services || SAMPLE.services,
    id: raw?.id || SAMPLE.title
  };

  // guest detection helper
  function isGuestUser() {
    return (typeof window !== 'undefined' && window.localStorage && localStorage.getItem('isGuest') === '1');
  }

  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [showAuthPopup, setShowAuthPopup] = useState(false);

  // On mount, load favorites if logged in
  useEffect(() => {
    const uid = auth?.currentUser?.uid;
    if (uid) {
      getUserFavorites(uid).then(list => {
        const contentId = item.id || item.title;
        const has = list.some(f => f.id === contentId);
        setIsFavorite(has);
      }).catch(err => {
        console.error('Failed to load favorites', err);
      });
    }
  }, [item.id, item.title]);

  // we no longer analyze hero brightness — we'll always render a subtle top overlay

  return (
    <div className={styles.container}>
      <div
        className={styles.hero}
        style={{ backgroundImage: `url(${item.hero || '/images/hero-placeholder.png'})` }}
      >
        <button className={styles.back} onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Back</span>
        </button>
        <button
          className={styles.fav}
          aria-label="Favorite"
          onClick={async () => {
            // If guest, show auth-required popup and save origin so we can redirect back
            if (isGuestUser() || !auth?.currentUser) {
              if (typeof window !== 'undefined' && window.sessionStorage) {
                sessionStorage.setItem('guestOrigin', window.location.pathname + window.location.search);
                // save the item so we can restore it after login
                try {
                  sessionStorage.setItem('guestOriginItem', JSON.stringify(item));
                } catch (err) { console.warn('Could not save guestOriginItem', err); }
                sessionStorage.setItem('postLoginRedirect', '/details');
              }
              setShowAuthPopup(true);
              return;
            }

            if (favLoading) return;
            setFavLoading(true);
            const uid = auth.currentUser.uid;
            const contentId = item.id || item.title;
            try {
              if (isFavorite) {
                await removeFromFavorites(uid, contentId);
                setIsFavorite(false);
              } else {
                await addToFavorites(uid, contentId, item.type || 'unknown');
                setIsFavorite(true);
              }
            } catch (err) {
              console.error('Favorite toggle failed', err);
              alert('Could not update favorites: ' + (err.message || err));
            } finally {
              setFavLoading(false);
            }
          }}
        >
          <img
            src={isFavorite ? '/images/heart-full.svg' : '/images/heart-opacity.svg'}
            alt={isFavorite ? 'Favorited' : 'Add to favorites'}
          />
        </button>
      </div>

      {showAuthPopup && (
        <AuthRequiredPopup
          isOpen={showAuthPopup}
          onClose={() => {
            setShowAuthPopup(false);
            if (typeof window !== 'undefined' && window.sessionStorage) {
              sessionStorage.removeItem('postLoginRedirect');
              sessionStorage.removeItem('guestOriginItem');
            }
          }}
          onLogin={() => {
            if (typeof window !== 'undefined' && window.sessionStorage) {
              sessionStorage.setItem('postLoginRedirect', '/details');
            }
            // Navigate to login - the login page will read postLoginRedirect
            navigate('/login');
          }}
        />
      )}

      <div className={styles.body}>
        <h1 className={styles.title}>{item.title}</h1>

        <div className={styles.pills}>
          <span className={styles.pill}>{item.year}</span>
          <span className={styles.pill}>{item.type}</span>
          <span className={styles.pill}>{item.genre}</span>
        </div>

        <p className={styles.description}>{item.description}</p>

        <div className={styles.services}>
          {item.services.map(s => (
            <div key={s.id} className={styles.serviceCard}>
              <div className={styles.serviceLeft}>
                <div className={styles.logoWrap}>
                  {/* If logo missing, show first letter */}
                  {s.logo ? <img src={s.logo} alt={s.name} /> : <div className={styles.logoPlaceholder}>{s.name[0]}</div>}
                </div>
              </div>
              <div className={styles.serviceRight}>
                <div className={styles.serviceMeta}>Subscription<br/><span className={styles.price}>{s.price}</span></div>
                <Button className={styles.watchButton}>Watch now</Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
