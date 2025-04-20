import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(
    () => localStorage.theme === "dark" || (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="text-yellow-500 dark:text-yellow-400 p-2 rounded-full bg-white/10 hover:bg-white/20 dark:hover:bg-yellow-400/40 transition"
    >
      {isDark ? <Moon size={30} /> : <Sun size={30} /> }
    </button>
  );
};

export default ThemeToggle;
