const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const keyPath = path.join(__dirname, '../firebaseServiceAccountKey.json');
let firebaseInitialized = false;

if (fs.existsSync(keyPath)) {
  try {
    const serviceAccount = require(keyPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin SDK Initialized Successfully.');
    firebaseInitialized = true;
  } catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error.message);
  }
} else {
  console.warn('\n============================================================');
  console.warn('WARNING: firebaseServiceAccountKey.json is missing in backend/');
  console.warn('Firebase Phone Auth token verification will not function.');
  console.warn('Please download your Service Account JSON key from Firebase Console');
  console.warn('and save it as: backend/firebaseServiceAccountKey.json');
  console.warn('============================================================\n');
}

module.exports = {
  admin,
  firebaseInitialized
};
