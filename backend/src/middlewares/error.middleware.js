import { ApiError } from "../utils/ApiError.js";

export const errorMiddleware = ( err, req, res, next ) => {
    const status = err instanceof ApiError ? err.status : 500
    const message = err.message || "Internal server error"
    const details = err.details ?? undefined

    if( process.env.NODE_ENV !== "production"){
        console.log(err)
    }

    res.status(status).json({
        success: false , 
        message, 
        details
    })
}