import { ApiError } from "./ApiError.js";

export const mapAdminError = (e, defaultMessage = 'Error with Firebase Auth') => {
  switch (e.code) {
    case 'auth/email-already-exists':
      return new ApiError(409, 'The email address is already in use by another account.', [], e.stack);
    case 'auth/invalid-password':
      return new ApiError(400, 'Invalid password (must be at least 6 characters).', [], e.stack);
    case 'auth/invalid-email':
      return new ApiError(400, 'Invalid email address.', [], e.stack);
    case 'auth/operation-not-allowed':
      return new ApiError(503, 'Email/password sign-in is disabled in Firebase settings.', [], e.stack);
    case 'auth/uid-already-exists':
      return new ApiError(409, 'A user with this UID already exists.', [], e.stack);
    case 'auth/configuration-not-found':
        return new ApiError(400, 'There is no configuration corresponding to the provided identifier.', [e.code], e.stack)
    default:
      return new ApiError(500, defaultMessage, [{ code: e.code, message: e.message }], e.stack);
  }
};