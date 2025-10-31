import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getAllMovies, getAllSeries } from '../firebase/firebaseData';
import SearchPopup from '../components/SearchPopup';
import FilterPopup from '../components/FilterPopup';
import styles from './Search.module.css';
import Logo from '../components/Logo.jsx';
import BottomNav from '../components/BottomNav.jsx';

export default function Search() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
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

  const handleFilterClick = (e) => {
    e.stopPropagation(); // Prevent the search popup from opening
    setShowFilterPopup(true);
  };

  const handleCloseFilterPopup = () => {
    setShowFilterPopup(false);
  };

  // Combine all content for display
  const allContent = [...movies, ...series];

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
          <img 
            src="/images/filter-icon.svg" 
            alt="Filter" 
            className={styles.filterIcon} 
            onClick={handleFilterClick}
          />
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {loading ? (
          <div className={styles.loading}>Loading content...</div>
        ) : (
          <div className={styles.contentGrid}>
            {allContent.map((item) => (
              <div
                key={item.id}
                className={styles.contentItem}
                onClick={() => navigate('/details', { state: { item } })}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') navigate('/details', { state: { item } }); }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className={styles.contentImage}
                  onError={(e) => { e.target.src = '/images/placeholder.png'; }}
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
      
      {/* Filter Popup */}
      <FilterPopup isOpen={showFilterPopup} onClose={handleCloseFilterPopup} />
      
      {/* Bottom Navigation Bar */}
      <BottomNav />
    </div>
  );
}
