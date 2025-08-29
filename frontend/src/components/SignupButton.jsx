import React, { useState } from "react";
import AuthModal from "./AuthModal.jsx";

const SignupButton = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-6 py-2 rounded-lg font-semibold text-white bg-[#1A4D8F] dark:bg-[#F9C74F] ring-1 ring-black/10 hover:scale-105 transition"
      >
        Register
      </button>

      {showModal && (
        <AuthModal isLogin={false} onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

export default SignupButton;
