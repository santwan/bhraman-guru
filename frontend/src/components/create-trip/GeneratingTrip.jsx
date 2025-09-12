import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const GeneratingTrip = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <DotLottieReact
        src="/Material wave loading.lottie"
        loop
        autoplay
      />
      <p className="text-lg font-medium mt-4">Generating Your Dream Trip...</p>
    </div>
  );
};

export default GeneratingTrip;