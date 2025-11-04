import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { getAllMovies, getAllSeries } from '../firebase/firebaseData';
import styles from './ContentTypeResults.module.css';
import Logo from '../components/Logo.jsx';
import BottomNav from '../components/BottomNav.jsx';

export default function ContentTypeResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const contentType = location.state?.contentType || 'Movies';
  
  const [allContent, setAllContent] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter content by type
  const filteredContent = useMemo(() => {
    return allContent.filter(item => {
      if (contentType === 'Movies') {
        // Show movies (items without seasons or with type 'movie')
        return !item.seasons && (!item.type || item.type.toLowerCase() === 'movie');
      } else if (contentType === 'Series') {
        // Show series (items with seasons or with type 'series')
        return item.seasons || (item.type && item.type.toLowerCase() === 'series');
      }
      return false;
    });
  }, [allContent, contentType]);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        const [movies, series] = await Promise.all([
          getAllMovies(),
          getAllSeries()
        ]);
        
        const allItems = [...movies, ...series];
        setAllContent(allItems);
      } catch (error) {
        console.error('Error loading content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  const handleItemClick = (item) => {
    navigate('/details', { state: { item } });
  };

  const handleBackClick = () => {
    navigate(-1); // Go back to previous page
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
        <h2>{contentType}</h2>
        <p className={styles.resultCount}>
          {loading ? 'Loading...' : `${filteredContent.length} ${contentType.toLowerCase()} available`}
        </p>
      </div>

      {/* Content Grid */}
      <div className={styles.content}>
        {loading ? (
          <div className={styles.loading}>Loading content...</div>
        ) : filteredContent.length === 0 ? (
          <div className={styles.noResults}>
            <p>No {contentType.toLowerCase()} found</p>
          </div>
        ) : (
          <div className={styles.contentGrid}>
            {filteredContent.map((item, index) => (
              <div
                key={`content-${item.id}-${index}`}
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