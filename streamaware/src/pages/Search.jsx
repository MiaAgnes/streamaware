import { useNavigate } from 'react-router';
import styles from './Search.module.css';

export default function Search() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h1>Search</h1>
      <p>Search page coming soon...</p>
      
      {/* Bottom Navigation Bar */}
      <nav className={styles.bottomNav}>
        <button className={styles.navButton} onClick={() => navigate('/homepage')}>
          <img src="/images/home-opacity.svg" alt="Home" />
        </button>
        <button className={styles.navButton} onClick={() => navigate('/search')}>
          <img src="/images/search-full.svg" alt="Search" />
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
