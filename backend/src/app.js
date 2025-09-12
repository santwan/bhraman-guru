// Import necessary third-party and custom modules
import express from "express" // The core framework for building the web server
import cors from "cors" // Middleware to enable Cross-origin Resource Sharing
import helmet from "helmet" // Middleware to secure the app by setting various HTTP headers
import morgan from "morgan" //Middleware for logging the http request
import rateLimit from "express-rate-limit" // Middleware to limit repeated request to public api
import { env } from "./config/env.js" // Centralized env variables
import  { routerV1 } from "./routes/v1/index.js" // The main router for version 1 of the API
import { errorMiddleware } from "./middlewares/error.middleware.js" // Custom error handling middleware


// Initialize the express application
const app = express()

// --- Global Middleware Setup ---

// Use Helmet to set security-related HTTP response headers, protecting against well-known vulnerabilities
app.use(helmet())

//Configure CORS to allow request only from specified frontend URL
// 'credentials' indicates whether the browser should include cookies in the request
app.use(cors({
    origin: env.FRONTEND_URL,
    credentials: true,
}))

// Parse incoming JSON payloads. The limit prevents overly large payload
app.use(express.json({ limit: "1mb" }))

// Parse the incoming URL-encoded payloads ( e.g. form submissions)
// extended: true allows for rich objects and arrays to be encoded into the URL-encoded format
app.use(express.urlencoded({ extended: true }))

// Use Morgan for request logging. The format depends on the environment.
// "combined" is a standard Apache combined log format for production.
// "dev" is a color-coded, concise format for development.
app.use(morgan( env.NODE_ENV === "production" ? "combined" : "development"))

// Apply a rate limiter to all requests to prevent abuse (e.g., brute-force attacks).
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // The time window for which requests are checked (15 minutes).
    max: 500, // The maximum number of requests allowed from one IP in the window.
    standardHeaders: true, // Send rate limit info in the `RateLimit-*` headers.
    legacyHeaders: false, // Disable the old `X-RateLimit-*` headers.
    message: { error: "Too many requests, please try again later." }, // The message sent when the limit is exceeded.
}));


// --- Basic Routes ---

// A simple root route to confirm the server is running.
app.get("/", ( req, res ) => {
    res.send("BhramanGuru Backend is running")
})

// A health check endpoint, often used by monitoring services to verify server status.
app.get("/health", (req, res) => {
    res.json({ status: "OK" });
});


// --- API Routes ---

// Mount the version 1 router under the "/api/v1" path.
// All routes defined in `routerV1` will be prefixed with `/api/v1`.
app.use("/api/v1", routerV1);

app.use(errorMiddleware)

export {app}
