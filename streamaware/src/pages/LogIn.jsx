import { useState } from 'react';
import { useNavigate } from 'react-router';
import styles from './LogIn.module.css';
import BackButton from '../components/BackButton.jsx';

export default function LogIn() {
  const navigate = useNavigate();
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd < -100) {
      // Swipe right - go back
      navigate('/');
    }
  };

  return (
    <div 
      className={styles.container}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <BackButton />
      <h1>Log In</h1>
      <p>Log in siden kommer her</p>
    </div>
  );
}