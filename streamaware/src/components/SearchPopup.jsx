import { useState, useEffect } from 'react';
import { searchContent } from '../firebase/firebaseData';
import styles from './SearchPopup.module.css';

export default function SearchPopup({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
        <div className={styles.resultsContainer}>
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
