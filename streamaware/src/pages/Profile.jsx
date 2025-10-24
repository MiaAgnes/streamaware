import { useNavigate } from 'react-router';
import styles from './Profile.module.css';

export default function Profile() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h1>Profile</h1>
      <p>Your profile settings...</p>
      
      {/* Bottom Navigation Bar */}
      <nav className={styles.bottomNav}>
        <button className={styles.navButton} onClick={() => navigate('/homepage')}>
          <img src="/images/home-opacity.svg" alt="Home" />
        </button>
        <button className={styles.navButton} onClick={() => navigate('/search')}>
          <img src="/images/search-opacity.svg" alt="Search" />
        </button>
        <button className={styles.navButton} onClick={() => navigate('/favorites')}>
          <img src="/images/heart-opacity.svg" alt="Favorites" />
        </button>
        <button className={styles.navButton} onClick={() => navigate('/profile')}>
          <img src="/images/profile-full.svg" alt="Profile" />
        </button>
      </nav>
    </div>
  );
}
