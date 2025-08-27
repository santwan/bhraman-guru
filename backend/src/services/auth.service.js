
import { auth } from '../config/firebase.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * Creates a new user in Firebase Authentication.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<object>} The created user record.
 */
const createUserInFirebase = async (email, password) => {
  try {
    const userRecord = await auth.createUser({
      email,
      password,
    });
    return userRecord;
  } catch (error) {
    // https://firebase.google.com/docs/auth/admin/errors
    if (error.code === 'auth/email-already-exists') {
      throw new ApiError(409, 'The email address is already in use by another account.');
    }
    throw new ApiError(500, 'Error creating user in Firebase', [], error.stack);
  }
};

/**
 * Verifies a Firebase ID token.
 * @param {string} idToken - The Firebase ID token from the client.
 * @returns {Promise<object>} The decoded token.
 */
const verifyFirebaseIdToken = async (idToken) => {
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
     if (error.code == 'auth/id-token-expired') {
        throw new ApiError(401, 'Firebase ID token has expired. Please reauthenticate.');
     }
    throw new ApiError(401, 'Invalid Firebase ID token.', [], error.stack);
  }
};


export const authService = {
  createUserInFirebase,
  verifyFirebaseIdToken,
};

