import { useState, useEffect } from 'react';
import styles from './FilterPopup.module.css';

export default function FilterPopup({ isOpen, onClose, onApplyFilters }) {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [selectedContentType, setSelectedContentType] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedSubtitles, setSelectedSubtitles] = useState([]);

  // Available filter options
  const genres = ['Action', 'Drama', 'Comedy', 'Thriller', 'Horror', 'Romance', 'Adventure', 'Sci-Fi', 'Fantasy', 'Animation'];
  const platforms = ['Netflix', 'HBO Max', 'Disney+', 'Prime Video', 'Apple TV', 'Paramount+'];
  const contentTypes = ['Movies', 'Series'];
  const languages = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 'Danish', 'Swedish', 'Norwegian'];
  const subtitles = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 'Danish', 'Swedish', 'Norwegian'];

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

  const applyFilters = () => {
    const filters = {
      genres: selectedGenres,
      platforms: selectedPlatforms,
      contentType: selectedContentType,
      languages: selectedLanguages,
      subtitles: selectedSubtitles
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
            <button className={styles.applyButton} onClick={applyFilters}>
              Apply
            </button>
        </div>

        {/* Filter Content */}
        <div className={styles.content}>
          {/* Genres */}
          <div className={styles.filterSection}>
            <h3 className={styles.sectionTitle}>Genres</h3>
            <div className={styles.filterGrid}>
              {genres.map((genre, index) => (
                <button
                  key={`genre-${index}-${genre}`}
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
              {platforms.map((platform, index) => (
                <button
                  key={`platform-${index}-${platform}`}
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
              {contentTypes.map((type, index) => (
                <button
                  key={`contentType-${index}-${type}`}
                  className={`${styles.filterButton} ${selectedContentType.includes(type) ? styles.active : ''}`}
                  onClick={() => toggleFilter(selectedContentType, setSelectedContentType, type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className={styles.filterSection}>
            <h3 className={styles.sectionTitle}>Languages</h3>
            <div className={styles.filterGrid}>
              {languages.map((language, index) => (
                <button
                  key={`language-${index}-${language}`}
                  className={`${styles.filterButton} ${selectedLanguages.includes(language) ? styles.active : ''}`}
                  onClick={() => toggleFilter(selectedLanguages, setSelectedLanguages, language)}
                >
                  {language}
                </button>
              ))}
            </div>
          </div>

          {/* Subtitles */}
          <div className={styles.filterSection}>
            <h3 className={styles.sectionTitle}>Subtitles</h3>
            <div className={styles.filterGrid}>
              {subtitles.map((subtitle, index) => (
                <button
                  key={`subtitle-${index}-${subtitle}`}
                  className={`${styles.filterButton} ${selectedSubtitles.includes(subtitle) ? styles.active : ''}`}
                  onClick={() => toggleFilter(selectedSubtitles, setSelectedSubtitles, subtitle)}
                >
                  {subtitle}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}