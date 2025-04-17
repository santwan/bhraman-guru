import React from "react";
import { motion } from "framer-motion";
import { Compass } from "lucide-react";
import ReactPlayer from "react-player/youtube";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="bg-gradient-to-br from-[#DEACF5] via-[#9754CB] to-[#6237A0] dark:from-[#28104E] dark:via-[#6237A0] dark:to-[#9754CB] text-white py-20 px-6 text-center space-y-10">
      
      {/* Big Slogan Header */}
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight"
      >
        Discover. Plan. Travel Smart — With BhramanGuru
      </motion.h1>

      {/* Subtext */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="max-w-2xl mx-auto text-lg sm:text-xl font-medium text-white/90"
      >
        Your AI-powered travel companion — turning dream journeys into smart plans.
      </motion.p>

      {/* Plan Trip Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="flex justify-center"
      >
        <Link
          to="/create-trip"
          className="inline-flex items-center px-8 py-4 text-lg font-semibold rounded-full bg-white text-purple-800 hover:bg-yellow-300 hover:text-black shadow-lg transition-all duration-300"
        >
          Plan Trip
          <Compass className="ml-3 w-5 h-5" />
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
            url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
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
