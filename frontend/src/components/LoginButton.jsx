import React, { useState } from "react";
import AuthModal from "./AuthModal.jsx";

const LoginButton = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-6 py-2 rounded-lg font-semibold text-black dark:text-white ring-1 ring-[#F9C74F]/50 hover:scale-105 transition"
      >
        Login
      </button>

      {showModal && (
        <AuthModal isLogin={true} onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

export default LoginButton;
