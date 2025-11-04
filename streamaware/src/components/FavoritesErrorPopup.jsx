import styles from './FavoritesErrorPopup.module.css';
import Button from './Button';

export default function FavoritesErrorPopup({ isOpen, onClose, message = 'An error occurred while managing favorites. Please try again.' }) {
  if (!isOpen) return null;

  return (
    <div className={styles.popup} onClick={onClose}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>Favorites Error</h3>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <Button onClick={onClose}>OK</Button>
        </div>
      </div>
    </div>
  );
}