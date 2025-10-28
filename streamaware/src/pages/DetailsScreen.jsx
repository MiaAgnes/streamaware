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
  const [isHeroLight, setIsHeroLight] = useState(false);

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

  // Analyze hero image brightness to switch icon color for contrast
  useEffect(() => {
    let cancelled = false;
    const src = item.hero;
    if (!src || typeof window === 'undefined') {
      setIsHeroLight(false);
      return;
    }

    const img = new Image();
    // same-origin images in public should be ok
    img.crossOrigin = 'Anonymous';
    img.src = src;

    img.onload = () => {
      if (cancelled) return;
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        // draw a small thumbnail to speed up analysis
        const w = 80;
        const h = 80;
        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(img, 0, 0, w, h);
        const data = ctx.getImageData(0, 0, w, h).data;
        let total = 0;
        let count = 0;

        // sample only the central area to avoid edges/letterboxing
        const startX = Math.floor(w * 0.2);
        const endX = Math.floor(w * 0.8);
        const startY = Math.floor(h * 0.2);
        const endY = Math.floor(h * 0.8);

        for (let y = startY; y < endY; y++) {
          for (let x = startX; x < endX; x++) {
            const idx = (y * w + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
            total += lum;
            count++;
          }
        }

        const avg = count ? total / count : 0;
        // lower threshold for light detection to be more permissive
        setIsHeroLight(avg > 0.55);
      } catch (err) {
        console.warn('Could not analyze hero image for brightness', err);
        setIsHeroLight(false);
      }
    };

    img.onerror = () => {
      if (!cancelled) setIsHeroLight(false);
    };

    return () => {
      cancelled = true;
    };
  }, [item.hero]);

  return (
    <div className={styles.container}>
      <div
        className={styles.hero}
        style={{ backgroundImage: `url(${item.hero || '/images/hero-placeholder.png'})` }}
      >
        <button className={`${styles.back} ${isHeroLight ? styles.darkIcon : ''}`} onClick={() => navigate(-1)}>‹ Back</button>
        <button
          className={`${styles.fav} ${isHeroLight ? styles.darkIcon : ''}`}
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
