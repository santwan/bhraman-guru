import { ApiError } from "./ApiError.js";

export const mapAdminError = (e) => {
  switch (e.code) {
    case 'auth/email-already-exists':
      return new ApiError(409, e.message, [{code: e.code}], e.stack);
    case 'auth/invalid-password':
      return new ApiError(400, e.message, [{code: e.code}], e.stack);
    case 'auth/invalid-email':
      return new ApiError(400, e.message, [{code: e.code}], e.stack);
    case 'auth/operation-not-allowed':
      return new ApiError(503, e.message, [{code: e.code}], e.stack);
    case 'auth/uid-already-exists':
      return new ApiError(409, e.message, [{code: e.code}], e.stack);
    case 'auth/configuration-not-found':
        return new ApiError(400, e.message, [{code: e.code}], e.stack)
    default:
      return new ApiError(500, e.message, [{ code: e.code }], e.stack);
  }
};