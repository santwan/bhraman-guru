import { Link } from "react-router-dom";

export default function NavLinks({ navConfig, hidden }) {
  return (
    <div
      className={`hidden lg:flex space-x-6 text-black dark:text-white font-medium transition-opacity duration-300 ${
        hidden ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {navConfig.map(({ label, to, isLive }) => (
        <Link
          key={label}
          to={to}
          className="flex items-center px-3 py-1.5 rounded-full hover:scale-105 hover:shadow-md transition text-sm lg:text-base"
        >
          {label}
          {isLive && (
            <span className="ml-2 h-3 w-3 rounded-full bg-green-400 animate-pulse" />
          )}
        </Link>
      ))}
    </div>
  );
}
