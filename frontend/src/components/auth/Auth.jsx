import React, { useState } from "react";
// Import auth instance and helper functions to create/sign-in users
import { auth } from "@/firebase/firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

/**
 * 
 * @param {setAuthModalOpen} - function from parent to close the modal after successful auth
 * @returns 
 */
const Auth = ({ setAuthModalOpen }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isRegister && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      setAuthModalOpen(false);
    } catch (err) {
      // You could further map these error messages to be more user-friendly
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center h-screen bg-black/60 backdrop-blur-md">
      <div className="bg-white dark:bg-[#0d0d0d] p-8 rounded-2xl shadow-lg w-full max-w-md relative">
        <button 
          onClick={() => setAuthModalOpen(false)} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-white"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-center mb-6 text-[#1A4D8F] dark:text-white">
          {isRegister ? "Create Account" : "Login"}
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 bg-gray-100 dark:bg-gray-800 rounded-lg focus:outline-none"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-4 bg-gray-100 dark:bg-gray-800 rounded-lg focus:outline-none"
            required
          />
          {isRegister && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 mb-4 bg-gray-100 dark:bg-gray-800 rounded-lg focus:outline-none"
              required
            />
          )}
          <button 
            type="submit" 
            className="w-full p-3 bg-[#1A4D8F] text-white rounded-lg font-bold hover:bg-opacity-90"
          >
            {isRegister ? "Register" : "Login"}
          </button>
          {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
        </form>
        <p className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
          {isRegister ? "Already have an account?" : "Don't have an account?"}
          <button 
            onClick={() => {
              setIsRegister(!isRegister);
              setError(""); // Clear error when toggling
            }} 
            className="text-[#1A4D8F] dark:text-white font-bold ml-1 focus:outline-none"
          >
            {isRegister ? "Login" : "Create one"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;