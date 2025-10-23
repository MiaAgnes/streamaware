import { useState } from 'react';
import { useNavigate } from 'react-router';
import styles from './SignUp.module.css';
import InputFields from '../components/InputFields.jsx';
import CountryPopup from '../components/CountryPopup.jsx';
import Button from '../components/Button.jsx';

export default function SignUp() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [password, setPassword] = useState('');
  const [isCountryPopupOpen, setIsCountryPopupOpen] = useState(false);
  const [errors, setErrors] = useState({
    username: false,
    email: false,
    country: false,
    password: false
  });

  const handleCountrySelect = (selectedCountry) => {
    setCountry(selectedCountry);
    setIsCountryPopupOpen(false);
  };

  const validateUsername = (username) => {
    // Kun bogstaver, tal og underscore tilladt - ingen special tegn
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    return usernameRegex.test(username);
  };

  const validateEmail = (email) => {
    // Standard email validering
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignUp = () => {
    const newErrors = {
      username: false,
      email: false,
      country: false,
      password: false
    };

    // Check username
    if (!username.trim()) {
      newErrors.username = true;
    } else if (!validateUsername(username)) {
      newErrors.username = true;
    }

    // Check email
    if (!email.trim()) {
      newErrors.email = true;
    } else if (!validateEmail(email)) {
      newErrors.email = true;
    }

    // Check country
    if (!country) {
      newErrors.country = true;
    }

    // Check password
    if (!password.trim()) {
      newErrors.password = true;
    } else if (password.length < 6) {
      newErrors.password = true;
    }

    setErrors(newErrors);

    // Hvis der er fejl, stop her
    if (Object.values(newErrors).some(error => error)) {
      return;
    }

    // Alle valideringer bestået - naviger til homepage
    navigate('/homepage');
  };

  return (
    <div className={styles.container}>
      <h1>Sign Up</h1>
      <div className={styles.form}>
        <div className={styles.inputWrapper}>
          <InputFields
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
          {errors.username && <span className={styles.errorIcon}>!</span>}
        </div>
        <div className={styles.inputWrapper}>
          <InputFields
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          {errors.email && <span className={styles.errorIcon}>!</span>}
        </div>
        <div className={styles.inputWrapper}>
          <div className={styles.selectField} onClick={() => setIsCountryPopupOpen(true)}>
            {country || 'Select Country'}
          </div>
          {errors.country && <span className={styles.errorIcon}>!</span>}
        </div>
        <div className={styles.inputWrapper}>
          <InputFields
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          {errors.password && <span className={styles.errorIcon}>!</span>}
        </div>
        <Button onClick={handleSignUp}>Sign Up</Button>
      </div>
      
      {isCountryPopupOpen && (
        <CountryPopup 
          isOpen={isCountryPopupOpen}
          onClose={() => setIsCountryPopupOpen(false)}
          onSelect={handleCountrySelect}
        />
      )}
    </div>
  );
}