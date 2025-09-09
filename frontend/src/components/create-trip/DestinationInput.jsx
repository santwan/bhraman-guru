import React from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { useAnimation } from '@/hooks/useAnimation';
import { motion } from 'framer-motion';

const DestinationInput = ({ value, handleInputChange }) => {
  const formElementAnimation = useAnimation('fadeInBottom', 0.4);

  return (
    <motion.div {...formElementAnimation}>
      <h2 className="font-semibold mb-2">What is Destination of choice?</h2>
      <GooglePlacesAutocomplete
        apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
        selectProps={{
          value,
          onChange: (v) => handleInputChange("location", v),
          placeholder: "Search your destination...",
          isClearable: true,
          styles: {
            control: (base, state) => ({
              ...base,
              backgroundColor: document.documentElement.classList.contains("dark") ? "#1a1a1a" : "white",
              color: document.documentElement.classList.contains("dark") ? "white" : "black",
              borderColor: state.isFocused ? "#F9C74F" : "#ccc",
              boxShadow: state.isFocused ? "0 0 0 1px #F9C74F" : "none",
              "&:hover": {
                borderColor: "#F9C74F"
              }
            }),
            singleValue: (base) => ({
              ...base,
              color: document.documentElement.classList.contains("dark") ? "white" : "black"
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: document.documentElement.classList.contains("dark") ? "#1a1a1a" : "white",
              color: document.documentElement.classList.contains("dark") ? "white" : "black"
            }),
            option: (base, { isFocused }) => ({
              ...base,
              backgroundColor: isFocused
                ? (document.documentElement.classList.contains("dark") ? "#333" : "#eee")
                : "transparent",
              color: document.documentElement.classList.contains("dark") ? "white" : "black"
            }),
            input: (base) => ({
              ...base,
              color: document.documentElement.classList.contains("dark") ? "white" : "black"
            }),
          }
        }}
      />
    </motion.div>
  );
};

export default DestinationInput;
