import React from "react";
import { motion } from "framer-motion";
import { Compass } from "lucide-react";
import { Link } from "react-router-dom";
import { useAnimation } from "@/hooks/useAnimation.js";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import BgCircle from "./BgCircle";

const HeroSection = () => {
  const headerAnimation = useAnimation("ZoomIn", 0.5, 3);
  const titleAnimation = useAnimation("ZoomIn", 0.6, 1);
  const subtextAnimation = useAnimation("ZoomIn", 0.7, 1.5);
  const buttonAnimation = useAnimation("zoomIn", 0.9, 2.3);

  return (
    <div className="relative z-10 min-h-screen flex flex-col items-center justify-center overflow-hidden ">


      {/* <div className="absolute  top-0  z-0 pointer-events-none">
        <DotLottieReact 
          src="/clouds loop.lottie"
          loop
          autoplay
          className="md:w-lg"
        />
      </div> */}
      <div className="relative z-5 text-center  space-y-5">

          <BgCircle
            position="left-3"
            size="w-60 h-60"
            from="from-red-500/40"
            to="to-red-500/50"
            hiddenOn="sm"
          
          />

          <BgCircle
            position="top-30 right-16"
            size="w-60 h-60"
            from="from-indigo-500/40"
            via="via-emerald-500/40"
            to="to-green-500/50"
            hiddenOn="sm"
            
          />
        {/* Big Slogan Header */}

        <motion.h1
          {...headerAnimation}
        >
          <span className="tracking-wide text-4xl font-semibold sm:text-5xl md:text-6xl font-serif">
              <span className="text-blue-500">B</span>
                <span className="text-blue-500">h</span>
                <span className="text-cyan-500">r</span>
                <span className="text-cyan-500">a</span>
                <span className="text-cyan-500">m</span>
                <span className="text-teal-500">a</span>
                <span className="text-teal-500">n</span>
                <span className="text-red-500">G</span>
                <span className="text-red-500">u</span>
                <span className="text-orange-500">r</span>
                <span className="text-orange-500">u</span>
                <span className="text-orange-500"></span>
          </span>
        </motion.h1>

        <motion.h1
          {...titleAnimation}
          className="text-4xl sm:text-5xl md:text-5xl font-semibold tracking-wide"
        >
          <div className="md:px-25 leading-snug">
            <p>
              Your Expert AI Travel Planner
              <br /> <span>and Journey Curator</span>
            </p>
          </div>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          {...subtextAnimation}
          className="max-w-2xl mx-auto text-lg sm:text-xl  text-gray-600 dark:text-gray-300"
        >
          Stop searching, start experiencing. Unlock smart, personalized
          itineraries and discover secret local spots for truly unforgettable and
          hassle-free adventures.
        </motion.p>

        {/* Plan Trip Button */}
        <motion.div {...buttonAnimation} className="">
          <Link
            to={"/create-trip"}
            className="inline-flex items-center gap-1 px-6 md:px-12 py-3 md:py-4 text-base md:text-lg font-bold rounded-xl select-none
            bg-[#F9C74F] text-[#1A4D8F] hover:bg-[#F6A6A1] hover:text-black
            dark:bg-[#4BA3B4] dark:text-white dark:hover:bg-[#F9C74F] dark:hover:text-black
            shadow-lg hover:shadow-xl active:scale-95 transform-gpu transition duration-300 ease-out
            focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-[#F9C74F]/25
            motion-reduce:transition-none"
          >
            Plan Trip
            <Compass />
          </Link>
        </motion.div>
      </div>

      {/* <div className="flex items-center justify-center">
        <DotLottieReact
            src="/Travel App - Onboarding Animation.lottie"
            loop
            autoplay
            className="w-full max-w-md md:max-w-2xl lg:max-w-4xl h-auto pointer-events-none"
            aria-hidden="true"
        />
      </div> */}
    </div>
  );
};

export default HeroSection;