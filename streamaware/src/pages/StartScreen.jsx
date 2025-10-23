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
    </div>
  );
}
