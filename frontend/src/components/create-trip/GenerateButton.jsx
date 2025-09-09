import React from 'react';
import { motion } from 'framer-motion';

const GenerateButton = ({ onGenerateTrip, loading }) => {
  return (
    <motion.div
      className="text-center"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <button
        onClick={onGenerateTrip}
        disabled={loading}
        className="px-8 py-3 text-xl font-semibold bg-blue-500 text-white rounded-lg"
      >
        {loading ? 'Generating... please wait few seconds..' : 'Generate Trip'}
      </button>
    </motion.div>
  );
};

export default GenerateButton;
