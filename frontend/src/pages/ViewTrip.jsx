import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function ViewTrip() {

  const location = useLocation();
  const [plan, setPlan] = useState( () => {

    return (location.state && location.state.plan ) || null
  })

  useEffect(() => {

    if(plan) {
      return
    }

    try {
      const stored = sessionStorage.getItem('latest_trip_plan')
      if(stored){
        setPlan(JSON.parse(stored))
      }

    } catch (err) {
      console.log('Failed to read plan from sessionStorage', err)
    }
    
  }, [plan])

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
