
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { authService } from '../services/auth.service.js';

const register = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  const userRecord = await authService.createUserInFirebase(email, password);

  return res.status(201).json(
    new ApiResponse(201, { uid: userRecord.uid, email: userRecord.email }, 'User created successfully')
  );
});

const login = asyncHandler(async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    throw new ApiError(400, 'ID token is required from the client');
  }

  const decodedToken = await authService.verifyFirebaseIdToken(idToken);
  const uid = decodedToken.uid;

  // Here you could generate a session cookie or a custom JWT for your app if needed,
  // but for a simple SPA with a Firebase client, verifying the ID token might be enough.

  return res.status(200).json(
    new ApiResponse(200, { uid }, 'User logged in successfully')
  );
});

export { register, login };
