import React from "react";
import { Star, MapPin } from "lucide-react";

const PlaceCard = ({ place }) => (
  <li className="border p-3 rounded-md bg-white dark:bg-[#1a1a1a] shadow-sm dark:shadow-md">
    <div className="font-semibold text-black dark:text-white">
      {place.placeName}
    </div>
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
      {place.placeDetails}
    </p>
    <img
      src={place.placeImageUrl}
      alt={place.placeName}
      className="w-full h-48 object-cover rounded-lg mb-2"
    />
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
    <a
      href={`https://www.google.com/maps?q=${place.geoCoordinates.latitude},${place.geoCoordinates.longitude}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center"
    >
      <MapPin className="w-4 h-4 mr-1" />
      View on Map
    </a>
  </li>
);

export default PlaceCard;
