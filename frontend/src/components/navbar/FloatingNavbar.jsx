import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { navConfig } from "../../utils/navConfig.js";

export default function FloatingNavbar({ scrolled }) {
  return (
    <AnimatePresence>
      {scrolled && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-3 left-1/2 -translate-x-1/2 z-50 
                     bg-[#F2E1C1]/70 dark:bg-[#1A4D8F]/70 backdrop-blur-md
                     px-4 py-2 lg:px-8 lg:py-3 rounded-full shadow-md 
                     flex items-center space-x-5 lg:space-x-10 
                     text-[#1A4D8F] dark:text-white text-sm lg:text-base font-medium
                     max-w-[90vw] sm:max-w-fit"
        >
          {navConfig.map(({ label, to, isLive }) => (
            <Link
              key={label}
              to={to}
              className="flex items-center hover:underline"
            >
              {label}
              {isLive && (
                <span className="ml-2 h-2 w-2 lg:h-3 lg:w-3 rounded-full bg-green-400 animate-pulse" />
              )}
            </Link>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}