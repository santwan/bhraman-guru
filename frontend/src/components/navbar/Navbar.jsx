import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Logo from "./Logo.jsx";
import NavLinks from "./NavLinks.jsx";
import AuthSection from "./AuthSection.jsx";
import MobileMenu from "./MobileMenu.jsx";
import FloatingNavbar from "./FloatingNavbar.jsx";
import { navConfig } from "../../utils/navConfig.js";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`transition-all duration-300 ${
          scrolled
            ? "h-5 bg-transparent"
            : "h-auto bg-white dark:bg-[#0d0d0d] border-b border-gray-200 dark:border-gray-800"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 flex justify-between items-center">
          <Logo hidden={scrolled} />
          <NavLinks navConfig={navConfig} hidden={scrolled} />
          <AuthSection hidden={scrolled} />

          {/* Mobile toggle (shows below lg) */}
          <div
            className={`lg:hidden z-50 transition-opacity duration-300 ${
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

        <AnimatePresence>
          {menuOpen && (
            <MobileMenu navConfig={navConfig} setMenuOpen={setMenuOpen} />
          )}
        </AnimatePresence>
      </nav>

      <FloatingNavbar scrolled={scrolled} navConfig={navConfig} />
    </>
  );
}
