/**
 * @file Defines a standardized structure for API responses.
 * By using this class for all successful responses, the API becomes
 * predictable, ensuring that frontend clients can reliably parse the data.
 */


/**
 * Represents a standardized API response object.
 * This class is used to wrap the data being sent back to the client,
 * adding metadata like the HTTP status code and a descriptive message.
 * @class
 */
class ApiResponse {
    /**
     * Creates an instance of ApiResponse.
     * @param {number} statusCode - The HTTP status code of the response.
     * @param {*} data - The data payload of the response.
     * @param {string} [message="Success"] - A descriptive message for the response.
     */
    constructor(statusCode, data, message = "Success") {
        /**
         * The HTTP status code.
         * @type {number}
         */
        this.statusCode = statusCode;

        /**
         * The data payload.
         * @type {*}
         */
        this.data = data;

        /**
         * The response message.
         * @type {string}
         */
        this.message = message;

        /**
         * Indicates if the request was successful.
         * Determined by a status code less than 400.
         * @type {boolean}
         */
        this.success = statusCode < 400;
    }
}

export { ApiResponse };