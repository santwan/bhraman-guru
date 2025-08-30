import React, { createContext, useState, useContext } from 'react';

const AuthModalContext = createContext();

export const useAuthModal = () => {
  return useContext(AuthModalContext);
};

export const AuthModalProvider = ({ children }) => {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <AuthModalContext.Provider value={{ authModalOpen, setAuthModalOpen }}>
      {children}
    </AuthModalContext.Provider>
  );
};
