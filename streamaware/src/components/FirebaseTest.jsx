import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';

const FirebaseTest = () => {
  const [user, setUser] = useState(null);
  const [testData, setTestData] = useState([]);
  const [status, setStatus] = useState('Testing Firebase connection...');

  useEffect(() => {
    // Test Firebase Auth
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setStatus('✅ Firebase Auth: Connected');
        testFirestore();
      } else {
        setStatus('🔄 Signing in anonymously...');
        signInAnonymously(auth)
          .then(() => {
            setStatus('✅ Firebase Auth: Anonymous sign-in successful');
          })
          .catch((error) => {
            setStatus(`❌ Firebase Auth Error: ${error.message}`);
          });
      }
    });

    return () => unsubscribe();
  }, []);

  const testFirestore = async () => {
    try {
      // Test writing to Firestore
      const testCollection = collection(db, 'test');
      await addDoc(testCollection, {
        message: 'Firebase test successful!',
        timestamp: new Date(),
      });

      // Test reading from Firestore
      const snapshot = await getDocs(testCollection);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTestData(data);
      setStatus('✅ Firebase Auth & Firestore: Both working!');
    } catch (error) {
      setStatus(`❌ Firestore Error: ${error.message}`);
    }
  };

  return (
    <div style={{
      padding: '20px',
      border: '2px solid #4CAF50',
      borderRadius: '8px',
      margin: '20px',
      backgroundColor: '#f9f9f9'
    }}>
      <h2>🔥 Firebase Connection Test</h2>
      <p><strong>Status:</strong> {status}</p>
      
      {user && (
        <div>
          <p><strong>User ID:</strong> {user.uid}</p>
          <p><strong>User Type:</strong> {user.isAnonymous ? 'Anonymous' : 'Authenticated'}</p>
        </div>
      )}

      {testData.length > 0 && (
        <div>
          <h3>📄 Firestore Test Data:</h3>
          <ul>
            {testData.map((item) => (
              <li key={item.id}>
                {item.message} - {item.timestamp?.toDate?.()?.toLocaleString() || 'No timestamp'}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
        <p>This test component:</p>
        <ul>
          <li>✓ Tests Firebase Auth (anonymous sign-in)</li>
          <li>✓ Tests Firestore database (read/write)</li>
          <li>✓ Shows connection status</li>
        </ul>
      </div>
    </div>
  );
};

export default FirebaseTest;
