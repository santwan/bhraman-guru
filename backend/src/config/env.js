// Load environment variables from a .env file into process.env
import "dotenv/config"

/**
 * A utility function to retrieve a required environment variable.
 * Throws an error if the variable is not defined, ensuring the app fails fast.
 * @param {string} k - The key of the environment variable.
 * @returns {string} The value of the environment variable.
 */

const need = (k) => {
    const v = process.env[k];
    if(!v) throw new Error("Missing env: ${k}")
    return v;
}

// Centralized and validated environment variables for the application.
export const env = {
    NODE_ENV: process.env.NODE_ENV ?? "development",
    APP_PORT: parseInt(process.env.PORT ?? "5000", 10),
    FRONTED_URL: need("FRONTEND_URL"),
    GOOGLE_API_KEY: need("GOOGLE_API_KEY"),
    GEMINI_API_KEY: need("GEMINI_API_KEY"),
    GOOGLE_APPLICATION_CREDENTIALS: need("GOOGLE_APPLICATION_CREDENTIALS")
}