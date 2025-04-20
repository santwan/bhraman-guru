import React from "react";
import { MapPin, Star } from "lucide-react";

const DailyItinerary = ({ dailyItinerary }) => (
  <section>
    <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">Daily Itinerary</h2>
    {dailyItinerary.map((day, i) => (
      <div key={i} className="mb-10">
        <h3 className="text-xl font-bold mb-2 text-black dark:text-white">
          Day {day.day}: {day.theme}
        </h3>
        <p className="italic text-sm text-gray-500 dark:text-gray-400 mb-4">
          Best Time to Visit: {day.bestTimeToVisit}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {day.schedule.map((place, j) => (
            <div
              key={j}
              className="border p-4 rounded-lg bg-white dark:bg-[#1a1a1a] shadow-sm dark:shadow-md flex flex-col justify-between"
            >
              <div>
                <h4 className="font-semibold text-lg mb-1 text-black dark:text-white">
                  {place.placeName}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {place.placeDetails}
                </p>

                <div className="flex items-center text-sm text-gray-700 dark:text-gray-300 mb-1">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  {place.rating}
                </div>

                <p className="text-sm text-black dark:text-white">
                  <strong>Ticket:</strong> {place.ticketPricing}
                </p>
                <p className="text-sm text-black dark:text-white">
                  <strong>Time Spent:</strong> {place.estimatedTimeSpent}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {place.travelTimeFromPrevious}
                </p>
              </div>

              <a
                href={`https://www.google.com/maps?q=${place.geoCoordinates.latitude},${place.geoCoordinates.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center mt-2"
              >
                <MapPin className="w-4 h-4 mr-1" />
                View on Map
              </a>
            </div>
          ))}
        </div>
      </div>
    ))}
  </section>
);

export default DailyItinerary;
