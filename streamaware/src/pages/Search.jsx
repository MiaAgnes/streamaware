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
  const [activeFilters, setActiveFilters] = useState({
    genres: [],
    platforms: [],
    contentType: [],
    countries: []
  });

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

  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
  };

  // Filter content based on active filters
  const filterContent = (content) => {
    return content.filter(item => {
      // Check genres
      if (activeFilters.genres.length > 0) {
        const hasMatchingGenre = activeFilters.genres.some(filterGenre => 
          item.genres && item.genres.some(itemGenre => 
            itemGenre.toLowerCase().includes(filterGenre.toLowerCase())
          )
        );
        if (!hasMatchingGenre) return false;
      }

      // Check platforms
      if (activeFilters.platforms.length > 0) {
        const hasMatchingPlatform = activeFilters.platforms.some(filterPlatform => 
          item.platforms && item.platforms.some(itemPlatform => 
            itemPlatform.toLowerCase().includes(filterPlatform.toLowerCase())
          )
        );
        if (!hasMatchingPlatform) return false;
      }

      // Check content type
      if (activeFilters.contentType.length > 0) {
        const itemType = item.type || (item.seasons ? 'Series' : 'Movies');
        const hasMatchingType = activeFilters.contentType.some(filterType => 
          itemType.toLowerCase() === filterType.toLowerCase()
        );
        if (!hasMatchingType) return false;
      }

      // Check countries
      if (activeFilters.countries.length > 0) {
        const hasMatchingCountry = activeFilters.countries.some(filterCountry => 
          item.country && (
            Array.isArray(item.country) 
              ? item.country.some(itemCountry => 
                  itemCountry.toLowerCase().includes(filterCountry.toLowerCase())
                )
              : item.country.toLowerCase().includes(filterCountry.toLowerCase())
          )
        );
        if (!hasMatchingCountry) return false;
      }

      return true;
    });
  };

  // Combine and filter all content for display
  const allContent = [...movies, ...series];
  const filteredContent = filterContent(allContent);

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
            {filteredContent.map((item) => (
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
      <FilterPopup 
        isOpen={showFilterPopup} 
        onClose={handleCloseFilterPopup}
        onApplyFilters={handleApplyFilters}
      />
      
      {/* Bottom Navigation Bar */}
      <BottomNav />
    </div>
  );
}
