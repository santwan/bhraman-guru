export const validateTripInputs = (formData = {}) => {
  const { noOfDays, location, budget, traveler } = formData;

  // If all fields are empty, return a single generic error.
  if (!noOfDays && !location && !budget && !traveler) {
    return ["Please enter details about your trip"];
  }

  const errors = [];

  // Validate noOfDays
  if (!noOfDays) {
    errors.push("Please provide number of days.");
  } else {
    if (Number(noOfDays) < 1) errors.push("Number of days must be at least 1.");
    if (Number(noOfDays) > 15) errors.push("Maximum days allowed is 15 days.");
  }

  // Validate other fields
  if (!location) errors.push("Please provide a location.");
  if (!budget) errors.push("Please select a budget.");
  if (!traveler) errors.push("Please select number of travelers.");

  return errors;
};
