
import { lazy } from 'react';

/**
 * A wrapper around React.lazy that ensures a component is shown for a minimum duration.
 * This prevents a "flash" of the loading indicator for very fast loads.
 * @param {Promise} factory - The import() promise from the component to be loaded.
 * @param {number} minDuration - The minimum duration in milliseconds to show the fallback.
 * @returns {React.Component} A lazy-loaded React component.
 */
export const lazyWithMinDuration = (factory, minDuration = 500) => {
  return lazy(() =>
    Promise.all([
      factory(),
      new Promise((resolve) => setTimeout(resolve, minDuration)),
    ]).then(([moduleExports]) => moduleExports)
  );
};
