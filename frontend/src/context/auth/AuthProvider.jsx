import { AuthContext } from "./AuthContext.jsx";
import { useState, useEffect } from "react";
import { auth } from "@/firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

export const AuthProvider = ({ children }) => {

    const [currentUser, setCurrentUser] = useState(null)
    const [loading , setLoading ] = useState(true)

    const logout = () => {
        return auth.signOut()
    }

    useEffect(() => {

        const unsubscribe = onAuthStateChanged( auth, (user) => {

            setCurrentUser(user)

            setLoading(false)
        })

        return unsubscribe
    }, [])

    const value = {
        currentUser, 
        logout,
        loading
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
