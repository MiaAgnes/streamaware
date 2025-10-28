import { useState, useEffect } from 'react';
import { searchContent } from '../firebase/firebaseData';
import styles from './SearchPopup.module.css';

export default function SearchPopup({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Prevent body scroll when popup is open
  useEffect(() => {
    if (isOpen) {
      // Get the current scroll position
      const scrollY = window.scrollY;
      
      // Store original values
      const originalStyle = {
        overflow: document.body.style.overflow,
        position: document.body.style.position,
        width: document.body.style.width,
        height: document.body.style.height,
        top: document.body.style.top
      };

      // Apply scroll lock with current scroll position
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
      document.body.style.top = `-${scrollY}px`;
      
      // Prevent scrolling on the html element as well
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.height = '100%';

      // Add global touch event listener
      const preventTouch = (e) => {
        // Allow touch events inside the results container or search input
        const resultsContainer = e.target.closest('[class*="resultsContainer"]');
        const searchInput = e.target.closest('[class*="searchInput"]');
        const searchBar = e.target.closest('[class*="searchBar"]');
        
        if (resultsContainer || searchInput || searchBar) {
          return; // Allow scrolling in these areas
        }
        
        e.preventDefault();
      };

      document.addEventListener('touchmove', preventTouch, { passive: false });

      return () => {
        // Restore original values
        document.body.style.overflow = originalStyle.overflow;
        document.body.style.position = originalStyle.position;
        document.body.style.width = originalStyle.width;
        document.body.style.height = originalStyle.height;
        document.body.style.top = originalStyle.top;
        document.documentElement.style.overflow = '';
        document.documentElement.style.height = '';
        
        // Remove the global touch listener
        document.removeEventListener('touchmove', preventTouch);
        
        // Restore scroll position
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  // Handle search
  const handleSearch = async (term) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const results = await searchContent(term);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Handle popup close
  const handleClose = () => {
    setSearchTerm('');
    setSearchResults([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        {/* Header */}
        <div className={styles.header}>
          <button className={styles.cancelButton} onClick={handleClose}>
            Cancel
          </button>
        </div>

        {/* Search Bar */}
        <div className={styles.searchContainer}>
          <div className={styles.searchBar}>
            <img src="/images/search-full.svg" alt="Search" className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search after title.."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
              autoFocus
            />
          </div>
        </div>

        {/* Search Results */}
        <div 
          className={styles.resultsContainer}
          onTouchStart={() => {
            // Dismiss keyboard when user starts scrolling
            if (document.activeElement) {
              document.activeElement.blur();
            }
          }}
          onScroll={() => {
            // Also dismiss keyboard on scroll
            if (document.activeElement) {
              document.activeElement.blur();
            }
          }}
        >
          {isLoading && (
            <div className={styles.loading}>Searching...</div>
          )}
          
          {!isLoading && searchResults.length === 0 && searchTerm && (
            <div className={styles.noResults}>No results found</div>
          )}
          
          {!isLoading && searchResults.length > 0 && (
            <div className={styles.results}>
              {searchResults.map((item) => (
                <div key={item.id} className={styles.resultItem}>
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className={styles.resultImage}
                    onError={(e) => {
                      e.target.src = '/images/placeholder.png'; // Fallback image
                    }}
                  />
                  <div className={styles.resultInfo}>
                    <h3 className={styles.resultTitle}>{item.title}</h3>
                    <p className={styles.resultType}>
                      {item.type === 'movie' ? 'Movie' : 'Series'} • {item.year}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
