import { useNavigate, useLocation } from 'react-router';
import styles from './DetailsScreen.module.css';
import Button from '../components/Button';
import BottomNav from '../components/BottomNav.jsx';
import { useEffect, useState } from 'react';
import AuthRequiredPopup from '../components/AuthRequiredPopup';
import { addToFavorites, removeFromFavorites, getUserFavorites } from '../firebase/firebaseAuth.js';
import { auth } from '../firebase/firebase';

export default function DetailsScreen() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const item = state?.item;

  // Initialize all hooks first (before any conditional returns)
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [showAuthPopup, setShowAuthPopup] = useState(false);

  // guest detection helper
  function isGuestUser() {
    return (typeof window !== 'undefined' && window.localStorage && localStorage.getItem('isGuest') === '1');
  }

  // On mount, load favorites if logged in
  useEffect(() => {
    // Only proceed if we have item data
    if (!item) return;
    
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
  }, [item]);

  // Redirect if no item data (after hooks are initialized)
  if (!item) {
    console.warn('No item data found, redirecting to search');
    navigate('/search');
    return null;
  }

  // Debug: Log the item data to see what fields we have
  console.log('DetailsScreen item data:', item);
  console.log('Item keys:', Object.keys(item));
  console.log('Item details:', {
    title: item.title,
    type: item.type, 
    year: item.year,
    description: item.description,
    genres: item.genres,
    platforms: item.platforms,
    image: item.image
  });

  // we no longer analyze hero brightness — we'll always render a subtle top overlay

  return (
    <div className={styles.container}>
      <div
        className={styles.hero}
        style={{ backgroundImage: `url(${item.image || '/images/hero-placeholder.png'})` }}
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
          
            if (isGuestUser() || !auth?.currentUser) {
              if (typeof window !== 'undefined' && window.sessionStorage) {
                sessionStorage.setItem('guestOrigin', window.location.pathname + window.location.search); 
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
        <h1 className={styles.title}>{item?.title || 'Unknown Title'}</h1>

        <div className={styles.pills}>
          <span className={styles.pill}>{item?.year || 'Unknown Year'}</span>
          <span className={styles.pill}>{item?.type === 'movie' ? 'Movie' : item?.type === 'series' ? 'Series' : 'Content'}</span>
          {item?.genres && Array.isArray(item.genres) && item.genres.length > 0 && (
            <span className={styles.pill}>{item.genres[0]}</span>
          )}
        </div>

        <p className={styles.description}>{item?.description || 'No description available.'}</p>

        <div className={styles.services}>
          {(() => {
            // Safely check for platforms data
            const platforms = item.platforms || item.platform || item.services || [];
            
            // Ensure we have an array to work with
            let platformArray = [];
            if (Array.isArray(platforms)) {
              platformArray = platforms;
            } else if (platforms && typeof platforms === 'string') {
              platformArray = [platforms];
            } else if (platforms && typeof platforms === 'object') {
              platformArray = [platforms];
            }
            
            console.log('Platform data found:', platformArray);
            
            // Function to get platform logo
            const getPlatformLogo = (platformName) => {
              if (!platformName || typeof platformName !== 'string') return null;
              
              const name = platformName.toLowerCase();
              const logoMap = {
                'netflix': '/images/netflix.webp',
                'prime video': '/images/primevideo.svg',
                'amazon prime': '/images/primevideo.svg',
                'disney+': '/images/disneyplus.svg',
                'disney plus': '/images/disneyplus.svg',
                'hbo max': '/images/hbomax.webp',
                'hbo': '/images/hbomax.webp',
                'viaplay': '/images/viaplay-white.webp',
                'apple tv': '/images/apple-tv.webp',
                'apple tv+': '/images/apple-tv.webp',
                'skyshowtime': 'https://d21buns5ku92am.cloudfront.net/69678/background_image/large-1734104572.png',
                'yousee play': 'https://www.flatpanels.dk/pictures/youseeplay2022_4.jpg',
                'blockbuster': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Blockbuster_logo.svg/2560px-Blockbuster_logo.svg.png',
                'google play': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Google_Play_2012-2016_icon.svg/1921px-Google_Play_2012-2016_icon.svg.png',
                'filmstriben': 'https://play-lh.googleusercontent.com/U6R-EOFB6iPfrES9gMIpu9Iwm1RHYt4g_WyOiGoqFGFw01vLt6BuPBwG3v2WaoiLOnA',
                'youtube': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/2560px-YouTube_full-color_icon_%282017%29.svg.png',
                'sf anytime': 'https://img-cdn.sfanytime.com/APP/LOGO_HORIZ_SF_587bf34c3e68af3b0577acbddac02d77.svg?bg=141414&fill-color=141414&pad=171&h=512&w=910&fit=fill&fm=svg&s=302e546fa8511684046dc2cbe68a39ef',
                'dr': 'https://storage.tweak.dk/smart%20home/Et_kig_p%C3%A5_DR_TV_anno_2020/Et_kig_p%C3%A5_DR_TV_anno_2020_.jpg',
                'tv2 play': 'https://cdn-play-prismic.tv2i.dk/playlandingpages/96cabc75-acf2-47c0-bbe4-24b140d0d5ee_Web+Channels-4.png?auto=compress,format',
              };
              
              return logoMap[name] || null;
            };
            
            if (platformArray.length > 0) {
              return platformArray.map((platform, index) => {
                const platformName = typeof platform === 'string' ? platform : platform?.name || 'Unknown Platform';
                const platformUrl = typeof platform === 'object' ? platform?.url : null;
                const logoUrl = getPlatformLogo(platformName);
                
                const handleWatchNow = () => {
                  if (platformUrl) {
                    // Open the specific streaming URL
                    window.open(platformUrl, '_blank', 'noopener,noreferrer');
                  } else {
                    // Fallback: Search for the title on the platform
                    const searchQuery = encodeURIComponent(item.title);
                    const fallbackUrls = {
                      'netflix': `https://www.netflix.com/search?q=${searchQuery}`,
                      'prime video': `https://www.amazon.com/s?k=${searchQuery}&i=prime-instant-video`,
                      'amazon prime': `https://www.amazon.com/s?k=${searchQuery}&i=prime-instant-video`,
                      'disney+': `https://www.disneyplus.com/search/${searchQuery}`,
                      'disney plus': `https://www.disneyplus.com/search/${searchQuery}`,
                      'hbo max': `https://www.max.com/search?q=${searchQuery}`,
                      'hbo': `https://www.max.com/search?q=${searchQuery}`,
                      'viaplay': `https://viaplay.dk/search?query=${searchQuery}`,
                      'apple tv': `https://tv.apple.com/search?term=${searchQuery}`,
                      'apple tv+': `https://tv.apple.com/search?term=${searchQuery}`,
                      'youtube': `https://www.youtube.com/results?search_query=${searchQuery}`,
                    };
                    
                    const platformKey = platformName.toLowerCase();
                    const fallbackUrl = fallbackUrls[platformKey];
                    
                    if (fallbackUrl) {
                      window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
                    } else {
                      alert(`Please visit ${platformName} to watch ${item.title}`);
                    }
                  }
                };
                
                return (
                  <div key={index} className={styles.serviceCard}>
                    <div className={styles.serviceLeft}>
                      <div className={styles.logoWrap}>
                        {logoUrl ? (
                          <img 
                            src={logoUrl} 
                            alt={platformName} 
                            className={styles.platformLogo}
                          />
                        ) : (
                          <div className={styles.logoPlaceholder}>
                            {platformName[0]?.toUpperCase() || 'P'}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={styles.serviceRight}>
                      <div className={styles.serviceMeta}>
                        Available on<br/>
                        <span className={styles.platformName}>{platformName}</span>
                      </div>
                      <Button className={styles.watchButton} onClick={handleWatchNow}>
                        Watch now
                      </Button>
                    </div>
                  </div>
                );
              });
            } else {
              return (
                <div className={styles.noServices}>
                  <div style={{padding: '20px', textAlign: 'center'}}>
                    <p style={{marginBottom: '10px', opacity: 0.8}}>
                      🎬 This content is available to watch
                    </p>
                    <small style={{opacity: 0.6}}>
                      Platform information will be added soon
                    </small>
                  </div>
                </div>
              );
            }
          })()}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
