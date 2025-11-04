import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { getAllMovies, getAllSeries } from '../firebase/firebaseData';
import styles from './FilterResults.module.css';
import Logo from '../components/Logo.jsx';
import BottomNav from '../components/BottomNav.jsx';

export default function FilterResults() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const filters = state?.filters || {};
  
  const [allContent, setAllContent] = useState([]);
  const [filteredContent, setFilteredContent] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load all content
  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        const [movies, series] = await Promise.all([
          getAllMovies(),
          getAllSeries()
        ]);
        
        const combined = [...movies, ...series];
        setAllContent(combined);
        
        // Apply filters
        const filtered = applyFilters(combined, filters);
        setFilteredContent(filtered);
      } catch (error) {
        console.error('Error loading and filtering content:', error);
        setAllContent([]);
        setFilteredContent([]);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  const applyFilters = (content, filters) => {
    let filtered = [...content];

    // Filter by genres
    if (filters.genres && filters.genres.length > 0) {
      filtered = filtered.filter(item =>
        item.genres && item.genres.some(genre =>
          filters.genres.includes(genre)
        )
      );
    }

    // Filter by platforms
    if (filters.platforms && filters.platforms.length > 0) {
      filtered = filtered.filter(item => {
        if (!item.platforms || item.platforms.length === 0) return false;
        
        return item.platforms.some(itemPlatform => {
          const platformName = typeof itemPlatform === 'string' 
            ? itemPlatform 
            : itemPlatform?.name || '';
          
          return filters.platforms.some(filterPlatform => 
            platformName.toLowerCase().includes(filterPlatform.toLowerCase())
          );
        });
      });
    }

    // Filter by content type
    if (filters.contentType && filters.contentType.length > 0) {
      filtered = filtered.filter(item => {
        const itemType = item.type === 'movie' ? 'Movies' : 'Series';
        return filters.contentType.includes(itemType);
      });
    }

    // Filter by languages
    if (filters.languages && filters.languages.length > 0) {
      filtered = filtered.filter(item => {
        if (!item.language && !item.languages) return false;
        
        const itemLanguages = item.languages || item.language || [];
        const languageArray = Array.isArray(itemLanguages) ? itemLanguages : [itemLanguages];
        
        return languageArray.some(lang => {
          const languageName = typeof lang === 'string' ? lang : lang?.name || '';
          return filters.languages.some(filterLang =>
            languageName.toLowerCase().includes(filterLang.toLowerCase())
          );
        });
      });
    }

    // Filter by subtitles
    if (filters.subtitles && filters.subtitles.length > 0) {
      filtered = filtered.filter(item => {
        if (!item.subtitles) return false;
        
        const subtitleArray = Array.isArray(item.subtitles) ? item.subtitles : [item.subtitles];
        
        return subtitleArray.some(subtitle => {
          const subtitleName = typeof subtitle === 'string' ? subtitle : subtitle?.name || '';
          return filters.subtitles.some(filterSub =>
            subtitleName.toLowerCase().includes(filterSub.toLowerCase())
          );
        });
      });
    }

    return filtered;
  };

  const handleItemClick = (item) => {
    navigate('/details', { state: { item } });
  };

  const handleBackClick = () => {
    navigate(-1);
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

      {/* Content Type Info */}
      <div className={styles.contentTypeInfo}>
        <h2>Filter Results</h2>
        <p className={styles.resultCount}>
          {loading ? 'Loading...' : `${filteredContent.length} results found`}
        </p>
      </div>

      {/* Content Grid */}
      <div className={styles.content}>
        {loading ? (
          <div className={styles.loading}>Loading content...</div>
        ) : filteredContent.length === 0 ? (
          <div className={styles.noResults}>
            <p>No content matches your filters</p>
          </div>
        ) : (
          <div className={styles.contentGrid}>
            {filteredContent.map((item, index) => (
              <div
                key={`filter-result-${item.id}-${index}`}
                className={styles.contentCard}
                onClick={() => handleItemClick(item)}
              >
                <img 
                  src={item.image || item.posterUrl || '/images/placeholder.png'} 
                  alt={item.title}
                  onError={(e) => { e.target.src = '/images/placeholder.png'; }}
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

      <BottomNav />
    </div>
  );
}