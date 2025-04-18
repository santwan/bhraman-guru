import { db } from "../firebase/firebaseConfig.js";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";


export const saveTripToFireStore = async ({userId, input, plan}) => {
    try {
        const docRef = await addDoc(collection(db, "trips"), {
            userId,
            input,
            plan,
            createdAt: serverTimestamp()
        })
        console.log("Trip saved with ID:", docRef.id)
        return docRef.id
    } catch ( error ){
        console.error("Error saving trip:", error)
        throw error
    }
}