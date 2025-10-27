import { useState } from 'react';
import { useNavigate } from 'react-router';
import { loginUser } from '../firebase/firebaseAuth.js';
import styles from './LogIn.module.css';
import InputFields from '../components/InputFields.jsx';
import Button from '../components/Button.jsx';
import BackButton from '../components/BackButton.jsx';

export default function LogIn() {
  const navigate = useNavigate();
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    usernameOrEmail: false,
    password: false
  });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const validateUsernameOrEmail = (input) => {
    // Accept either username (letters, numbers, underscore) or email format
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return usernameRegex.test(input) || emailRegex.test(input);
  };

  const isEmail = (input) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
  };

  const handleLogIn = async () => {
    setSubmitted(true);
    const newErrors = {
      usernameOrEmail: false,
      password: false
    };

    // Check username or email
    if (!usernameOrEmail.trim()) {
      newErrors.usernameOrEmail = true;
    } else if (!validateUsernameOrEmail(usernameOrEmail)) {
      newErrors.usernameOrEmail = true;
    }

    // Check password
    if (!password.trim()) {
      newErrors.password = true;
    }

    setErrors(newErrors);

    // If there are validation errors, stop here
    if (Object.values(newErrors).some(error => error)) {
      return;
    }

    // Note: Firebase Auth only supports email login, not username
    // If user enters username, we'll need to show an error
    if (!isEmail(usernameOrEmail)) {
      setErrors(prev => ({ ...prev, usernameOrEmail: true }));
      alert('Please use your email address to log in. Firebase Authentication requires email, not username.');
      return;
    }

    // All validations passed - try to log in with Firebase
    setIsLoading(true);
    try {
      await loginUser(usernameOrEmail, password);
      console.log("✅ User successfully logged in!");
      // Navigate to homepage on successful login
      navigate('/homepage');
    } catch (error) {
      console.error("❌ Login error:", error.message);
      // Handle specific Firebase errors
      if (error.code === 'auth/user-not-found') {
        setErrors(prev => ({ ...prev, usernameOrEmail: true }));
        alert('No account found with this email. Please check your email or sign up.');
      } else if (error.code === 'auth/wrong-password') {
        setErrors(prev => ({ ...prev, password: true }));
        alert('Incorrect password. Please try again.');
      } else if (error.code === 'auth/invalid-email') {
        setErrors(prev => ({ ...prev, usernameOrEmail: true }));
        alert('Invalid email format. Please enter a valid email address.');
      } else if (error.code === 'auth/too-many-requests') {
        alert('Too many failed login attempts. Please try again later.');
      } else {
        alert('Login failed: ' + error.message);
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
      <h1>Log In</h1>
      <div className={styles.form}>
        {/* Username or Email */}
        <div className={styles.inputWrapper}>
          <InputFields
            name="usernameOrEmail"
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={usernameOrEmail}
            onChange={e => {
              setUsernameOrEmail(e.target.value);
              if (errors.usernameOrEmail) {
                if (e.target.value.trim() && validateUsernameOrEmail(e.target.value)) {
                  setErrors(prev => ({ ...prev, usernameOrEmail: false }));
                }
              }
            }}
          />
          {errors.usernameOrEmail && usernameOrEmail && submitted && (
            <span className={styles.fieldError}>Please enter a valid email address</span>
          )}
        </div>

        {/* Password */}
        <div className={styles.inputWrapper}>
          <InputFields
            name="password"
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            value={password}
            onChange={e => {
              setPassword(e.target.value);
              if (errors.password) {
                if (e.target.value.trim()) {
                  setErrors(prev => ({ ...prev, password: false }));
                }
              }
            }}
          />
          {errors.password && password && submitted && (
            <span className={styles.fieldError}>Please enter your password</span>
          )}
        </div>

        <Button className={styles.logInButton} onClick={handleLogIn} disabled={isLoading}>
          {isLoading ? 'Logging In...' : 'Log In'}
        </Button>
      </div>
    </div>
  );
}