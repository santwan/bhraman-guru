export default function normalizePlan( plan ){
  
  if( !plan ) return null;

  plan.tripDetails = plan.tripDetails || {};
  plan.tripDetails.numberOfTravelers =
    plan.tripDetails.numberOfTravelers ??
    plan.tripDetails.travelers ??
    plan.tripDetails.travellers ??
    plan.tripDetails.traveler ??
    plan.tripDetails.numberOfTravellers ??
    1;

  plan.tripDetails.noOfDays =
    plan.tripDetails.noOfDays ??
    plan.tripDetails.noofdays ??
    plan.tripDetails.noOfdays ??
    plan.tripDetails.noOfDay ??
    plan.tripDetails.days ??
    plan.tripDetails.day ??
    plan.noOfDays ??
    plan.noOfDay ??
    null;
  
  plan.tripDetails.budget = 
    plan.tripDetails.budget ??
    plan.tripDetails.Budget ??
    plan.budget ??
    null ;
  
  plan.tripDetails.destination = 
    plan.tripDetails.destination ??
    plan.tripDetails.Destination ??
    plan.destination ??
    "Unknown" ;
  
  plan.hotelOptions = Array.isArray(plan.hotelOptions) ? plan.hotelOptions : [] ;
  plan.dailyItinerary = Array.isArray(plan.dailyItinerary) ? plan.dailyItinerary : [] ;

  return plan;
}