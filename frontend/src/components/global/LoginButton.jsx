import React, { useState } from 'react';
import AuthModal from './AuthModal';

const LoginButton = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowModal(true)} className="text-lg px-8 py-2 rounded-xl font-bold text-black dark:text-white shadow-md hover:shadow-xl ring-1 ring-[#F9C74F]/50 hover:scale-110 transition-all duration-300 ease-in-out">
        Login
      </button>
      {showModal && <AuthModal isLogin={true} onClose={() => setShowModal(false)} />}
    </>
  );
};

export default LoginButton;
