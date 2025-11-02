import { useState } from 'react';
import styles from './ProfileImageSelector.module.css';

const availableProfileImages = [
  '/images/cat-profile.svg',
  '/images/dog-profile.svg',
  '/images/lion-profile.svg',
  '/images/rabbit-profile.svg'
];

export default function ProfileImageSelector({ isOpen, currentImage, onClose, onSelect }) {
  const [selectedImage, setSelectedImage] = useState(currentImage);

  const handleSelect = () => {
    onSelect(selectedImage);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Choose Profile Image</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.imageGrid}>
          {availableProfileImages.map((imagePath) => (
            <div
              key={imagePath}
              className={`${styles.imageOption} ${selectedImage === imagePath ? styles.selected : ''}`}
              onClick={() => setSelectedImage(imagePath)}
            >
              <img src={imagePath} alt="Profile option" className={styles.profileImage} />
              {selectedImage === imagePath && (
                <div className={styles.selectedIndicator}>✓</div>
              )}
            </div>
          ))}
        </div>

        <div className={styles.actions}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.selectButton} onClick={handleSelect}>
            Select
          </button>
        </div>
      </div>
    </div>
  );
}