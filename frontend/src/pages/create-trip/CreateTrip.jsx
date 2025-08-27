import React, { useState, useEffect, useRef } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import Input from '../../components/Input.jsx';
import { SelectBudgetOptions, SelectTravelList } from '../../constants/option.jsx';
import { generateTravelPlan } from '../../services/AIModel.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { saveTripToFireStore } from '../../services/firestore.js';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthModal from '../../components/global/AuthModal.jsx';

function CreateTrip() {
  const [place, setPlace] = useState();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();

  const handleInputChange = (name, value) => {
    if (name === 'noOfDays' && value > 15) {
      toast("Please enter Trip days Less than 15");
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const onGenerateTrip = async () => {
    if (!user) {
        setShowAuthModal(true);
      return;
    }
    const { noOfDays, location, budget, traveler } = formData;
    if (!noOfDays || !location || !budget || !traveler) {
      toast("Please fill all the details");
      return;
    }
    if (noOfDays > 15) {
      toast("Enter Travel Days less than 15");
      return;
    }
    try {
      setLoading(true);
      const locLabel = location.label || location;
  
      // now returns a JS object
      const plan = await generateTravelPlan({
        location: locLabel,
        noOfDays,
        traveler,
        budget,
      });
  
      // save the object directly
      const tripId = await saveTripToFireStore({
        userId: user.uid,
        input: { location: locLabel, noOfDays, traveler, budget },
        plan,                  // no JSON.stringify
      });
  
      toast("Trip plan generated!");
      setTimeout(() => navigate(`/my-trips?tripId=${tripId}`), 1500);
  
    } catch (err) {
      console.error(err);
      toast("Something went wrong while generating the trip.");
    } finally {
      setLoading(false);
    }
  };  

  return (
    <motion.div
      className="sm:px-10 md:px-32 lg:px-56 xl:px-60 px-5 pb-25 pt-30 mt-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-3xl font-bold mb-3">Tell us your Travel preferences</h2>
      <p className="max-w-fit">
        Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.
      </p>

      <div className="mt-10 space-y-10">
        {/* Destination */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <h2 className="font-semibold mb-2">What is Destination of choice?</h2>
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

        {/* Days */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <h2 className="font-semibold mb-2">How many days are you planning for?</h2>
          <Input
            placeholder="Ex. 3"
            type="number"
            onChange={e => handleInputChange('noOfDays', e.target.value)}
          />
        </motion.div>

        {/* Budget */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <h2 className="font-semibold mb-0">What is Your Budget?</h2>
          <h3 className="font-normal mb-2">
            The Budget is exclusively allocated for activities and dining purpose
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {SelectBudgetOptions.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  className={`p-3 border rounded-lg cursor-pointer ${
                    formData.budget === item.title
                      ? 'shadow-[0_0_20px_rgba(249,199,79,1)] border-red-600 scale-95'
                      : ''
                  }`}
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

        {/* Travelers */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
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

        {/* Generate Button */}
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
      </div>

      {showAuthModal && <AuthModal isLogin={true} onClose={() => setShowAuthModal(false)} />}
    </motion.div>
  );
}

export default CreateTrip;
