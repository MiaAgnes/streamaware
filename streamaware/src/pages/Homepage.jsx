import styles from './Homepage.module.css';
import Logo from '../components/Logo.jsx';

export default function Homepage() {
  return (
    <div className={styles.container}>
      <Logo />
    </div>
  );
}