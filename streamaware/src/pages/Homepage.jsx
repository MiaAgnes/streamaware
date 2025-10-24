import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import styles from './Homepage.module.css';
import Logo from '../components/Logo.jsx';

export default function Homepage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState(null);
  const carouselRef = useRef(null);

  const filters = ['Movies', 'Series', 'Languages', 'Categories'];

  const streamingServices = [
    { name: 'Netflix', logo: '/images/netflix.webp' },
    { name: 'Prime Video', logo: '/images/primevideo.svg' },
    { name: 'Disney+', logo: '/images/disneyplus.svg' },
    { name: 'HBO Max', logo: '/images/hbomax.png' },
    { name: 'Viaplay', logo: '/images/viaplay.webp' },
    { name: 'TV2 Play', logo: '/images/tv2play.webp' }
  ];

  // Mock data for content
  const featuredContent = [
    { id: 1, title: 'Wednesday', image: '/images/wednesday.png' },
    { id: 2, title: 'Druk', image: '/images/druk.png' },
    { id: 3, title: 'Lucifer', image: '/images/lucifer.png' },
    { id: 4, title: 'Run', image: '/images/run.png' },
    { id: 5, title: 'Clickbait', image: '/images/clickbait.png' },
    { id: 6, title: 'Victorious', image: '/images/victorious.png' }
  ];

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

  const recommended = [
    { id: 1, title: 'Ginny & Georgia', image: '/images/ginnyandgeorgia.svg' },
    { id: 2, title: 'DU', image: '/images/du.svg' },
    { id: 3, title: 'Black Mirror', image: '/images/blackmirror.svg' }
  ];

  const mostSearched = [
    { id: 1, title: 'Squid Game', image: '/images/squidgame.svg' },
    { id: 2, title: 'Orange is the new Black', image: '/images/orangeisthenewblack.svg' },
    { id: 3, title: 'Dexter', image: '/images/dexter.svg' }
  ];

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
            className={`${styles.filterButton} ${activeFilter === filter ? styles.active : ''}`}
            onClick={() => setActiveFilter(activeFilter === filter ? null : filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Scrollable Content */}
      <div className={styles.content}>
        {/* Featured Carousel */}
        <div className={styles.featuredSection}>
          <div className={styles.featuredCarousel} ref={carouselRef}>
            {infiniteFeatured.map((item, index) => (
              <div key={`${item.id}-${index}`} className={styles.featuredItem}>
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
              <div key={service.name} className={styles.serviceCard}>
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
              <div key={item.id} className={styles.contentCard}>
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
              <div key={item.id} className={styles.contentCard}>
                <img src={item.image} alt={item.title} />
              </div>
            ))}
          </div>
        </div>

        {/* Comedies */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Comedies</h2>
          <div className={styles.horizontalScroll}>
            {/* Add comedy content here */}
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <nav className={styles.bottomNav}>
        <button className={styles.navButton} onClick={() => navigate('/homepage')}>
          <img src="/images/home-full.svg" alt="Home" />
        </button>
        <button className={styles.navButton} onClick={() => navigate('/search')}>
          <img src="/images/search-opacity.svg" alt="Search" />
        </button>
        <button className={styles.navButton} onClick={() => navigate('/favorites')}>
          <img src="/images/heart-opacity.svg" alt="Favorites" />
        </button>
        <button className={styles.navButton} onClick={() => navigate('/profile')}>
          <img src="/images/profile-opacity.svg" alt="Profile" />
        </button>
      </nav>
    </div>
  );
}