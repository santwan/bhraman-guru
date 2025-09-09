/**
 * @file useAuth.js
 * @description This file defines and exports a custom React hook, `useAuth`, to provide a simple and clean way for components to access the authentication context.
 *
 * @customhook useAuth
 * @overview The `useAuth` hook is a convenience wrapper around React's `useContext` hook. Its sole purpose is to abstract away the need to import both `useContext` and `AuthContext` in every component that requires authentication data.
 *
 * @logic
 * It directly calls `useContext` with the imported `AuthContext` and returns the resulting value. This value (which typically includes the current user, login/logout functions, etc.) is supplied by the `AuthContext.Provider` higher up in the component tree.
 *
 * @benefit
 * - **Simplicity**: Components can get the auth context with a single, self-explanatory hook call: `const auth = useAuth();`.
 * 
 * - **Maintainability**: If the context ever needed to be changed or sourced differently, the logic would only need to be updated in this one file, rather than in every consuming component.
 * 
 * - **Cleanliness**: It reduces the number of imports in consumer components, making them easier to read.
 *
 * @exports
 * - `useAuth`: The custom hook that returns the value of `AuthContext`.
 */

// 1. Import the specific context we want to consume.
// This links our custom hook directly to the authentication state.
import { AuthContext } from "./AuthContext.jsx";

// 2. Import the standard `useContext` hook from React.
// This is the fundamental React hook for reading a context's value.
import { useContext } from "react";

// 3. Define and export the custom hook.
// By convention, custom React hooks start with the word "use".
export const useAuth = () => {
    // Call the `useContext` hook with our specific `AuthContext`
    // and return its value. This value is whatever was passed to the `value` prop
    // of the nearest `AuthContext.Provider` in the component tree.
    return useContext(AuthContext);
};