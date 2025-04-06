const admin = require('firebase-admin');
const path = require('path');


const SERVICE_ACCOUNT_KEY_PATH = path.join(__dirname, '../../serviceAccountKey.json');

// Initialize Firebase if no app exists
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(require(SERVICE_ACCOUNT_KEY_PATH))
    });
    console.log('Firebase initialized successfully');
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    throw new Error('Failed to initialize Firebase. Make sure serviceAccountKey.json exists.');
  }
}

const db = admin.firestore();

module.exports = { admin, db };