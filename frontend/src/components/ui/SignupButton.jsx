import { useAuthModal } from "@/context/authModal";

const SignupButton = () => {
  const { setAuthModalOpen } = useAuthModal();

  return (
    <button
      onClick={() => setAuthModalOpen(true)}
      className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
    >
      Sign Up
    </button>
  );
};

export default SignupButton;
