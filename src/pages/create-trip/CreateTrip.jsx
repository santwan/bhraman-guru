import React, { useState, useEffect, useRef } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import Input from '../../components/Input.jsx';
import { SelectBudgetOptions, SelectTravelList } from '../../constants/option.jsx';
import { toast } from 'sonner';
import { generateTravelPlan } from '../../services/AIModel.jsx';
import { useUser, SignInButton } from "@clerk/clerk-react";

function CreateTrip() {
  const [place, setPlace] = useState();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [tripPlan, setTripPlan] = useState(null);

  const { isSignedIn } = useUser();
  const signInRef = useRef(); // ✅ Ref to trigger sign in

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
      signInRef.current.click(); // ✅ Trigger Clerk sign-in modal
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

      console.log("Generated Trip Plan:", plan);
      toast("Trip plan generated!");
    } catch (err) {
      console.error(err);
      toast("Something went wrong while generating the trip.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='sm:px-10 md:px-32 lg:px-56 xl:px-60 px-5 pt-25 mt-10'>
      <h2 className='text-3xl font-sans font-bold mb-3'>Tell us your Travel preferences</h2>
      <p className='max-w-fit'>
        Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.
      </p>

      <div className='mt-10'>
        {/* Location */}
        <div>
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
              isClearable: true
            }}
          />
        </div>

        {/* Days */}
        <div className="mt-10">
          <h2 className='font-semibold mb-2'>How many days are you planning for?</h2>
          <Input
            placeholder="Ex. 3"
            type="number"
            onChange={(e) => handleInputChange('noOfDays', e.target.value)}
          />
        </div>

        {/* Budget */}
        <div className='mt-10'>
          <h2 className='font-semibold mb-0'>What is Your Budget?</h2>
          <h3 className='font-normal mb-2'>The Budget is exclusively allocated for activities and dining purpose</h3>
          <div className='grid grid-cols-3 gap-3'>
            {SelectBudgetOptions.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  onClick={() => handleInputChange('budget', item.title)}
                  className={`p-2 border cursor-pointer rounded-lg hover:shadow-lg ${formData?.budget === item.title && 'shadow-lg border-black'}`}
                >
                  <Icon className="w-8 h-8 text-red-600" />
                  <h2 className="font-medium">{item.title}</h2>
                  <h2 className="text-xs text-gray-500">{item.desc}</h2>
                </div>
              );
            })}
          </div>
        </div>

        {/* Traveler Type */}
        <div className='mt-10'>
          <h2 className='font-semibold mb-2'>Who do you plan on traveling with on your next adventure?</h2>
          <div className='grid grid-cols-3 gap-2'>
            {SelectTravelList.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  onClick={() => handleInputChange('traveler', item.people)}
                  className={`p-2 border cursor-pointer rounded-lg hover:shadow-lg ${formData?.traveler === item.people && 'shadow-lg border-black'}`}
                >
                  <Icon className='w-8 h-8 text-indigo-600 mb-1' />
                  <h2 className='font-medium'>{item.title}</h2>
                  <h2 className='text-xs text-gray-500'>{item.desc}</h2>
                  <h2 className='text-gray-900'>{item.people}</h2>
                </div>
              );
            })}
          </div>
        </div>

        {/* Generate Trip Button */}
        <div className='mt-10 text-right'>
          <button
            onClick={onGenerateTrip}
            disabled={loading}
            className="p-2 bg-blue-500 text-white rounded-lg"
          >
            {loading ? 'Generating...' : 'Generate Trip'}
          </button>
        </div>
      </div>

      {/* 🔒 Hidden SignIn trigger */}
      <SignInButton mode="modal">
        <button ref={signInRef} style={{ display: "none" }} />
      </SignInButton>
    </div>
  );
}

export default CreateTrip;
