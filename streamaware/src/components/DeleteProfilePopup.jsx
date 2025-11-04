import styles from './DeleteProfilePopup.module.css';
import Button from './Button';

export default function DeleteProfilePopup({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Delete Profile', 
  message = 'Are you sure you want to delete your profile? This action cannot be undone and all your data will be permanently removed.',
  confirmText = 'Delete',
  cancelText = 'Cancel'
}) {
  if (!isOpen) return null;

  return (
    <div className={styles.popup} onClick={onClose}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <Button onClick={onConfirm} className={styles.deleteButton}>{confirmText}</Button>
          <Button onClick={onClose}>{cancelText}</Button>
        </div>
      </div>
    </div>
  );
}