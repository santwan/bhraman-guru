// impoertinng the AuthContext object we created separetly 
// This context will allow us to share autehntication-related data ( like user info) accross the application
import { AuthContext } from "./AuthContext.jsx";

import { useState, useEffect } from "react";

// Importing the Firebase `auth` instance we initialized in out firebaseConfig file
import { auth } from "@/firebase/firebaseConfig";

// improting Firebase's buil-in listerner to detect authentication state changes(login/login)
import { onAuthStateChanged } from "firebase/auth";

/**
 * Creating the AuthProvider componenet , which will wrap our entire app
 * and provide authentication data via React Context
 */
export const AuthProvider = ({ children }) => {

    // `currentUser` will hold the currently authenticated user object ( or null if no user is logged in)
    const [currentUser, setCurrentUser] = useState(null)

    // `loading` ensures thtat UI waits untll Firebase chekcs the auth status
    const [loading , setLoading ] = useState(true)

    // Fucntion to log the user out
    // It calls Firebase's built in `signOut` method and returns the resulting Promise
    const logout = () => {
        return auth.signOut()
    }

    // This useeffect runs once when the component mounts
    // It sets up a listener to watch for changes in the user's authentication state
    useEffect(() => {
        // `onAuthStateChanged` automatically triggers whenever the user's sign-in state changes
        // It returns an `unsubcrbe` function that we can call to clean up the listener later.
        const unsubscribe = onAuthStateChanged( auth, (user) => {
            // if the user is logged in , `user` will contain their details (uid, email, etc)
            // If logged out, `user` will be `null`
            setCurrentUser(user)

            // Once Firebae finishes checking auth status , set loading to false
            setLoading(false)
        })

        // Cleanup function : removes the listerner when the component unmounts
        // to prevent memory leaks or unwanted updates
        return unsubscribe
    }, [])

    /**
     * Defining the value that will be provided to all child components.
     * this includes:
     * - currentUser : info about the logged in user ( or null )
     * - logout: function to sign out the user
     * - loading: boolean to handle UI loading states
     */
    const value = {
        currentUser, 
        logout,
        loading
    }

    // Wrapping children components inside AuthContext.Provider
    // This makes the `value` object accessible throughout the app via `useAuth [ useContext(AuthContext)]`
    // We render children ** only after loading finishes ** ( so that we donot flash a wrong UI state) 
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
