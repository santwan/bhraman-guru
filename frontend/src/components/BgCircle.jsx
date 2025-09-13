// src/components/BackgroundCircle.jsx
export default function BgCircle({
  size = "w-72 h-72",
  position = "top-10 left-10",
  hiddenOn, // "sm" | "md" | "lg"
  from = "from-pink-400",
  via,
  to = "to-indigo-500",
  mode, // "dark" | "light" | undefined
}) {
  // Build gradient
  const gradient = via
    ? `bg-gradient-to-r ${from} ${via} ${to}`
    : `bg-gradient-to-r ${from} ${to}`;

  // If no mode provided, keep original mobile-first hidden logic
  let baseHiddenClass = "";
  if (!mode) {
    if (hiddenOn === "sm") baseHiddenClass = "hidden sm:block";
    if (hiddenOn === "md") baseHiddenClass = "md:hidden";
    if (hiddenOn === "lg") baseHiddenClass = "lg:hidden";
  }

  // Mode-aware class generation (ensures visibility only when BOTH mode & breakpoint conditions are satisfied)
  let modeClass = "";
  if (mode === "dark") {
    // visible only in dark mode, and if hiddenOn set, only at that breakpoint (e.g., sm:dark:block)
    if (!hiddenOn) {
      modeClass = "hidden dark:block"; // hidden by default, show in dark (all sizes)
    } else {
      // example: hiddenOn === "sm" -> "hidden sm:dark:block"
      modeClass = `hidden ${hiddenOn}:dark:block`;
    }
  } else if (mode === "light") {
    // visible only in light mode, and if hiddenOn set, only at that breakpoint
    if (!hiddenOn) {
      modeClass = "block dark:hidden"; // show by default, hide in dark (all sizes)
    } else {
      // example: hiddenOn === "sm" -> "hidden sm:block dark:hidden"
      // hidden by default, show at breakpoint, always hide in dark
      modeClass = `hidden ${hiddenOn}:block dark:hidden`;
    }
  }

  return (
    <div
      className={`
        absolute rounded-full -z-10
        opacity-30 blur-2xl
        ${size} ${position} ${gradient}
        ${baseHiddenClass} ${modeClass}
        animate-pulse pointer-events-none
      `}
    />
  );
}
