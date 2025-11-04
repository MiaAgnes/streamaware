import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { searchContent } from '../firebase/firebaseData';
import { getImagePath } from '../utils/imageHelpers';
import styles from './SearchPopup.module.css';

export default function SearchPopup({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      
      const originalStyle = {
        overflow: document.body.style.overflow,
        position: document.body.style.position,
        width: document.body.style.width,
        height: document.body.style.height,
        top: document.body.style.top
      };

      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
      document.body.style.top = `-${scrollY}px`;

      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.height = '100%';

      const preventTouch = (e) => {

        const resultsContainer = e.target.closest('[class*="resultsContainer"]');
        const searchInput = e.target.closest('[class*="searchInput"]');
        const searchBar = e.target.closest('[class*="searchBar"]');
        
        if (resultsContainer || searchInput || searchBar) {
          return; 
        }
        
        e.preventDefault();
      };

      document.addEventListener('touchmove', preventTouch, { passive: false });

      return () => {

        document.body.style.overflow = originalStyle.overflow;
        document.body.style.position = originalStyle.position;
        document.body.style.width = originalStyle.width;
        document.body.style.height = originalStyle.height;
        document.body.style.top = originalStyle.top;
        document.documentElement.style.overflow = '';
        document.documentElement.style.height = '';
        

        document.removeEventListener('touchmove', preventTouch);
        

        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);


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


  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);


  const handleClose = () => {
    setSearchTerm('');
    setSearchResults([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>

        <div className={styles.header}>
          <button className={styles.cancelButton} onClick={handleClose}>
            Cancel
          </button>
        </div>


        <div className={styles.searchContainer}>
          <div className={styles.searchBar}>
            <img src={getImagePath('images/search-full.svg')} alt="Search" className={styles.searchIcon} />
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


        <div 
          className={styles.resultsContainer}
          onTouchStart={() => {

            if (document.activeElement) {
              document.activeElement.blur();
            }
          }}
          onScroll={() => {

            if (document.activeElement) {
              document.activeElement.blur();
            }
          }}
        >
          {isLoading && (
            <div className={styles.loading}>Searching...</div>
          )}
          
          {!isLoading && searchResults.length === 0 && searchTerm && (
            <div className={styles.noResults}>
              No results found for "{searchTerm}"
              <br />
              <small style={{opacity: 0.7, fontSize: '12px'}}>
                Try typing the beginning of a movie or series title
              </small>
            </div>
          )}
          
          {!isLoading && searchResults.length > 0 && (
            <div className={styles.results}>
              <div style={{
                color: 'white', 
                padding: '10px 20px', 
                fontSize: '14px', 
                opacity: 0.8,
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                marginBottom: '10px'
              }}>
                Found {searchResults.length} result(s) starting with "{searchTerm}"
              </div>
              {searchResults
                .sort((a, b) => a.title.localeCompare(b.title))
                .map((item) => (
                <div
                  key={item.id}
                  className={styles.resultItem}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    onClose();
                    navigate('/details', { state: { item } });
                  }}
                  onKeyDown={(e) => { if (e.key === 'Enter') { onClose(); navigate('/details', { state: { item } }); } }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className={styles.resultImage}
                    onError={(e) => { e.target.src = '/images/placeholder.png'; }}
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
