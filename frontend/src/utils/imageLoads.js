/**
 * @file src/utils/imageLoads.js
 * @description This file contains utility functions related to image loading and asynchronous operations.
 * It provides a reliable way to check if an image URL is valid and loadable without triggering CORS errors,
 * as well as a simple sleep utility for pausing execution.
 */
/**
 * Verifies if an image can be loaded from a given URL within a specific timeout.
 * @description This function creates an in-memory `Image` object and sets its `src` to the provided URL.
 * It leverages the browser's DOM-based image loading, which cleverly avoids the Cross-Origin Resource Sharing (CORS)
 * errors that would typically appear in the console if a `fetch` or `HEAD` request were used for cross-origin image checks.
 * The function returns a promise that resolves to `true` if the image loads successfully and `false` if it fails (e.g., 404 error) or times out.
 *
 * @param {string} url The URL of the image to check.
 * @param {number} [timeout=8000] The maximum time in milliseconds to wait for the image to load.
 * @returns {Promise<boolean>} A promise that resolves to `true` on successful load, otherwise `false`.
 */

export const imageLoads = (url, timeout=8000 ) => 
  new Promise((resolve) => {
    
    if ( !url ) return false;

    // Creating a new Image Instance . This is a standard DOM element
    const img = new Image();

    // this line starts the process. Assigning a url to the .src property begins the image loading
    // The browser handles the loading in the background
    // We don't append this image to the DOM, so it remains invisible to the user
    img.src = url;

    // to check whether the image loads success or failed - we have two `Event Handler` on an image element
    // .onload & .onerror
    // It's browser's task to execute this function
    // if Success => browser => onload
    // if Fail => browser => onerror

    // onload event handler: this will be called if the image loads successful 
    img.onload = () => {
      cleanup();
      resolve(true);
    };
    
    img.onerror = () => {
      cleanup();
      resolve(false);
    };

    const timer = setTimeout(() => {
      cleanup();
      resolve(false);
    }, timeout);

    let done = false;
    const cleanup = () => {
      if (done) return;
      done = true;
      img.onload = img.onerror = null;
      clearTimeout(timer);
    };

  })

  export const sleep = (ms) => new Promise((res) => setTimeout(res, ms));