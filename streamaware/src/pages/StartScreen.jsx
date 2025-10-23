import { useState } from 'react';
import styles from './StartScreen.module.css';
import Button from '../components/Button';
import HelpPopup from '../components/HelpPopup';

export default function StartScreen() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const handleSignUp = () => {
    console.log('Sign Up clicked!');
    // Navigation til SignUp side
  };

  const handleLogIn = () => {
    console.log('Log In clicked!');
    // Navigation til LogIn side
  };

  const openHelp = () => {
    setIsHelpOpen(true);
  };

  const closeHelp = () => {
    setIsHelpOpen(false);
  };

  return (
    <div className={styles.container}>
      <button onClick={openHelp} className={styles.helpIcon}>
        <img src="/images/help-icon.svg" alt="Help" />
      </button>
      <Button onClick={handleSignUp}>Sign Up</Button>
      <Button onClick={handleLogIn}>Log In</Button>
      <div className={styles.guestLink}>
        <a href="/homepage">Continue as a guest</a>
      </div>
      <p className={styles.termsOfService}>
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>
      
      <HelpPopup isOpen={isHelpOpen} onClose={closeHelp} />
    </div>
  );
}
