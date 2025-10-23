import styles from './StartScreen.module.css';
import Button from '../components/Button';

export default function StartScreen() {
  const handleClick = () => {
    console.log('Button clicked!');
    // Her kan du tilføje navigation eller anden funktionalitet
  };

  return (
    <div className={styles.container}>
      <Button onClick={handleClick}>Sign Up</Button>
      <Button onClick={handleClick}>Log In</Button>
      <div className={styles.guestLink}>
        <a href="/Homepage">Continue as a guest</a>
        <div>
        <p className={styles.termsOfService}>By continuing, you agree to our Terms of Service and Privacy Policy.</p>
        </div>
      </div>
    </div>
  );
}
