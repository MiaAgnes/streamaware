import styles from './AuthRequiredPopup.module.css';
import Button from './Button';

export default function AuthRequiredPopup({ isOpen, onClose, onLogin }) {
  if (!isOpen) return null;

  return (
    <div className={styles.popup} onClick={onClose}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>Login required</h3>
        <p className={styles.message}>
          You need to be logged in to access this feature. Would you like to log in or sign up?
        </p>
        <div className={styles.actions}>
          <Button onClick={onLogin}>Log in / Sign up</Button>
          <Button onClick={onClose} className={styles.closeButton}>Cancel</Button>
        </div>
      </div>
    </div>
  );
}
