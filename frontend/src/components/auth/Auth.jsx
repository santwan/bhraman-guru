import React, { useState } from "react";
import { auth } from "@/firebase/firebaseConfig";

const Auth = ({ setAuthModalOpen }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isRegister) {
        await auth.createUserWithEmailAndPassword(email, password);
      } else {
        await auth.signInWithEmailAndPassword(email, password);
      }
      setAuthModalOpen(false);
    } catch (err) {
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
            onClick={() => setIsRegister(!isRegister)} 
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