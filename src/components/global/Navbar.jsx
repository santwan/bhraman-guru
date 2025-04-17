import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navConfig = [
    { label: "Destinations", href: "#", isLive: false },
    { label: "Plan Trip", href: "#", isLive: false },
    { label: "Blog", href: "#", isLive: false },
    { label: "Reviews", href: "#", isLive: false },
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
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "h-0 bg-transparent"
            : "h-auto bg-[#1A4D8F] border-b border-[#F2E1C1]/10"
        }`}
      >
        <div className="max-w-[1500px] mx-auto px-4 sm:py-8 flex justify-between items-center">
          {/* Logo */}
          <div
            className={`transition-opacity duration-500 ${
              scrolled ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            <img
              src=""
              alt="Logo"
              className="text-shadow-indigo-200 h-0 md:h-0"
            />
          </div>

          {/* Center Nav */}
          <div
            className={`hidden sm:flex space-x-4 text-[#F2E1C1] text-base font-semibold transition-opacity duration-500 ${
              scrolled ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            {navConfig.map(({ label, href, isLive }) => (
              <a
                key={label}
                href={href}
                className="lg:text-lg relative flex items-center px-4 py-2 rounded-full transition-all duration-200 transform hover:scale-110 hover:shadow-[0_0_15px_4px_rgba(249,199,79,0.5)]"
              >
                {label}
                {isLive && (
                  <span className="ml-2 h-2 w-2 rounded-full bg-green-400 animate-pulse shadow-md"></span>
                )}
              </a>
            ))}
          </div>

          {/* Right Section */}
          <div
            className={`hidden sm:flex items-center space-x-3 transition-opacity duration-500 ${
              scrolled ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            <button className="text-lg px-8 py-2 rounded-full font-bold text-[#1A4D8F] bg-gradient-to-r from-[#4BA3B4] via-[#F6A6A1] to-[#F9C74F] hover:from-[#F6A6A1] hover:to-[#F9C74F] shadow-md hover:shadow-xl ring-1 ring-[#F9C74F]/50 hover:scale-110 transition-all duration-300 ease-in-out">
              Login
            </button>
          </div>

          {/* Mobile Hamburger */}
          <div
            className={`sm:hidden z-50 transition-opacity duration-500 ${
              scrolled ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? (
                <X className="text-[#1A4D8F]" />
              ) : (
                <Menu className="text-[#1A4D8F]" />
              )}
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
              <a href="#" onClick={() => setMenuOpen(false)}>
                Login
              </a>
              {navConfig.map(({ label, href, isLive }) => (
                <a
                  key={label}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center"
                >
                  {label}
                  {isLive && (
                    <span className="ml-2 h-2 w-2 rounded-full bg-green-400 animate-pulse shadow-md"></span>
                  )}
                </a>
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
            className="fixed top-3 left-1/2 transform -translate-x-1/2 z-50 bg-[#F2E1C1]/70 dark:bg-[#1A4D8F]/70 backdrop-blur-md px-4 py-2 rounded-full shadow-lg 
              flex flex-row items-center justify-center space-x-6 text-[#1A4D8F] dark:text-[#F2E1C1] text-sm font-medium 
              whitespace-nowrap overflow-x-auto w-auto max-w-[90vw] sm:max-w-fit"
          >
            {navConfig.map(({ label, href, isLive }) => (
              <a
                key={label}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center"
              >
                {label}
                {isLive && (
                  <span className="ml-2 h-2 w-2 rounded-full bg-green-400 animate-pulse shadow-md"></span>
                )}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
