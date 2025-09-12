import React, { useState, useEffect } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const GeneratingTrip = () => {
  const [percentage, setPercentage] = useState(0);
  const [message, setMessage] = useState("Hold on, we're crafting your journey...");

  const messages = [
    { percent: 0, text: "Hold on, we're crafting your journey..." },
    { percent: 25, text: "Scanning for the best time to visit..." },
    { percent: 50, text: "Finding the perfect hotels for you..." },
    { percent: 75, text: "Curating a list of must-see attractions..." },
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
    }, 400); // Update every 400ms for a smoother feel

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
