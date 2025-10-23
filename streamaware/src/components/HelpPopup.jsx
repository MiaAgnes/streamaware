import styles from './HelpPopup.module.css';
import Button from './Button';

export default function HelpPopup({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className={styles.popup} onClick={onClose}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        {children || <p>StreamAware is a smart app that helps you easily find where movies and shows are available to stream, without having to search across multiple platforms. You can filter by audio language, subtitles, and country availability to quickly see what you can watch and where.</p>}
        <Button className={styles.closeButton} onClick={onClose}>I Understand</Button>
      </div>
    </div>
  );
}