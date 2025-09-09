import React from 'react';
import { SelectTravelList } from '@/constants/option.jsx';
import { useAnimation } from '@/hooks/useAnimation';
import { motion } from 'framer-motion';

const TravelerSelector = ({ formData, handleInputChange }) => {
  const formElementAnimation = useAnimation('fadeInBottom', 0.4);

  return (
    <motion.div {...formElementAnimation}>
      <h2 className="font-semibold mb-2">
        Who do you plan on traveling with on your next adventure?
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {SelectTravelList.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className={`py-2 px-3 border rounded-lg cursor-pointer ${
                formData.traveler === item.people
                  ? 'shadow-[0_0_20px_rgba(139,92,246,1)] border-indigo-600 scale-90'
                  : ''
              }`}
              onClick={() => handleInputChange('traveler', item.people)}
            >
              <Icon className="w-8 h-8 text-indigo-600 mb-1" />
              <h2 className="font-medium">{item.title}</h2>
              <h2 className="text-xs text-gray-500">{item.desc}</h2>
              <h2 className="text-gray-900 dark:text-amber-50">{item.people}</h2>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default TravelerSelector;
