import React from "react";
import { motion } from "framer-motion";
import { Compass } from "lucide-react";
import ReactPlayer from "react-player/youtube";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="bg-white dark:bg-[#0d0d0d] text-[#3a2601] dark:text-white py-20 px-6 text-center space-y-10 transition-colors duration-300">
      
      {/* Big Slogan Header */}
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl sm:text-5xl md:text-5xl font-bold tracking-tight"
      >
        <div className="md:px-25 leading-snug">
          <p>
            <span className="underline">BhramanGuru</span>: Your Expert AI Travel Planner
            <br /> <span>and Journey Curator</span>
          </p>
        </div>
      </motion.h1>

      {/* Subtext */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="max-w-2xl mx-auto text-lg sm:text-xl text-[#3a2601]/85 dark:text-white/80"
      >
        Stop searching, start experiencing. Unlock smart, personalized itineraries and discover secret local spots for truly unforgettable and hassle-free adventures.
      </motion.p>

      {/* Plan Trip Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="flex justify-center"
      >
        <Link
          to={"/create-trip"}
          className="gap-1 inline-flex items-center px-12 py-4 text-lg font-bold rounded-xl 
          bg-[#F9C74F] text-[#1A4D8F] hover:bg-[#F6A6A1] hover:text-black 
          dark:bg-[#4BA3B4] dark:text-white dark:hover:bg-[#F9C74F] dark:hover:text-black 
          active:scale-110 shadow-lg transition-all duration-300"
        >
          Plan Trip
          <Compass />
        </Link>
      </motion.div>

      {/* YouTube Embed */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="max-w-4xl mx-auto rounded-xl overflow-hidden mt-10 shadow-xl"
      >
        <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg">
          <ReactPlayer
            url="https://www.youtube.com/watch?v=lpJilhkbC9s"
            width="100%"
            height="100%"
            controls={true}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
