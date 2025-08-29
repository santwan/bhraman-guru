import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../context/AuthContext.jsx";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";

export default function TripHistory() {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        const tripsRef = collection(db, "trips");
        const q = query(tripsRef, where("userId", "==", user.uid), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        const allTrips = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setTrips(allTrips);
      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [user]);

  const handleDelete = async (tripId) => {
    const confirm = window.confirm("Are you sure you want to delete this trip?");
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, "trips", tripId));
      setTrips(trips.filter((trip) => trip.id !== tripId));
    } catch (err) {
      console.error("Failed to delete trip:", err);
    }
  };

  if (loading) return <p className="p-4">Loading history...</p>;

  return (
    <div className="max-w-5xl mx-auto p-10 pt-55  md:p-10 lg:p-3 md:pt-35 lg:pt-38 ">
      <h1 className="text-3xl font-bold mb-6">My Trip History</h1>
      {!user && <p className="text-gray-600">Please log in to view your trip history.</p>}
      {user && trips.length === 0 && <p className="text-gray-600">No trips found.</p>}
      {user && trips.length > 0 && (
        <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip, i) => (
            <motion.div
              key={trip.id}
              className="relative p-5 border hover:scale-110 border-gray-700 rounded-xl bg-[#0d0d0d] overflow-hidden transition-all duration-500 group cursor-pointer hover:shadow-md"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="relative z-10">
                <h2 className="text-lg font-semibold text-yellow-400 mb-1">
                  {trip.plan.tripDetails.destination}
                </h2>
                <p className=" text-gray-200">Days: {trip.plan.tripDetails.noOfDays}</p>
                <p className="text-sm text-gray-200">Budget: {trip.plan.tripDetails.budget}</p>
                <p className="text-xs text-gray-200/90 mt-2">
                  Generated: {trip.createdAt?.toDate?.().toLocaleString?.() || "N/A"}
                </p>

                <div className="mt-4 flex justify-between items-center">
                  <Link
                    to={`/my-trips?tripId=${trip.id}`}
                    className="text-sm text-blue-500 hover:underline font-medium"
                  >
                    View Plan
                  </Link>
                  <button
                    onClick={() => handleDelete(trip.id)}
                    className="text-sm text-red-500 flex items-center gap-1 hover:underline"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
