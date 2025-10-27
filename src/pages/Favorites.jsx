import { useNavigate } from 'react-router';
import styles from './Favorites.module.css';

export default function Favorites() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h1>Favorites</h1>
      <p>Your favorites will appear here...</p>
      
      {/* Bottom Navigation Bar */}
      <nav className={styles.bottomNav}>
        <button className={styles.navButton} onClick={() => navigate('/homepage')}>
          <img src="/images/home-opacity.svg" alt="Home" />
        </button>
        <button className={styles.navButton} onClick={() => navigate('/search')}>
          <img src="/images/search-opacity.svg" alt="Search" />
        </button>
        <button className={styles.navButton} onClick={() => navigate('/favorites')}>
          <img src="/images/heart-full.svg" alt="Favorites" />
        </button>
        <button className={styles.navButton} onClick={() => navigate('/profile')}>
          <img src="/images/profile-opacity.svg" alt="Profile" />
        </button>
      </nav>
    </div>
  );
}
