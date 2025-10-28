import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import styles from './Profile.module.css';
import ConfirmPopup from '../components/ConfirmPopup';
import Button from '../components/Button';
import { logoutUser, getCurrentUserData } from '../firebase/firebaseAuth.js';
import { deleteUser as firebaseDeleteUser } from 'firebase/auth';
import { auth, db } from '../firebase/firebase';
import { deleteDoc, doc } from 'firebase/firestore';
import BottomNav from '../components/BottomNav.jsx';

function isGuestUser() {
  return (typeof window !== 'undefined' && window.localStorage && localStorage.getItem('isGuest') === '1');
}

export default function Profile() {
  const navigate = useNavigate();
  const [guest, setGuest] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    setGuest(isGuestUser());
    // If logged in, try to fetch profile info
    const uid = auth?.currentUser?.uid;
    if (uid) {
      getCurrentUserData(uid).then(data => setUserData(data)).catch(() => {});
    }
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      if (typeof window !== 'undefined' && window.localStorage) localStorage.removeItem('isGuest');
      navigate('/');
    } catch (err) {
      alert('Logout failed: ' + err.message);
    }
  };

  const handleDelete = async () => {
    // attempt to delete firestore doc and auth user
    try {
      const user = auth.currentUser;
      if (user) {
        // delete firestore doc
        await deleteDoc(doc(db, 'users', user.uid));
        // delete auth account
        await firebaseDeleteUser(user);
      }
      if (typeof window !== 'undefined' && window.localStorage) localStorage.removeItem('isGuest');
      navigate('/');
    } catch (err) {
      console.error('Delete failed', err);
      alert('Could not delete account: ' + (err.message || err));
    }
  };

  if (guest) {
    return (
      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.guestMessage}>
          <h1>Hi Guest</h1>
          <p>You are browsing as a guest. Some features (like Favorites) are locked.</p>
          </div>
          <div className={styles.stackButtons}>
            <Button onClick={() => navigate('/signup')}>Sign Up</Button>
            <Button onClick={() => navigate('/login')}>Log In</Button>
            <Button onClick={() => alert('Change country not implemented yet')}>Change country</Button>
          </div>
        </div>

        {/* Bottom Navigation Bar */}
        <BottomNav />
      </div>
    );
  }

  return (
    <div className={styles.container}>
        <div className={styles.main}>
        <h1>Hi {userData?.username || auth.currentUser?.displayName}</h1>
        <div className={styles.stackButtons}>
          <Button onClick={handleLogout}>Log out</Button>
          <Button onClick={() => setConfirmDelete(true)}>Delete profile</Button>
          <Button onClick={() => alert('Change country not implemented yet')}>Change country</Button>
        </div>
      </div>

      {confirmDelete && (
        <ConfirmPopup
          isOpen={confirmDelete}
          title="Delete profile?"
          message="This will permanently delete your account and data. Are you sure?"
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(false)}
          confirmText="Delete"
          cancelText="Cancel"
        />
      )}

      {/* Bottom Navigation Bar */}
      <BottomNav />
    </div>
  );
}
