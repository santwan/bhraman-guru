// HowItWorksSection.jsx
import { useEffect, useRef, useState } from "react";

const STEPS = [
  {
    id: 0,
    title: "Choose Your Destination",
    desc: "Pick anywhere in the world — from iconic cities to secret hideaways. Start with a destination, dates and travel style.",
    // Replace with your real image or animated card component
    content: "🏙️",
  },
  {
    id: 1,
    title: "Explore Experiences",
    desc: "Discover culture, food, and activities tailored to your vibe — curated by local insights and AI recommendations.",
    content: "🏯",
  },
  {
    id: 2,
    title: "See It on the Map",
    desc: "Visualize routes, neighbourhoods and nearby attractions so you can plan travel flow and logistics confidently.",
    content: "🗺️",
  },
  {
    id: 3,
    title: "AI-Powered Itinerary",
    desc: "Get a smart, personalized day-by-day plan generated in seconds — optimized for time, budget and preferences.",
    content: "🤖",
  },
  {
    id: 4,
    title: "Enjoy the Journey",
    desc: "Start your trip worry-free with everything organized — recommendations, bookings and travel tips at your fingertips.",
    content: "✈️",
  },
];

export default function Promotion() {
  const [active, setActive] = useState(0);
  const autoplayRef = useRef(null);

  // Auto-play: cycle every 3.5s
  useEffect(() => {
    startAutoplay();
    return stopAutoplay;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startAutoplay() {
    stopAutoplay();
    autoplayRef.current = setInterval(() => {
      setActive((s) => (s + 1) % STEPS.length);
    }, 3500);
  }

  function stopAutoplay() {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* LEFT: Dynamic writing + controls */}
        <div
          className="space-y-6"
          // pause autoplay while user interacts with the left area
          onMouseEnter={stopAutoplay}
          onMouseLeave={startAutoplay}
        >
          <h2 className="text-3xl md:text-4xl font-bold">How BhramanGuru Works</h2>
          <p className="text-slate-600 max-w-xl">
            We combine smart AI with real-world travel insights to make planning effortless and fun. Hover or click a step to see details.
          </p>

          <div className="space-y-4">
            {STEPS.map((step, idx) => {
              const isActive = idx === active;
              return (
                <button
                  key={step.id}
                  onClick={() => setActive(idx)}
                  className={`w-full text-left p-4 rounded-lg transition-shadow flex items-start gap-4
                    ${isActive ? "bg-white/80 shadow-lg ring-2 ring-amber-300" : "bg-white/50 hover:shadow-md"}
                    dark:bg-slate-800 dark:!bg-opacity-80`}
                  aria-pressed={isActive}
                >
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-xl font-semibold
                      ${isActive ? "bg-amber-400 text-blue-900" : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200"}`}
                  >
                    {step.content}
                  </div>

                  <div>
                    <h3 className={`font-semibold ${isActive ? "text-slate-900" : "text-slate-700 dark:text-slate-200"}`}>
                      {step.title}
                    </h3>
                    <p className={`mt-1 text-sm ${isActive ? "text-slate-600" : "text-slate-500 dark:text-slate-400"}`}>
                      {step.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* small controls */}
          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={() => setActive((a) => (a - 1 + STEPS.length) % STEPS.length)}
              className="px-3 py-2 rounded-md bg-slate-100 hover:bg-slate-200"
              aria-label="Previous step"
            >
              ←
            </button>
            <button
              onClick={() => setActive((a) => (a + 1) % STEPS.length)}
              className="px-3 py-2 rounded-md bg-slate-100 hover:bg-slate-200"
              aria-label="Next step"
            >
              →
            </button>
            <button
              onClick={() => (autoplayRef.current ? stopAutoplay() : startAutoplay())}
              className="ml-auto px-3 py-2 rounded-md border"
            >
              {autoplayRef.current ? "Pause" : "Play"}
            </button>
          </div>
        </div>

        {/* RIGHT: Animated stacked cards */}
        <div
          className="relative h-80 md:h-96 flex items-center justify-center"
          onMouseEnter={stopAutoplay}
          onMouseLeave={startAutoplay}
        >
          {/* Background soft glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-72 h-72 rounded-full blur-3xl bg-amber-200/30 animate-pulse"></div>
          </div>

          {/* Card stack */}
          <div className="relative w-72 h-56 md:w-96 md:h-64">
            {STEPS.map((step, i) => {
              const offset = i - active; // negative left, zero center, positive right
              // Determine transform classes based on offset
              let transformClass = "";
              let zIndex = 10 - Math.abs(offset);
              let opacity = 1 - Math.min(Math.abs(offset) * 0.18, 0.7);

              if (offset === 0) {
                transformClass = "translate-x-0 rotate-0 scale-100";
              } else if (offset === -1) {
                transformClass = "-translate-x-8 -rotate-6 scale-95";
              } else if (offset === 1) {
                transformClass = "translate-x-8 rotate-6 scale-95";
              } else if (offset <= -2) {
                transformClass = "-translate-x-20 -rotate-10 scale-90";
              } else if (offset >= 2) {
                transformClass = "translate-x-20 rotate-10 scale-90";
              }

              // for smooth circular index wrap appearance, you may want to adjust using modulo logic
              return (
                <div
                  key={step.id}
                  className={`absolute left-0 top-0 w-full h-full transition-all duration-500 ease-out rounded-xl overflow-hidden shadow-xl`}
                  style={{
                    transform: `${transformClass}`,
                    zIndex,
                    opacity,
                    // progressive blur for far cards (optional)
                    filter: Math.abs(offset) > 1 ? "blur(1px)" : "none",
                    // subtle 3D effect
                    boxShadow: offset === 0 ? "0 20px 40px rgba(15,23,42,0.12)" : "0 8px 20px rgba(15,23,42,0.06)",
                  }}
                  onClick={() => setActive(i)}
                >
                  {/* Card visual (replace this div with your animated image or SVG) */}
                  <div className="w-full h-full bg-white dark:bg-slate-800 rounded-xl flex flex-col">
                    <div className="flex-1 flex items-center justify-center text-6xl md:text-7xl">
                      {/* emoji placeholder - replace by <img src={...} alt="" className="object-cover w-full h-full" /> */}
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-40 h-40 md:w-48 md:h-48 rounded-lg flex items-center justify-center text-6xl">
                          {step.content}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-900/60">
                      <h4 className="font-semibold">{step.title}</h4>
                      <p className="text-sm mt-1 text-slate-500 dark:text-slate-400 line-clamp-2">{step.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}