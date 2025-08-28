/**
 * @file Defines a custom, structured error class for handling API-specific errors.
 * This allows for consistent error responses across the entire application.
 */

/**
 * A custom error class for API-related errors.
 * It extends the built-in Error class to include an HTTP status code
 * and additional details, which helps in creating standardized error responses.
 * @class
 * @extends {Error}
 */

export class ApiError extends Error {
    constructor(status, message, details = [], stack = '' ){
        super(message);
        this.status = status
        this.details = details
        if(stack) this.stack = stack 
    }
}