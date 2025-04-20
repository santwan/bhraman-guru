import React from "react";

const TripOverview = ({ tripDetails }) => (
    <div className=" rounded-lg shadow p-4 mb-8">
      <p><strong>Duration:</strong> {tripDetails.noOfDays} Days</p>
      <p><strong>Travelers:</strong> {tripDetails.numberOfTravelers}</p>
      <p><strong>Budget:</strong> {tripDetails.budget}</p>
    </div>
  );
  
  export default TripOverview;
  
