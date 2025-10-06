import React from "react";
import BenefitCard from "@/components/ui/BenefitCard.jsx";
import {
  MapPin,
  Hotel,
  CalendarClock,
  LocateFixed,
  Globe,
  HeartHandshake,
} from "lucide-react"; // Icons matching travel theme

const benefits = [
  {
    title: "Personalized Itineraries",
    description:
      "BhramanGuru crafts travel plans tailored to your preferences, budget, and travel style.",
    Icon: MapPin,
  },
  {
    title: "Verified Hotel Options",
    description:
      "Choose from top-rated stays, with images, prices, and booking links — all in one place.",
    Icon: Hotel,
  },
  {
    title: "Time-Optimized Schedules",
    description:
      "Your itinerary includes travel time, estimated visit durations, and best time slots — auto-calculated.",
    Icon: CalendarClock,
  },
  {
    title: "Hidden Gems Unlocked",
    description:
      "Discover offbeat destinations, local treasures, and underrated spots with our smart engine.",
    Icon: LocateFixed,
  },
  {
    title: "Multilingual Support",
    description:
      "We help you travel confidently across India and beyond — in your preferred language.",
    Icon: Globe,
  },
  {
    title: "Human + AI Assistance",
    description:
      "Get real-time suggestions, and connect with local experts if needed — blending AI with human warmth.",
    Icon: HeartHandshake,
  },
];


const BenefitSection = () => {
  return (
    <section className="dark:bg-black dark:text-white py-20 px-5 md:px-30">
      <div className="max-w-7xl mx-auto text-center mb-10">
        <h2 className="text-4xl font-bold mb-2">Why travelers Love Us</h2>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
        From personalized planning to local discoveries, BhramanGuru uses AI to turn your dream trip into reality — smarter, faster, and stress-free.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {benefits.map((benefit, index) => (
          <BenefitCard key={index} {...benefit} />
        ))}

      </div>
    </section>
  );
};

export default BenefitSection;
