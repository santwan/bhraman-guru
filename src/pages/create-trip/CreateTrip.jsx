import React, { useState, useEffect, useRef } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import Input from '../../components/Input.jsx';
import { SelectBudgetOptions, SelectTravelList } from '../../constants/option.jsx';
import { toast } from 'sonner';
import { generateTravelPlan } from '../../services/AIModel.jsx';
import { useUser, SignInButton } from "@clerk/clerk-react";
import { saveTripToFireStore } from '../../services/firestore.js';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // ✅ Import

function CreateTrip() {
  const [place, setPlace] = useState();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [tripPlan, setTripPlan] = useState(null);

  const navigate = useNavigate()
  const { isSignedIn, user } = useUser();
  const signInRef = useRef();

  const handleInputChange = (name, value) => {
    if (name === 'noOfDays' && value > 15) {
      toast("Please enter Trip days Less than 15");
    }

    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const onGenerateTrip = async () => {
    if (!isSignedIn) {
      toast("Please sign in to continue");
      signInRef.current.click();
      return;
    }

    if (!formData?.noOfDays || !formData?.location || !formData?.budget || !formData?.traveler) {
      toast("Please Fill all the details");
      return;
    }

    if (formData.noOfDays > 15) {
      toast("Enter Travel Days less than 15");
      return;
    }

    try {
      setLoading(true);
      const location = formData.location?.label || formData.location;
      const plan = await generateTravelPlan({
        location,
        noOfDays: formData.noOfDays,
        traveler: formData.traveler,
        budget: formData.budget,
      });

      const tripId = await saveTripToFireStore({
        userId: user.id,
        input: {
            location,
            noOfDays: formData.noOfDays,
            traveler: formData.traveler,
            budget: formData.budget,
        },
        plan,
      })

      toast("Trip plan generated!");

      setTimeout(() => {
        navigate(`/my-trips?tripId=${tripId}`)
      }, 1500)
    } catch (err) {
      console.error(err);
      toast("Something went wrong while generating the trip.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className='sm:px-10 md:px-32 lg:px-56 xl:px-60 px-5 pt-25 mt-10'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className='text-3xl font-sans font-bold mb-3'>Tell us your Travel preferences</h2>
      <p className='max-w-fit'>
        Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.
      </p>

      <div className='mt-10 space-y-10'>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <h2 className='font-semibold mb-2'>What is Destination of choice?</h2>
          <GooglePlacesAutocomplete
            apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
            selectProps={{
              place,
              onChange: (v) => {
                setPlace(v);
                handleInputChange("location", v);
              },
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

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <h2 className='font-semibold mb-2'>How many days are you planning for?</h2>
          <Input
            placeholder="Ex. 3"
            type="number"
            onChange={(e) => handleInputChange('noOfDays', e.target.value)}
          />
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <h2 className='font-semibold mb-0'>What is Your Budget?</h2>
          <h3 className='font-normal mb-2'>The Budget is exclusively allocated for activities and dining purpose</h3>
          <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
            {SelectBudgetOptions.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className={`p-3 border cursor-pointer rounded-lg ${formData?.budget === item.title && ' shadow-[0_0_20px_rgba(249,199,79,1)] border-red-600 scale-95 '}`}
                  onClick={() => handleInputChange('budget', item.title)}
                >
                  <Icon className="w-8 h-8 text-red-600" />
                  <h2 className="font-medium">{item.title}</h2>
                  <h2 className="text-xs text-gray-500">{item.desc}</h2>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <h2 className='font-semibold mb-2'>Who do you plan on traveling with on your next adventure?</h2>
          <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
            {SelectTravelList.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className={`py-2 px-3 border cursor-pointer rounded-lg ${formData?.traveler === item.people && 'shadow-[0_0_20px_rgba(139,92,246,1)] border-indigo-600 scale-90'}`}
                  onClick={() => handleInputChange('traveler', item.people)}
                >
                  <Icon className='w-8 h-8 text-indigo-600 mb-1' />
                  <h2 className='font-medium'>{item.title}</h2>
                  <h2 className='text-xs text-gray-500'>{item.desc}</h2>
                  <h2 className='text-gray-900'>{item.people}</h2>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          className='text-right'
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <button
            onClick={onGenerateTrip}
            disabled={loading}
            className="p-2 bg-blue-500 text-white rounded-lg"
          >
            {loading ? 'Generating...' : 'Generate Trip'}
          </button>
        </motion.div>
      </div>

      <SignInButton mode="modal">
        <button ref={signInRef} style={{ display: "none" }} />
      </SignInButton>
    </motion.div>
  );
}

export default CreateTrip;
