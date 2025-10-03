import React, { useState, useEffect } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const GeneratingTrip = () => {
  const [percentage, setPercentage] = useState(0);
  const [message, setMessage] = useState("Hold on, we're crafting your journey...");

  const messages = [
    { percent: 5, text: "Analyzing your travel preferences..." },
    { percent: 15, text: "Charting the optimal travel dates... 🗓️" },
    { percent: 30, text: "Scouting for top-rated accommodations... 🏨" },
    { percent: 45, text: "Curating unique local experiences... 🗺️" },
    { percent: 60, text: "Mapping out your daily itinerary... 📍" },
    { percent: 75, text: "Adding insider tips and recommendations..." },
    { percent: 90, text: "Finalizing the details of your trip... ✍️" },
    { percent: 99, text: "Almost ready ! 🚀" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPercentage(prev => {
        const newPercent = prev + 1;
        if (newPercent > 100) {
          clearInterval(interval);
          return 100;
        }

        const newMessage = messages.find(m => m.percent === newPercent);
        if (newMessage) {
          setMessage(newMessage.text);
        }

        return newPercent;
      });
    }, 600); // Update every 400ms for a smoother feel

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <DotLottieReact
        src="/Material wave loading.lottie"
        loop
        autoplay
        style={{ height: '300px', width: '300px' }}
      />
      <p className="text-lg font-semibold mt-4">{message}</p>
      <p className="text-2xl font-bold mt-2">{percentage}%</p>
    </div>
  );
};

export default GeneratingTrip;
