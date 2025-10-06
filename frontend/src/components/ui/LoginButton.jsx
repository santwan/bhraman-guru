import { useAuthModal } from "@/context/authModal";

const LoginButton = () => {
  const { setAuthModalOpen } = useAuthModal();

  return (
    <button
      onClick={() => setAuthModalOpen(true)}
      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
    >
      Login
    </button>
  );
};

export default LoginButton;