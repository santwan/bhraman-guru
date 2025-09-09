/**
 * @file AuthContext.js
 * @description This file creates and exports a React Context object specifically for managing authentication state throughout the application.
 *
 * @logic
 * This file uses React's `createContext` function to establish a centralized "container" for authentication data. This allows any component wrapped within this context's `Provider` to access shared information (like the current user) without the need for "prop drilling" (passing props down through multiple component layers).
 *
 * @usage
 * This `AuthContext` object is intended to be used by a parent component (like an `AuthProvider`) which will wrap parts of the application. That provider will supply the context's value. Child components can then consume this value using the `useContext` hook.
 *
 *
 * @exports
 * - `AuthContext`: A React Context object that will hold authentication state.
 */

// 1. Import the `createContext` function from the 'react' library.
// This is the core React API for creating a context object.
import { createContext } from 'react';

// 2. Create and export the Authentication Context.
// `createContext()` initializes a context. Any component can subscribe to it.
// We export it so that other components in the application can import and use it
// to either provide or consume the authentication data.
// No default value is provided here, meaning consumers will receive `undefined`
// unless they are rendered inside an `AuthContext.Provider`.
export const AuthContext = createContext();