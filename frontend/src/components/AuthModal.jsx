import React, { useState } from 'react';
import { useAuth } from '@/context/auth';

const AuthModal = ({ isLogin, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      onClose();
    } catch (error) {
      console.error(error);
      // You can add a state to display the error message in the modal
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white">{isLogin ? 'Login' : 'Sign Up'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
             <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="flex items-center justify-between">
            <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline-blue transition-colors duration-300">
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
            <button type="button" onClick={onClose} className="ml-4 text-sm text-gray-600 dark:text-gray-400 hover:underline">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
