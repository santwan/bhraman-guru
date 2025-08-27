/**
 * Represents a standardized API response.
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