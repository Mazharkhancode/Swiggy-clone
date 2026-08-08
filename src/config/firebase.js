import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const cleanEnvVar = (val) => {
  if (!val) return val;
  return val.trim().replace(/^['"]|['"]$/g, '');
};

const firebaseConfig = {
  apiKey: cleanEnvVar(import.meta.env.VITE_FIREBASE_API_KEY),
  authDomain: cleanEnvVar(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
  projectId: cleanEnvVar(import.meta.env.VITE_FIREBASE_PROJECT_ID),
  storageBucket: cleanEnvVar(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: cleanEnvVar(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
  appId: cleanEnvVar(import.meta.env.VITE_FIREBASE_APP_ID)
};

let auth = null;
let firebaseInitialized = false;

// Safe diagnostic logging for configuration troubleshooting in browser console
console.log('Firebase Configuration Debug:', {
  apiKeyLength: firebaseConfig.apiKey ? firebaseConfig.apiKey.length : 0,
  apiKeyFirstChars: firebaseConfig.apiKey ? firebaseConfig.apiKey.substring(0, 8) : 'none',
  apiKeyLastChars: firebaseConfig.apiKey ? firebaseConfig.apiKey.substring(firebaseConfig.apiKey.length - 4) : 'none',
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  appId: firebaseConfig.appId
});


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

