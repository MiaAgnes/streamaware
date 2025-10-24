import styles from './Logo.module.css';

// Logo component
export default function Logo() {
  return (
    <div className={styles.logoWrapper}>
      <a href="/homepage">
        <img src="images/streamaware-logo.svg" alt="StreamAware Logo" className={styles.logo} />
      </a>
    </div>
  );
}
