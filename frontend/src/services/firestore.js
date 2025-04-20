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
      if (!plan) throw new Error("Plan is undefined");
  
      const docRef = await addDoc(collection(db, "trips"), {
        userId,
        input,
        plan,  // ✅ This should now be a valid object
        createdAt: serverTimestamp()
      });
  
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