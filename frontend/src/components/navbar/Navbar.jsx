import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Logo from "@/components/navbar/Logo.jsx";
import NavLinks from "@/components/navbar/NavLinks.jsx";
import AuthSection from "@/components/navbar/AuthSection.jsx";
import MobileMenu from "@/components/navbar/MobileMenu.jsx";
import FloatingNavbar from "@/components/navbar/FloatingNavbar.jsx";
import { navConfig } from "@/utils/navConfig.js";
import { useAnimation } from "../../hooks/useAnimation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navAnimation = useAnimation("fadeInBottom");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 1000);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <AnimatePresence>
        {!scrolled && (
          <motion.nav
            {...navAnimation}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-40 p-2 w-[95%] max-w-7xl mx-auto
                       bg-black/10 backdrop-blur-md 
                       rounded-2xl sm:rounded-full border border-black/25 dark:border-white/10 shadow-[0_0_50px_rgba(200,155,55,0.1)]"
          >
            <div className="flex p-2 sm:p-0 justify-between items-center">
              <Logo />

              <div className="hidden lg:flex items-center space-x-8">
                <NavLinks navConfig={navConfig} />
                <AuthSection />
              </div>

              {/* Mobile toggle (shows below lg) */}
              <div className="lg:hidden z-50">
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
                <MobileMenu 
                  navConfig={navConfig} 
                  setMenuOpen={setMenuOpen} 
                />
              )}
            </AnimatePresence>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Spacer to prevent content from being hidden behind the fixed navbar */}
      {/* <div className="h-28" /> */}

      <FloatingNavbar scrolled={scrolled} navConfig={navConfig} />
    </>
  );
}