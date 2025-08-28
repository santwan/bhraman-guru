/**
 * @file This script is the entry point for initializing the Firebase Admin SDK.
 * It configures and establishes a persistent, authenticated connection to your
 * Firebase project from a secure backend environment (like a Node.js server).
 * This allows the server to perform privileged operations such as bypassing
 * security rules, minting custom authentication tokens, and interacting with
 * other Firebase services with administrative rights.
 */

// Import the 'firebase-admin' package. This is the official server-side SDK
// provided by Google. Unlike the client-side SDK (used in browsers or mobile apps),
// this SDK is designed to run in trusted environments and operate with full
// administrative privileges over your project's resources.
import admin from 'firebase-admin';

// Import the centralized 'env' configuration object. This object securely loads
// and validates environment variables for the application. This practice is crucial
// for security and flexibility, as it prevents hardcoding sensitive information
// like API keys or credential paths directly into the source code.
import { env } from './env.js';

/**
 * Retrieve the service account credentials.
 * The value of `env.GOOGLE_APPLICATION_CREDENTIALS` is typically the JSON object
 * of your service account key. A service account is a special type of non-human
 * Google account that represents your server application. It has its own unique
 * credentials and permissions, allowing it to authenticate and access Google Cloud
 * and Firebase APIs on your behalf. Loading it from environment variables is the
 * recommended approach for security and portability across different deployment
 * environments (development, staging, production).
 */
const serviceAccount = env.GOOGLE_APPLICATION_CREDENTIALS;

/**
 * Initialize the Firebase application instance.
 * This is the core, one-time setup step that authenticates your server with Firebase.
 * Once this function completes successfully, the 'admin' object becomes the gateway
 * to all other Firebase services.
 */
admin.initializeApp({
  /**
   * Provide the authentication credentials for the application.
   * The `admin.credential.cert()` method takes the raw service account JSON object
   * and parses it into a formal credential object that the SDK can use to securely
   * authenticate with your Firebase project via OAuth 2.0. This proves to Firebase
   * that your application has the authority to perform administrative actions.
   */
  credential: admin.credential.cert(serviceAccount)
});

// This log statement serves as a crucial diagnostic message during application startup.
// It provides explicit confirmation in the server logs that the connection to Firebase
// was successfully established. If there were an issue with the credentials or network,
// the application would likely fail before this point, making its absence a key
// indicator for debugging.
console.log('Firebase Admin SDK initialized successfully.');

/** 
 * Export pre-initialized and authenticated instances of Firebase services.
 * By calling these methods after `initializeApp`, we get service objects that are
 * ready to be used immediately elsewhere in the application. Exporting them from this
 * central file ensures that we follow the !Singleton pattern: the SDK is initialized
 * only once, and the same instances of Firestore and Auth are shared across the entire app.
 */

// Get the instance of the Cloud Firestore service. This object (`db`) will be used
// to perform all database operations (e.g., reading, writing, updating documents)
// with full administrative privileges, bypassing all security rules.
export const db = admin.firestore();

// Get the instance of the Firebase Authentication service. This object (`auth`) will
// be used for user management tasks like creating users, verifying ID tokens from clients,
// generating custom sign-in tokens, or disabling user accounts.
export const auth = admin.auth();