import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getAllMovies, getAllSeries, filterContent } from '../firebase/firebaseData';
import SearchPopup from '../components/SearchPopup';
import FilterPopup from '../components/FilterPopup';
import styles from './Search.module.css';
import Logo from '../components/Logo.jsx';
import BottomNav from '../components/BottomNav.jsx';

export default function Search() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [allContent, setAllContent] = useState([]);
  const [filteredContent, setFilteredContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState({});

  // Load content on component mount
  useEffect(() => {
    const loadContent = async () => {
      try {
        const [moviesData, seriesData] = await Promise.all([
          getAllMovies(),
          getAllSeries()
        ]);
        const combined = [...moviesData, ...seriesData];
        setAllContent(combined);
        setFilteredContent(combined); // Initially show all content
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

  const handleApplyFilters = async (filters) => {
    setActiveFilters(filters);
    try {
      const filtered = await filterContent(filters);
      setFilteredContent(filtered);
    } catch (error) {
      console.error('Error applying filters:', error);
      setFilteredContent(allContent); // Fallback to all content
    }
  };

  // Content to display (filtered or all)
  const contentToDisplay = Object.keys(activeFilters).length > 0 ? filteredContent : allContent;

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
            {contentToDisplay.map((item) => (
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
            {contentToDisplay.length === 0 && !loading && (
              <div className={styles.noResults}>
                No content matches your current filters.
              </div>
            )}
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
