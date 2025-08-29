
import { auth , db} from '../config/firebase.js';
import { ApiError } from '../utils/ApiError.js';
import { mapAdminError } from '../utils/FirebaseErrorMapper.js';
import { ROLES } from '../constants/roles.constant.js';

/**
 * Creates a new user in Firebase Authentication.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<object>} The created user record.
 */
const createUserInFirebase = async (email, password) => {
  let userRecord

  try {
      userRecord = await auth.createUser({
      email,
      password,
    });

    const userDoc = {
      email: userRecord.email,
      name: null,
      role: ROLES.USER,
      isVerified: false,
      createdAt: Date.now(),
    }

    await db.collection('users').doc(userRecord.uid).set(userDoc)

    await auth.setCustomUserClaims(userRecord.uid, { role: ROLES.USER })

    return userRecord;
  } catch (error) {
    
    if(userRecord?.uid){
      await Promise.allSettled([
        db.collection('users').doc(userRecord.uid).delete(),
        auth.deleteUser(userRecord.uid),
      ])
    }

    throw mapAdminError(error)
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

