import { useState } from 'react';
import { useNavigate } from 'react-router';
import styles from './Homepage.module.css';
import Logo from '../components/Logo.jsx';

export default function Homepage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('Movies');

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
    { id: 1, title: 'Wednesday', image: '/images/wednesday.svg' },
    { id: 2, title: 'KPOP Demon Hunters', image: '/images/kpop.svg' },
    { id: 3, title: 'Smuk', image: '/images/smuk.svg' }
  ];

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
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Scrollable Content */}
      <div className={styles.content}>
        {/* Featured Carousel */}
        <div className={styles.carouselSection}>
          <div className={styles.carousel}>
            <button className={styles.carouselArrow}>‹</button>
            <div className={styles.carouselContent}>
              {featuredContent.map((item) => (
                <div key={item.id} className={styles.carouselItem}>
                  <img src={item.image} alt={item.title} />
                </div>
              ))}
            </div>
            <button className={styles.carouselArrow}>›</button>
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
          <div className={styles.carousel}>
            <button className={styles.carouselArrow}>‹</button>
            <div className={styles.horizontalScroll}>
              {recommended.map((item) => (
                <div key={item.id} className={styles.contentCard}>
                  <img src={item.image} alt={item.title} />
                </div>
              ))}
            </div>
            <button className={styles.carouselArrow}>›</button>
          </div>
        </div>

        {/* Most Searched */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Most searched</h2>
          <div className={styles.carousel}>
            <button className={styles.carouselArrow}>‹</button>
            <div className={styles.horizontalScroll}>
              {mostSearched.map((item) => (
                <div key={item.id} className={styles.contentCard}>
                  <img src={item.image} alt={item.title} />
                </div>
              ))}
            </div>
            <button className={styles.carouselArrow}>›</button>
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