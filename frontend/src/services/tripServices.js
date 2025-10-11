import axios from 'axios';

const API_URL = '/api/v1/trips';

export const saveTrip = async (tripData) => {
  try {
    const response = await axios.post(API_URL, tripData);
    return response.data;
  } catch (error) {
    console.error('Error saving trip:', error);
    throw error;
  }
};
