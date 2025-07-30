// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInWithCustomToken, signInAnonymously } from 'firebase/auth';

// Firebase configuration from .env (VITE_ prefix is required for Vite)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_PUBLIC_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore and Auth exports
export const db = getFirestore(app);
export const auth = getAuth(app);

/**
 * Initializes Firebase Auth:
 * - Signs in with a custom token if available
 * - Otherwise, signs in anonymously
 */
export const initializeAuth = async () => {
  try {
    const token = (window as any).__initial_auth_token;

    if (token) {
      await signInWithCustomToken(auth, token);
      console.log('✅ Firebase: Signed in with custom token');
    } else {
      await signInAnonymously(auth);
      console.log('✅ Firebase: Signed in anonymously');
    }
  } catch (error) {
    console.error('❌ Firebase Auth Error:', error);
  }
};

export default app;
