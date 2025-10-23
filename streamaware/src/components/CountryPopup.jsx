import styles from './CountryPopup.module.css';

const countries = [
  'Denmark', 'Sweden', 'Norway', 'Finland', 'Germany', 
  'United Kingdom', 'United States', 'Canada', 'Australia',
  'France', 'Spain', 'Italy', 'Netherlands', 'Belgium',
  'Austria', 'Switzerland', 'Poland', 'Ireland', 'Portugal'
];

export default function CountryPopup({ isOpen, onClose, onSelect }) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>Select Country</h2>
        <div className={styles.countryList}>
          {countries.map((country) => (
            <div 
              key={country}
              className={styles.countryItem}
              onClick={() => onSelect(country)}
            >
              {country}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
