import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import styles from './Homepage.module.css';
import Logo from '../components/Logo.jsx';
import BottomNav from '../components/BottomNav.jsx';
import { getAllMovies, getAllSeries } from '../firebase/firebaseData';

export default function Homepage() {
  const [featuredContent, setFeaturedContent] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [mostSearched, setMostSearched] = useState([]);
  const [trending, setTrending] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [comedies, setComedies] = useState([]);
  const [dramas, setDramas] = useState([]);
  const [action, setAction] = useState([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef(null);

  const filters = ['Movies', 'Series'];

  const streamingServices = [
    { name: 'Netflix', logo: '/images/netflix.webp' },
    { name: 'Prime Video', logo: '/images/primevideo.svg' },
    { name: 'Disney+', logo: '/images/disneyplus.svg' },
    { name: 'HBO Max', logo: '/images/hbomax.png' },
    { name: 'Viaplay', logo: '/images/viaplay.webp' },
    { name: 'Apple TV', logo: '/images/apple-tv.webp' }
  ];

  // Load content from Firebase
  useEffect(() => {
    const loadFeaturedContent = async () => {
      try {
        setLoading(true);
        const [movies, series] = await Promise.all([
          getAllMovies(),
          getAllSeries()
        ]);
        
        // Combine all content
        const allContent = [...movies, ...series];
        
        // Create sections by slicing content - each section gets 3 items
        const featured = allContent.slice(0, 6).map(item => ({
          id: item.id,
          title: item.title,
          image: item.image || item.posterUrl
        }));
        
        const recommendedItems = allContent.slice(6, 9).map(item => ({
          id: item.id,
          title: item.title,
          image: item.image || item.posterUrl
        }));
        
        const mostSearchedItems = allContent.slice(9, 12).map(item => ({
          id: item.id,
          title: item.title,
          image: item.image || item.posterUrl
        }));
        
        const trendingItems = allContent.slice(12, 15).map(item => ({
          id: item.id,
          title: item.title,
          image: item.image || item.posterUrl
        }));
        
        const newReleasesItems = allContent.slice(15, 18).map(item => ({
          id: item.id,
          title: item.title,
          image: item.image || item.posterUrl
        }));
        
        const comedyItems = allContent.slice(18, 21).map(item => ({
          id: item.id,
          title: item.title,
          image: item.image || item.posterUrl
        }));
        
        const dramaItems = allContent.slice(21, 24).map(item => ({
          id: item.id,
          title: item.title,
          image: item.image || item.posterUrl
        }));
        
        const actionItems = allContent.slice(24, 27).map(item => ({
          id: item.id,
          title: item.title,
          image: item.image || item.posterUrl
        }));
        
        setFeaturedContent(featured);
        setRecommended(recommendedItems);
        setMostSearched(mostSearchedItems);
        setTrending(trendingItems);
        setNewReleases(newReleasesItems);
        setComedies(comedyItems);
        setDramas(dramaItems);
        setAction(actionItems);
      } catch (error) {
        console.error('Error loading content:', error);
        setFeaturedContent([]);
        setRecommended([]);
        setMostSearched([]);
        setTrending([]);
        setNewReleases([]);
        setComedies([]);
        setDramas([]);
        setAction([]);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedContent();
  }, []);

  // Create infinite loop by duplicating content more times
  const infiniteFeatured = [
    ...featuredContent, 
    ...featuredContent, 
    ...featuredContent,
    ...featuredContent,
    ...featuredContent
  ];

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    // Set initial position in the middle
    const setInitialPosition = () => {
      if (!carousel) return;
      const itemWidth = carousel.scrollWidth / infiniteFeatured.length;
      const targetScroll = itemWidth * (featuredContent.length * 2);
      
      carousel.style.scrollBehavior = 'auto';
      carousel.scrollLeft = targetScroll;
      
      requestAnimationFrame(() => {
        carousel.style.scrollBehavior = 'smooth';
      });
    };

    const timer = setTimeout(setInitialPosition, 300);

    let scrollTimeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const itemWidth = carousel.scrollWidth / infiniteFeatured.length;
        const scrollLeft = carousel.scrollLeft;
        const currentIndex = Math.round(scrollLeft / itemWidth);
        
        // If scrolled too far right, jump back
        if (currentIndex >= featuredContent.length * 4) {
          const offset = currentIndex % featuredContent.length;
          carousel.style.scrollBehavior = 'auto';
          carousel.scrollLeft = itemWidth * (featuredContent.length * 2 + offset);
          requestAnimationFrame(() => {
            carousel.style.scrollBehavior = 'smooth';
          });
        }
        // If scrolled too far left, jump forward
        else if (currentIndex < featuredContent.length) {
          const offset = currentIndex % featuredContent.length;
          carousel.style.scrollBehavior = 'auto';
          carousel.scrollLeft = itemWidth * (featuredContent.length * 2 + offset);
          requestAnimationFrame(() => {
            carousel.style.scrollBehavior = 'smooth';
          });
        }
      }, 150);
    };

    carousel.addEventListener('scroll', handleScroll);
    
    return () => {
      carousel.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
      clearTimeout(timer);
    };
  }, [featuredContent.length, infiniteFeatured.length]);

  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      {/* Header with Logo */}
      <div className={styles.header}>
        <Logo />
      </div>

      {/* Filter Tags */}
      <div className={styles.filterContainer}>
        {filters.map((filter) => (
          <button
            key={filter}
            className={styles.filterButton}
            onClick={() => navigate('/content-type-results', { state: { contentType: filter } })}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Scrollable Content */}
      <div className={styles.content}>
        {loading ? (
          <div className={styles.loading}>Loading content...</div>
        ) : (
          <>
            {/* Featured Carousel */}
            <div className={styles.featuredSection}>
              <div className={styles.featuredCarousel} ref={carouselRef}>
                {infiniteFeatured.map((item, index) => (
                  <div
                    key={`${item.id}-${index}`}
                    className={styles.featuredItem}
                    onClick={() => navigate('/details', { state: { item } })}
                  >
                    <img src={item.image} alt={item.title} />
                  </div>
                ))}
              </div>
            </div>

            {/* Streaming Services */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Explore content from these services</h2>
              <div className={styles.servicesGrid}>
                {streamingServices.map((service) => (
                  <div 
                    key={service.name} 
                    className={styles.serviceCard}
                    onClick={() => navigate('/platform-results', { state: { platform: service.name } })}
                  >
                    <img 
                      src={service.logo} 
                      alt={service.name}
                      className={service.name === 'HBO Max' ? styles.hboMaxLogo : ''}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Recommended</h2>
              <div className={styles.horizontalScroll}>
                {recommended.map((item) => (
                  <div
                    key={item.id}
                    className={styles.contentCard}
                    onClick={() => navigate('/details', { state: { item } })}
                  >
                    <img src={item.image} alt={item.title} />
                  </div>
                ))}
              </div>
            </div>

            {/* Most Searched */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Most searched</h2>
              <div className={styles.horizontalScroll}>
                {mostSearched.map((item) => (
                  <div
                    key={item.id}
                    className={styles.contentCard}
                    onClick={() => navigate('/details', { state: { item } })}
                  >
                    <img src={item.image} alt={item.title} />
                  </div>
                ))}
              </div>
            </div>

            {/* Trending */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Trending Now</h2>
              <div className={styles.horizontalScroll}>
                {trending.map((item) => (
                  <div
                    key={item.id}
                    className={styles.contentCard}
                    onClick={() => navigate('/details', { state: { item } })}
                  >
                    <img src={item.image} alt={item.title} />
                  </div>
                ))}
              </div>
            </div>

            {/* New Releases */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>New Releases</h2>
              <div className={styles.horizontalScroll}>
                {newReleases.map((item) => (
                  <div
                    key={item.id}
                    className={styles.contentCard}
                    onClick={() => navigate('/details', { state: { item } })}
                  >
                    <img src={item.image} alt={item.title} />
                  </div>
                ))}
              </div>
            </div>

            {/* Comedies */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Comedies</h2>
              <div className={styles.horizontalScroll}>
                {comedies.map((item) => (
                  <div
                    key={item.id}
                    className={styles.contentCard}
                    onClick={() => navigate('/details', { state: { item } })}
                  >
                    <img src={item.image} alt={item.title} />
                  </div>
                ))}
              </div>
            </div>

            {/* Dramas */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Dramas</h2>
              <div className={styles.horizontalScroll}>
                {dramas.map((item) => (
                  <div
                    key={item.id}
                    className={styles.contentCard}
                    onClick={() => navigate('/details', { state: { item } })}
                  >
                    <img src={item.image} alt={item.title} />
                  </div>
                ))}
              </div>
            </div>

            {/* Action */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Action & Adventure</h2>
              <div className={styles.horizontalScroll}>
                {action.map((item) => (
                  <div
                    key={item.id}
                    className={styles.contentCard}
                    onClick={() => navigate('/details', { state: { item } })}
                  >
                    <img src={item.image} alt={item.title} />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bottom Navigation Bar */}
      <BottomNav />
    </div>
  );
}