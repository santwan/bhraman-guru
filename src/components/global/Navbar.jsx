import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { SignInButton, useUser } from "@clerk/clerk-react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isSignedIn } = useUser();

  const navConfig = [
    { label: "Plan Trip", to: "/plan-trip", isLive: false },
    { label: "Blog", to: "/blog", isLive: false },
    { label: "Reviews", to: "/reviews", isLive: false },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? "h-0 bg-transparent" : "h-auto bg-white"}`}>
        <div className="max-w-[1500px] mx-auto px-4 sm:py-8 flex justify-between items-center">

          {/* Logo */}
          <div className={`transition-opacity duration-500 ${scrolled ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
            <Link to="/">
              <img
                src="/BhramanGuru.svg"
                alt="BhramanGuru Logo"
                className="w-full h-15"
              />
            </Link>
          </div>

          {/* Center Nav */}
          <div className={`hidden sm:flex pr-40 space-x-8 pt-4 text-black text-base font-semibold transition-opacity duration-500 ${scrolled ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
            {navConfig.map(({ label, to, isLive }) => (
              <Link
                key={label}
                to={to}
                className="lg:text-lg relative flex items-center px-4 py-2 rounded-full transition-all duration-200 transform hover:scale-110 hover:shadow-[0_0_15px_4px_rgba(249,199,79,0.5)]"
              >
                {label}
                {isLive && (
                  <span className="ml-2 h-2 w-2 rounded-full bg-green-400 animate-pulse shadow-md" />
                )}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className={`hidden sm:flex items-center space-x-3 transition-opacity duration-500 ${scrolled ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
            {isSignedIn ? (
              <Link
                to="/generate"
                className="text-lg px-8 py-2 rounded-xl font-bold text-black shadow-md hover:shadow-xl ring-1 ring-[#F9C74F]/50 hover:scale-110 transition-all duration-300 ease-in-out"
              >
                Generate Trip
              </Link>
            ) : (
              <SignInButton>
                <button className="text-lg px-8 py-2 rounded-xl font-bold text-black shadow-md hover:shadow-xl ring-1 ring-[#F9C74F]/50 hover:scale-110 transition-all duration-300 ease-in-out">
                  Login
                </button>
              </SignInButton>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className={`sm:hidden z-50 transition-opacity duration-500 ${scrolled ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="text-[#1A4D8F]" /> : <Menu className="text-[#1A4D8F]" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="sm:hidden bg-white px-4 pb-4 text-[#1A4D8F] dark:text-[#F2E1C1] flex flex-col space-y-4"
            >
              {isSignedIn ? (
                <Link to="/generate" onClick={() => setMenuOpen(false)}>Generate Trip</Link>
              ) : (
                <SignInButton>
                  <button onClick={() => setMenuOpen(false)}>Login</button>
                </SignInButton>
              )}

              {navConfig.map(({ label, to, isLive }) => (
                <Link key={label} to={to} onClick={() => setMenuOpen(false)} className="flex items-center">
                  {label}
                  {isLive && (
                    <span className="ml-2 h-2 w-2 rounded-full bg-green-400 animate-pulse shadow-md" />
                  )}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Floating Nav */}
      <AnimatePresence>
        {scrolled && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed top-3 left-1/2 transform -translate-x-1/2 z-50 bg-[#F2E1C1]/70 dark:bg-[#1A4D8F]/70 backdrop-blur-md px-4 py-2 rounded-full shadow-lg flex flex-row items-center justify-center space-x-6 text-[#eaffe0] text-sm font-medium whitespace-nowrap overflow-x-auto w-auto max-w-[90vw] sm:max-w-fit"
          >
            {navConfig.map(({ label, to, isLive }) => (
              <Link key={label} to={to} onClick={() => setMenuOpen(false)} className="flex items-center">
                {label}
                {isLive && (
                  <span className="ml-2 h-2 w-2 rounded-full bg-green-400 animate-pulse shadow-md" />
                )}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
