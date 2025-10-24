import { useState } from 'react';
import { useNavigate } from 'react-router';
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

  const handleLogIn = () => {
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

    // If there are errors, stop here
    if (Object.values(newErrors).some(error => error)) {
      return;
    }

    // All validations passed - navigate to homepage
    // TODO: Add Firebase authentication here
    navigate('/homepage');
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
            type="text"
            placeholder="Username or Email"
            autoComplete="username"
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
            <span className={styles.fieldError}>Please enter a valid username or email</span>
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

        <Button className={styles.logInButton} onClick={handleLogIn}>Log In</Button>
      </div>
    </div>
  );
}