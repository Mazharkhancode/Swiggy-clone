const fs = require('fs');
const path = require('path');

const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

const localKeyPath = path.join(
  __dirname,
  '../firebaseServiceAccountKey.json'
);

const renderKeyPath = '/etc/secrets/firebaseServiceAccountKey.json';

let firebaseInitialized = false;
let authInstance = null;

try {
  let serviceAccount;

  if (fs.existsSync(renderKeyPath)) {
    console.log('Using Firebase key from Render Secret Files...');

    serviceAccount = JSON.parse(
      fs.readFileSync(renderKeyPath, 'utf8')
    );

  } else if (fs.existsSync(localKeyPath)) {
    console.log('Using local Firebase key...');

    serviceAccount = JSON.parse(
      fs.readFileSync(localKeyPath, 'utf8')
    );

  } else {
    throw new Error('Firebase Service Account Key not found.');
  }

  const app = initializeApp({
    credential: cert(serviceAccount),
  });

  authInstance = getAuth(app);

  console.log('Firebase Admin SDK Initialized Successfully.');

  firebaseInitialized = true;

} catch (error) {
  console.warn('\n============================================================');
  console.warn('WARNING: Firebase Admin SDK not initialized.');
  console.warn(error.message);
  console.warn('============================================================\n');
}

const admin = {
  auth: () => {
    if (!authInstance) {
      throw new Error('Firebase Admin SDK not initialized. Cannot access auth.');
    }
    return authInstance;
  }
};

module.exports = {
  admin,
  firebaseInitialized,
};