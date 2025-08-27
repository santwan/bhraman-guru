import React, { useState } from 'react';
import AuthModal from './AuthModal';

const SignupButton = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowModal(true)} className="text-lg px-8 py-2 rounded-xl font-bold text-white bg-[#1A4D8F] dark:bg-[#F9C74F] shadow-md hover:shadow-xl ring-1 ring-black/10 hover:scale-110 transition-all duration-300 ease-in-out">
        Sign Up
      </button>
      {showModal && <AuthModal isLogin={false} onClose={() => setShowModal(false)} />}
    </>
  );
};

export default SignupButton;
