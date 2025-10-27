import { useState } from 'react';
import { useNavigate } from 'react-router';
import { registerUser } from '../firebase/firebaseAuth.js';
import styles from './SignUp.module.css';
import InputFields from '../components/InputFields.jsx';
import CountryPopup from '../components/CountryPopup.jsx';
import HelpPopup from '../components/HelpPopup.jsx';
import Button from '../components/Button.jsx';
import BackButton from '../components/BackButton.jsx';

export default function SignUp() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [password, setPassword] = useState('');
  const [isCountryPopupOpen, setIsCountryPopupOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [errors, setErrors] = useState({
    username: false,
    email: false,
    country: false,
    password: false
  });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  const handleSignUp = async () => {
    setSubmitted(true);
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

    // If there are validation errors, stop here
    if (Object.values(newErrors).some(error => error)) {
      return;
    }

    // All validations passed - try to register user with Firebase
    setIsLoading(true);
    try {
      await registerUser(email, password, username, country);
      console.log("✅ User successfully created!");
      // Navigate to homepage on successful registration
      navigate('/homepage');
    } catch (error) {
      console.error("❌ Registration error:", error.message);
      // Handle specific Firebase errors
      if (error.code === 'auth/email-already-in-use') {
        setErrors(prev => ({ ...prev, email: true }));
        alert('This email is already registered. Please use a different email or try logging in.');
      } else if (error.code === 'auth/weak-password') {
        setErrors(prev => ({ ...prev, password: true }));
        alert('Password is too weak. Please choose a stronger password.');
      } else {
        alert('Registration failed: ' + error.message);
      }
    } finally {
      setIsLoading(false);
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
      <h1>Sign up</h1>
      <div className={styles.form}>
          {/* Username */}
          <div className={styles.inputWrapper}>
            <InputFields
              name="username"
              type="text"
              placeholder="Username"
              autoComplete="username"
              value={username}
              onChange={e => {
                setUsername(e.target.value);
                if (errors.username) {
                  if (e.target.value.trim() && validateUsername(e.target.value)) {
                    setErrors(prev => ({ ...prev, username: false }));
                  }
                }
              }}
            />
            {errors.username && username && submitted && (
              <span className={styles.fieldError}>Only letters, numbers and _ allowed</span>
            )}
          </div>

          {/* Email */}
          <div className={styles.inputWrapper}>
            <InputFields
              name="email"
              type="email"
              placeholder="E-mail"
              autoComplete="email"
              value={email}
              onChange={e => {
                setEmail(e.target.value);
                if (errors.email) {
                  if (e.target.value.trim() && validateEmail(e.target.value)) {
                    setErrors(prev => ({ ...prev, email: false }));
                  }
                }
              }}
            />
            {errors.email && email && submitted && (
              <span className={styles.fieldError}>Please enter a valid email address</span>
            )}
          </div>

          {/* Password */}
          <div className={styles.inputWrapper}>
            <InputFields
              name="password"
              type="password"
              placeholder="Password"
              autoComplete="new-password"
              value={password}
              onChange={e => {
                setPassword(e.target.value);
                if (errors.password) {
                  if (e.target.value.trim() && e.target.value.length >= 6) {
                    setErrors(prev => ({ ...prev, password: false }));
                  }
                }
              }}
            />
            {errors.password && password && submitted && (
              <span className={styles.fieldError}>Password must be at least 6 characters</span>
            )}
          </div>
        <div className={styles.inputWrapper}>
          <div 
            className={`${styles.selectField} ${country ? styles.selected : ''}`} 
            onClick={() => setIsCountryPopupOpen(true)}
          >
            {country || 'Select Country'}
          </div>
          <button onClick={() => setIsHelpOpen(true)} className={styles.helpIcon}>?</button>
          {errors.country && submitted && (
            <span className={styles.fieldError}>Please select a country</span>
          )}
        </div>
        <Button className={styles.signUpButton} onClick={handleSignUp} disabled={isLoading}>
          {isLoading ? 'Creating Account...' : 'Sign Up'}
        </Button>
      </div>
      
      {isCountryPopupOpen && (
        <CountryPopup 
          isOpen={isCountryPopupOpen}
          onClose={() => setIsCountryPopupOpen(false)}
          onSelect={handleCountrySelect}
        />
      )}
      
      {isHelpOpen && (
        <HelpPopup 
          isOpen={isHelpOpen}
          onClose={() => setIsHelpOpen(false)}
        >
          <p>Choose the country you live in, but dont worry, you can always change it in your profile.</p>
          <p>This won’t affect the language of the app</p>
        </HelpPopup>
      )}
    </div>
  );
}