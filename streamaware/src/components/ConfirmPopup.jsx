import styles from './ConfirmPopup.module.css';
import Button from './Button';

export default function ConfirmPopup({ isOpen, title = 'Are you sure?', message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel' }) {
  if (!isOpen) return null;

  return (
    <div className={styles.popup} onClick={onCancel}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
  <h3 className={styles.title}>{title}</h3>
  {message && <p className={styles.message}>{message}</p>}
        <div className={styles.actions}>
          <Button onClick={onConfirm}>{confirmText}</Button>
          <Button onClick={onCancel} className={styles.closeButton}>{cancelText}</Button>
        </div>
      </div>
    </div>
  );
}
