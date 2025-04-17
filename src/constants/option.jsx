import {
    Plane,
    Heart,
    Users,
    Glasses,
    PiggyBank,
    Wallet,
    Gem,
} from 'lucide-react';
  
export const SelectTravelList = [
    {
      id: 1,
      title: 'Just Me',
      desc: 'A solo traveler in exploration',
      icon: Plane, // ✈️
      people: '1',
    },
    {
      id: 2,
      title: 'A Couple',
      desc: 'Two travelers in tandem',
      icon: Heart, // 🥂
      people: '2 People',
    },
    {
      id: 3,
      title: 'Family',
      desc: 'A group of fun-loving adventurers',
      icon: Users, // 👪
      people: '3 to 5 people',
    },
    {
      id: 4,
      title: 'Friends',
      desc: 'A bunch of thrill seekers',
      icon: Glasses, // 😎
      people: '5 to 10 people',
    },
  ];
  
  export const SelectBudgetOptions = [
    {
      id: 1,
      title: 'Cheap',
      desc: 'Stay conscious of cost',
      icon: PiggyBank, // 💷
    },
    {
      id: 2,
      title: 'Moderate',
      desc: 'Keep cost on the average side',
      icon: Wallet, // 💵
    },
    {
      id: 3,
      title: 'Luxury',
      desc: 'Don’t worry about cost',
      icon: Gem, // 💰
    },
];
  

export const AI_PROMPT="Generate Travel Plan for {location} : Las Vegas, for {noOfDays} Days for {traveler} with a {budget} Budget, Give me a Hotels Option List with HotelName, Hotel address, Price, Hotel image url, geo coordinates, rating, descriptions and suggest itinerary with placeName, Place Details, Place Image Url, Geo Coordinates, ticket pricing, rating, Time Travel each of the location for {noOfDays} days with each day plan with best time to visit in JSON format."