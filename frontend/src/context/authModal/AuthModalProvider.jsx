import { useState } from "react"
import { AuthModalContext } from ".";


export const AuthModalProvider = ({ children }) => {
    const [authModalOpen, setAuthModalOpen ] = useState(false);

    return (
        <AuthModalContext.Provider value={{ authModalOpen, setAuthModalOpen }}>
            {children}
        </AuthModalContext.Provider>
    )
}