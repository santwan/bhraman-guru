import admin from 'firebase-admin';
import { env } from './env.js';

// The service account key is loaded from the path specified in the environment variables
// This keeps your credentials secure and out of the source code.
const serviceAccount = env.GOOGLE_APPLICATION_CREDENTIALS;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

console.log('Firebase Admin SDK initialized successfully, and connected to the database.');

export const db = admin.firestore();
export const auth = admin.auth();