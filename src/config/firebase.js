import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let auth = null;
let firebaseInitialized = false;

try {
  // Prevent initialization if apiKey is missing, empty, or a placeholder
  if (
    !firebaseConfig.apiKey || 
    firebaseConfig.apiKey === 'your_api_key' || 
    firebaseConfig.apiKey.includes('your_')
  ) {
    throw new Error('Firebase API key is missing or is using placeholder values in environment variables.');
  }
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  firebaseInitialized = true;
  console.log('Firebase Client SDK Initialized Successfully.');
} catch (error) {
  console.warn('\n============================================================');
  console.warn('WARNING: Firebase Client SDK not initialized.');
  console.warn(error.message);
  console.warn('============================================================\n');
}

export { auth, firebaseInitialized };

