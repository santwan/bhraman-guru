import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '@/firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // The logout function now uses the signOut method from the compat auth object
  const logout = () => {
    return auth.signOut();
  };

  // This effect hook listens for changes in the user's authentication state.
  // onAuthStateChanged is the core of Firebase Authentication's session management.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Unsubscribe from the listener when the component unmounts
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {/* We only render the children once the initial auth state has been determined */}
      {!loading && children}
    </AuthContext.Provider>
  );
};
