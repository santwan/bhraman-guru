import { db } from "../firebase/firebaseConfig.js";
import { 
    collection,
    addDoc, 
    serverTimestamp, 
    query,
    getDocs,
    where,

} from "firebase/firestore";


export const saveTripToFireStore = async ({ userId, input, plan }) => {
    try {
      // If plan came in as a JSON string, parse it; otherwise assume it's already an object
      const parsedPlan = typeof plan === "string" ? JSON.parse(plan) : plan;
  
      const docRef = await addDoc(collection(db, "trips"), {
        userId,
        input,
        plan: parsedPlan,
        createdAt: serverTimestamp()
      });
  
      console.log("Trip saved with ID:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Error saving trip:", error);
      throw error;
    }
  };


export const getTripsByUserId = async (userId) => {
    try{
        const q = query(collection(db, "trips"), where("userId", "==", userId))
        const querySnapshot = await getDocs(q)

        const trips = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }))

        return trips

    } catch(error){
        console.log("Error while fetching trips:", error)
        throw error
    }
}