import { useState } from 'react';
import { useNavigate } from 'react-router';
import styles from './StartScreen.module.css';
import Button from '../components/Button';
import HelpPopup from '../components/HelpPopup';

export default function StartScreen() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate('/signup');
  };

  const handleLogIn = () => {
    navigate('/login');
  };

  const handleGuestContinue = (e) => {
    e.preventDefault();
    // mark session as guest
    try {
      localStorage.setItem('isGuest', '1');
    } catch (err) {
      console.warn('Could not set guest flag in localStorage', err);
    }
    navigate('/homepage');
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
        ?
      </button>
      <Button onClick={handleSignUp}>Sign Up</Button>
      <Button onClick={handleLogIn}>Log In</Button>
      <div className={styles.guestLink}>
        <a href="/homepage" onClick={handleGuestContinue}>Continue as a guest</a>
      </div>
      <p className={styles.termsOfService}>
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>
      
      <HelpPopup isOpen={isHelpOpen} onClose={closeHelp} />
    </div>
  );
}
