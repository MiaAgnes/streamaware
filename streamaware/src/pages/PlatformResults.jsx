import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { getAllMovies, getAllSeries } from '../firebase/firebaseData';
import styles from './PlatformResults.module.css';
import Logo from '../components/Logo.jsx';
import BottomNav from '../components/BottomNav.jsx';

export default function PlatformResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const platform = location.state?.platform || 'Netflix';
  
  const [allContent, setAllContent] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter content by platform
  const filteredContent = useMemo(() => {
    return allContent.filter(item => {
      // Platform filter - check if item has the selected platform
      if (item.platforms) {
        return item.platforms.some(itemPlatform => 
          itemPlatform.toLowerCase().includes(platform.toLowerCase())
        );
      }
      return false;
    });
  }, [allContent, platform]);

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

      {/* Platform Info */}
      <div className={styles.platformInfo}>
        <h2>{platform} Content</h2>
        <p className={styles.resultCount}>
          {loading ? 'Loading...' : `${filteredContent.length} titles available`}
        </p>
      </div>

      {/* Content Grid */}
      <div className={styles.content}>
        {loading ? (
          <div className={styles.loading}>Loading content...</div>
        ) : filteredContent.length === 0 ? (
          <div className={styles.noResults}>
            <p>No content found for {platform}</p>
          </div>
        ) : (
          <div className={styles.contentGrid}>
            {filteredContent.map((item) => (
              <div
                key={item.id}
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