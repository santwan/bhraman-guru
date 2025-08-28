// Import utility functions and services needed for the controller.
import { asyncHandler } from '../utils/asyncHandler.js'; // A wrapper for async route handlers to catch errors.
import { ApiResponse } from '../utils/ApiResponse.js'; // A standardized class for successful API responses.
import { ApiError } from '../utils/ApiError.js'; // A standardized class for API errors.
import { authService } from '../services/auth.service.js'; // The service layer that interacts with Firebase Auth.

/**
 * Handles user registration.
 * It takes email and password, creates a new user in Firebase, and returns the user's info.
 */
const register = asyncHandler(async (req, res) => {
  // Destructure email and password from the request body.
  const { email, password } = req.body;

  // Validate that both email and password were provided.
  if (!email || !password) {
    // If not, throw a 400 Bad Request error.
    throw new ApiError(400, 'Email and password are required');
  }

  // Call the authentication service to create the user in Firebase.
  const userRecord = await authService.createUserInFirebase(email, password);

  // Send a 201 Created response back to the client.
  return res.status(201).json(
    // Use the ApiResponse class for a consistent response format.
    new ApiResponse(201, { uid: userRecord.uid, email: userRecord.email,  }, 'User created successfully')
  );
});

/**
 * Handles user login.
 * It takes a Firebase ID token from the client, verifies it, and confirms the user's identity.
 */
const login = asyncHandler(async (req, res) => {
  // Get the Firebase ID token from the request body.
  const { idToken } = req.body;

  // Validate that the ID token was provided.
  if (!idToken) {
    // If not, throw a 400 Bad Request error.
    throw new ApiError(400, 'ID token is required from the client');
  }

  // Verify the ID token using the authentication service. This confirms the token is valid and not expired.
  const decodedToken = await authService.verifyFirebaseIdToken(idToken);
  // Extract the user's unique ID (uid) from the decoded token.
  const uid = decodedToken.uid;

  // Note: For stateful applications, you might generate a session cookie or a custom JWT here.
  // However, for a simple Single Page Application (SPA) using the Firebase client SDK,
  // simply verifying the ID token on the backend for protected routes is often sufficient.

  // Send a 200 OK response to confirm successful login.
  return res.status(200).json(
    new ApiResponse(200, { uid }, 'User logged in successfully')
  );
});

// Export the register and login functions to be used in the route definitions.
export { register, login };