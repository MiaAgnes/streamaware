import { useNavigate } from 'react-router';
import styles from './Logo.module.css';
import { getImagePath } from '../utils/imageHelpers.js';

// Logo component
export default function Logo() {
  const navigate = useNavigate();

  const handleLogoClick = (e) => {
    e.preventDefault();
    navigate('/homepage');
  };

  return (
    <div className={styles.logoWrapper}>
      <a href="/homepage" onClick={handleLogoClick}>
        <img src={getImagePath('images/streamaware-logo.svg')} alt="StreamAware Logo" className={styles.logo} />
      </a>
    </div>
  );
}
