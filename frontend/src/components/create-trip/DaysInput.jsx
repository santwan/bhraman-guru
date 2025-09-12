import React from 'react';
import Input from '@/components/Input.jsx';
import { useAnimation } from '@/hooks/useAnimation';
import { motion } from 'framer-motion';

const DaysInput = ({ handleInputChange }) => {
  const formElementAnimation = useAnimation('fadeInBottom', 0.4);

  return (
    <motion.div {...formElementAnimation}>
      <h2 className="font-semibold mb-2">How many days are you planning for?</h2>
      <Input
        placeholder="Ex. 3"
        type="number"
        onChange={e => handleInputChange('noOfDays', e.target.value)}
      />
    </motion.div>
  );
};

export default DaysInput;