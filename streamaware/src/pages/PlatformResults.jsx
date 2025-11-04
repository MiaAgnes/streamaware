import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { getMoviesByPlatform, getSeriesByPlatform } from '../firebase/firebaseData';
import styles from './PlatformResults.module.css';
import Logo from '../components/Logo.jsx';
import BottomNav from '../components/BottomNav.jsx';

export default function PlatformResults() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const platform = state?.platform;
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlatformContent = async () => {
      if (!platform) {
        navigate('/');
        return;
      }

      try {
        setLoading(true);
        const [movies, series] = await Promise.all([
          getMoviesByPlatform(platform),
          getSeriesByPlatform(platform)
        ]);

        const allContent = [...movies, ...series];
        setContent(allContent);
      } catch (error) {
        console.error('Error loading platform content:', error);
        setContent([]);
      } finally {
        setLoading(false);
      }
    };

    loadPlatformContent();
  }, [platform, navigate]);

  const handleItemClick = (item) => {
    navigate('/details', { state: { item } });
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  if (!platform) {
    return null;
  }

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
      <div className={styles.contentTypeInfo}>
        <h2>{platform}</h2>
        <p className={styles.resultCount}>
          {loading ? 'Loading...' : `${content.length} titles available`}
        </p>
      </div>

      {/* Content Grid */}
      <div className={styles.content}>
        {loading ? (
          <div className={styles.loading}>Loading content...</div>
        ) : content.length === 0 ? (
          <div className={styles.noResults}>
            <p>No content found for {platform}</p>
          </div>
        ) : (
          <div className={styles.contentGrid}>
            {content.map((item, index) => (
              <div
                key={`platform-content-${item.id}-${index}`}
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
                    {item.type === 'movie' ? 'Movie' : item.type === 'series' ? 'Series' : (item.seasons ? 'Series' : 'Movie')} • {item.year}
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