import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { getAllMovies, getAllSeries } from '../firebase/firebaseData';
import styles from './FilterResults.module.css';
import Logo from '../components/Logo.jsx';
import BottomNav from '../components/BottomNav.jsx';

export default function FilterResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const [filteredContent, setFilteredContent] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Get filters from navigation state with proper fallback
  const filters = useMemo(() => {
    return location.state?.filters || {
      genres: [],
      platforms: [],
      contentType: [],
      countries: []
    };
  }, [location.state?.filters]);

  // Redirect back if no filters were provided
  useEffect(() => {
    if (!location.state?.filters) {
      navigate('/search', { replace: true });
    }
  }, [location.state, navigate]);

  useEffect(() => {
    const loadAndFilterContent = async () => {
      try {
        setLoading(true);
        const [movies, series] = await Promise.all([
          getAllMovies(),
          getAllSeries()
        ]);
        
        const allContent = [...movies, ...series];
        
        // Filter content based on applied filters
        const filtered = allContent.filter(item => {
          // Genre filter
          if (filters.genres.length > 0) {
            const hasMatchingGenre = filters.genres.some(filterGenre => 
              item.genres?.some(genre => genre.toLowerCase().includes(filterGenre.toLowerCase()))
            );
            if (!hasMatchingGenre) return false;
          }
          
          // Platform filter
          if (filters.platforms.length > 0) {
            const hasMatchingPlatform = filters.platforms.some(filterPlatform => 
              item.platforms?.some(platform => platform.toLowerCase().includes(filterPlatform.toLowerCase()))
            );
            if (!hasMatchingPlatform) return false;
          }
          
          // Content type filter
          if (filters.contentType.length > 0) {
            const itemType = item.type || (movies.includes(item) ? 'Movie' : 'Series');
            const hasMatchingType = filters.contentType.includes(itemType);
            if (!hasMatchingType) return false;
          }
          
          // Language filter
          if (filters.languages.length > 0) {
            const hasMatchingLanguage = filters.languages.some(filterLanguage => 
              item.languages?.some(language => language.toLowerCase().includes(filterLanguage.toLowerCase()))
            );
            if (!hasMatchingLanguage) return false;
          }
          
          // Subtitles filter
          if (filters.subtitles.length > 0) {
            const hasMatchingSubtitle = filters.subtitles.some(filterSubtitle => 
              item.subtitles?.some(subtitle => subtitle.toLowerCase().includes(filterSubtitle.toLowerCase()))
            );
            if (!hasMatchingSubtitle) return false;
          }
          
          return true;
        });
        
        setFilteredContent(filtered);
      } catch (error) {
        console.error('Error loading and filtering content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAndFilterContent();
  }, [filters]);

  const handleItemClick = (item) => {
    navigate('/details', { state: { item } });
  };

  const handleBackClick = () => {
    navigate(-1); // Go back to previous page
  };

  const getActiveFilterText = () => {
    const activeFilters = [];
    if (filters.genres.length > 0) activeFilters.push(...filters.genres);
    if (filters.platforms.length > 0) activeFilters.push(...filters.platforms);
    if (filters.contentType.length > 0) activeFilters.push(...filters.contentType);
    if (filters.languages.length > 0) activeFilters.push(...filters.languages);
    if (filters.subtitles.length > 0) activeFilters.push(...filters.subtitles);
    
    return activeFilters.length > 0 ? activeFilters.join(', ') : 'All content';
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handleBackClick}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Back</span>
        </button>
        <Logo className={styles.logo} />
      </div>

      {/* Filter Info */}
      <div className={styles.filterInfo}>
        <h2>Filtered Results</h2>
        <p className={styles.filterText}>{getActiveFilterText()}</p>
        <p className={styles.resultCount}>
          {loading ? 'Loading...' : `${filteredContent.length} results found`}
        </p>
      </div>

      {/* Content Grid */}
      <div className={styles.content}>
        {loading ? (
          <div className={styles.loading}>Loading filtered content...</div>
        ) : filteredContent.length === 0 ? (
          <div className={styles.noResults}>
            <h3>No results found</h3>
            <p>Try adjusting your filters to find more content</p>
          </div>
        ) : (
          <div className={styles.contentGrid}>
            {filteredContent.map((item) => (
              <div
                key={item.id}
                className={styles.contentItem}
                onClick={() => handleItemClick(item)}
              >
                <img 
                  src={item.image || item.posterUrl} 
                  alt={item.title}
                  className={styles.contentImage}
                />
                <div className={styles.contentInfo}>
                  <h3 className={styles.contentTitle}>{item.title}</h3>
                  <p className={styles.contentType}>
                    {item.type || (item.seasons ? 'Series' : 'Movie')} • {item.year}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}