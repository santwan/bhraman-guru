import React from "react";
import { motion } from "framer-motion";
import { Star, MapPin } from "lucide-react";

const HotelCard = ({ hotel, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="bg-white dark:bg-[#1a1a1a] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
  >
    <img
      src={hotel.hotelImageUrl}
      alt={hotel.hotelName}
      loading="lazy"
      className="w-full h-40 object-cover"
    />
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-1 text-black dark:text-white">
        {hotel.hotelName}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
        {hotel.hotelAddress}
      </p>
      <div className="flex items-center text-sm text-gray-700 dark:text-gray-300 mb-2">
        <Star className="w-4 h-4 text-yellow-500 mr-1" />
        {hotel.rating}
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        {hotel.description}
      </p>
      <div className="flex justify-between items-center">
        <a
          href={
            hotel.bookingLink ||
            `https://www.google.com/maps?q=${hotel.geoCoordinates.latitude},${hotel.geoCoordinates.longitude}`
          }
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center"
        >
          <MapPin className="w-4 h-4 mr-1" />
          {hotel.bookingLink ? "Book Now" : "View on Map"}
        </a>
        <span className="text-sm font-medium text-black dark:text-white">
          {hotel.price}
        </span>
      </div>
    </div>
  </motion.div>
);

export default HotelCard;
