import { useState, useEffect } from 'react';
import styles from './FilterPopup.module.css';

export default function FilterPopup({ isOpen, onClose, onApplyFilters }) {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [selectedContentType, setSelectedContentType] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);

  // Available filter options
  const genres = ['Action', 'Drama', 'Comedy', 'Thriller', 'Horror', 'Romance', 'Adventure', 'Sci-Fi', 'Fantasy', 'Mystery'];
  const platforms = ['Netflix', 'HBO Max', 'Disney+', 'Amazon Prime', 'Apple TV+', 'Hulu', 'Paramount+', 'Peacock'];
  const contentTypes = ['Movies', 'Series'];
  const countries = ['USA', 'South Korea', 'UK', 'Japan', 'Spain', 'France', 'Germany', 'Canada'];

  // Prevent body scroll when popup is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const toggleFilter = (filterArray, setFilterArray, value) => {
    if (filterArray.includes(value)) {
      setFilterArray(filterArray.filter(item => item !== value));
    } else {
      setFilterArray([...filterArray, value]);
    }
  };

  const clearAllFilters = () => {
    setSelectedGenres([]);
    setSelectedPlatforms([]);
    setSelectedContentType([]);
    setSelectedCountries([]);
  };

  const applyFilters = () => {
    const filters = {
      genres: selectedGenres,
      platforms: selectedPlatforms,
      contentType: selectedContentType,
      countries: selectedCountries
    };
    
    if (onApplyFilters) {
      onApplyFilters(filters);
    }
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <button className={styles.cancelButton} onClick={handleClose}>
            Cancel
          </button>
          <h2 className={styles.title}>Filters</h2>
          <div className={styles.headerButtons}>
            <button className={styles.clearButton} onClick={clearAllFilters}>
              Clear All
            </button>
            <button className={styles.applyButton} onClick={applyFilters}>
              Apply
            </button>
          </div>
        </div>

        {/* Filter Content */}
        <div className={styles.content}>
          {/* Genres */}
          <div className={styles.filterSection}>
            <h3 className={styles.sectionTitle}>Genres</h3>
            <div className={styles.filterGrid}>
              {genres.map((genre) => (
                <button
                  key={genre}
                  className={`${styles.filterButton} ${selectedGenres.includes(genre) ? styles.active : ''}`}
                  onClick={() => toggleFilter(selectedGenres, setSelectedGenres, genre)}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {/* Platforms */}
          <div className={styles.filterSection}>
            <h3 className={styles.sectionTitle}>Platforms</h3>
            <div className={styles.filterGrid}>
              {platforms.map((platform) => (
                <button
                  key={platform}
                  className={`${styles.filterButton} ${selectedPlatforms.includes(platform) ? styles.active : ''}`}
                  onClick={() => toggleFilter(selectedPlatforms, setSelectedPlatforms, platform)}
                >
                  {platform}
                </button>
              ))}
            </div>
          </div>

          {/* Content Type */}
          <div className={styles.filterSection}>
            <h3 className={styles.sectionTitle}>Content Type</h3>
            <div className={styles.filterGrid}>
              {contentTypes.map((type) => (
                <button
                  key={type}
                  className={`${styles.filterButton} ${selectedContentType.includes(type) ? styles.active : ''}`}
                  onClick={() => toggleFilter(selectedContentType, setSelectedContentType, type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Countries */}
          <div className={styles.filterSection}>
            <h3 className={styles.sectionTitle}>Countries</h3>
            <div className={styles.filterGrid}>
              {countries.map((country) => (
                <button
                  key={country}
                  className={`${styles.filterButton} ${selectedCountries.includes(country) ? styles.active : ''}`}
                  onClick={() => toggleFilter(selectedCountries, setSelectedCountries, country)}
                >
                  {country}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}