import React from "react";

import HotelCard from "./HotelCard";

const HotelGrid = ({ hotelOptions }) => (
  <section className="mb-10">
    <h2 className="text-2xl font-semibold mb-4">Hotel Options</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {hotelOptions.map((hotel, i) => (
        <HotelCard key={i} hotel={hotel} index={i} />
      ))}
    </div>
  </section>
);

export default HotelGrid;
