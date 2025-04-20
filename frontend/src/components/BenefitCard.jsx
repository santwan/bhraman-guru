// components/BenefitCard.jsx

import React, { useState } from "react";
import { motion } from "framer-motion";

const BenefitCard = ({ Icon, title, description }) => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onTouchMove={(e) => {
        const touch = e.touches[0];
        const rect = e.currentTarget.getBoundingClientRect();
        setCoords({
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top,
        });
      }}
      className="relative p-5 border hover:scale-x-105 border-gray-700 rounded-xl dark:bg-[#0d0d0d] overflow-hidden group cursor-pointer"
    >
      {/* Glowing effect */}
      <motion.div
        className="absolute w-40 h-40 bg-lime-500 rounded-full pointer-events-none blur-2xl opacity-30"
        style={{
          top: coords.y - 80,
          left: coords.x - 80,
        }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />

      <div className="relative z-10">
        <div className="bg-[#1a1a1a] p-2 rounded w-fit mb-4 border border-gray-600">
          <Icon className="text-white w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold dark:text-yellow-400">{title}</h3>
        <p className="text-sm dark:text-gray-300 mt-2">{description}</p>
      </div>
    </motion.div>
  );
};

export default BenefitCard;
