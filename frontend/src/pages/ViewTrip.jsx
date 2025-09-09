import React from "react";
import { useLocation } from "react-router-dom";

function ViewTrip() {
  const location = useLocation();
  const { plan } = location.state || {};

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Generated Trip Plan</h1>
      {plan ? (
        <pre className="bg-gray-100 p-4 rounded-lg text-sm text-left overflow-x-auto">
          {JSON.stringify(plan, null, 2)}
        </pre>
      ) : (
        <p>No trip plan to display. Please generate a trip first.</p>
      )}
    </div>
  );
}

export default ViewTrip;
