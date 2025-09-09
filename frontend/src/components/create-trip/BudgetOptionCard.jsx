import React from 'react';
import { motion } from 'framer-motion';

const BudgetOptionCard = ({ item, isSelected, handleInputChange }) => {
  const Icon = item.icon;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`
        p-3 border rounded-lg cursor-pointer
        ${isSelected ? 'shadow-[0_0_20px_rgba(249,199,79,1)] border-red-600 scale-95' : ''}
      `}
      onClick={() => handleInputChange('budget', item.title)}
    >
      <Icon className="w-8 h-8 text-red-600" />
      <h2 className="font-medium">{item.title}</h2>
      <h2 className="text-xs text-gray-500">{item.desc}</h2>
    </motion.div>
  );
};

export default BudgetOptionCard;
