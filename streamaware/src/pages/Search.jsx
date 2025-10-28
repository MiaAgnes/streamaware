import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getAllMovies, getAllSeries } from '../firebase/firebaseData';
import SearchPopup from '../components/SearchPopup';
import styles from './Search.module.css';
import Logo from '../components/Logo.jsx';

export default function Search() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load content on component mount
  useEffect(() => {
    const loadContent = async () => {
      try {
        const [moviesData, seriesData] = await Promise.all([
          getAllMovies(),
          getAllSeries()
        ]);
        setMovies(moviesData);
        setSeries(seriesData);
      } catch (error) {
        console.error('Error loading content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  const handleSearchClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  // Combine and limit content for display
  const allContent = [...movies, ...series].slice(0, 6);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Logo className={styles.logo} />
      </div>
      {/* Search Bar */}
      <div className={styles.searchContainer}>
        <div className={styles.searchBar} onClick={handleSearchClick}>
          <img src="/images/search-full.svg" alt="Search" className={styles.searchIcon} />
          <span className={styles.searchPlaceholder}>Search for movie or series..</span>
          <img src="/images/help-icon.svg" alt="Filter" className={styles.filterIcon} />
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {loading ? (
          <div className={styles.loading}>Loading content...</div>
        ) : (
          <div className={styles.contentGrid}>
            {allContent.map((item) => (
              <div key={item.id} className={styles.contentItem}>
                <img 
                  src={item.image} 
                  alt={item.title}
                  className={styles.contentImage}
                  onError={(e) => {
                    e.target.src = '/images/placeholder.png';
                  }}
                />
                <div className={styles.contentInfo}>
                  <h3 className={styles.contentTitle}>{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Search Popup */}
      <SearchPopup isOpen={showPopup} onClose={handleClosePopup} />
      
      {/* Bottom Navigation Bar */}
      <nav className={styles.bottomNav}>
        <button className={styles.navButton} onClick={() => navigate('/homepage')}>
          <img src="/images/home-opacity.svg" alt="Home" />
        </button>
        <button className={styles.navButton} onClick={() => navigate('/search')}>
          <img src="/images/search-full.svg" alt="Search" />
        </button>
        <button className={styles.navButton} onClick={() => navigate('/favorites')}>
          <img src="/images/heart-opacity.svg" alt="Favorites" />
        </button>
        <button className={styles.navButton} onClick={() => navigate('/profile')}>
          <img src="/images/profile-opacity.svg" alt="Profile" />
        </button>
      </nav>
    </div>
  );
}
