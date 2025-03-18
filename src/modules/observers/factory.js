/**
 * Observer Factory
 * Creates standardized MutationObserver instances with consistent patterns
 */

import state from "../state";

/**
 * Creates a new observer with standardized configuration
 * @param {string} name - Unique name for the observer
 * @param {Function} callback - Callback function to handle mutations
 * @param {Object} options - Configuration options
 * @param {string} options.selector - CSS selector for the target element
 * @param {Object} options.config - MutationObserver configuration
 * @returns {Object} - Observer control object with start and stop methods
 */
export const createObserver = (name, callback, options) => {
  const { selector, config = { childList: true } } = options;

  return {
    name,
    
    /**
     * Starts the observer
     * @returns {boolean} - Success status
     */
    start: () => {
      try {
        // Disconnect existing observer if it exists
        const existingObserver = state.get("observers")?.[name];
        if (existingObserver) {
          existingObserver.disconnect();
        }

        // Find target element
        const target = document.querySelector(selector);
        if (!target) {
          console.warn(`[Observer] Target element not found for ${name} observer: ${selector}`);
          return false;
        }

        // Create and start observer
        const observer = new MutationObserver(callback);
        observer.observe(target, config);

        // Store observer in state
        state.set("observers", { 
          ...state.get("observers") || {}, 
          [name]: observer 
        });
        
        return true;
      } catch (error) {
        console.error(`[Observer] Error starting ${name} observer:`, error);
        return false;
      }
    },

    /**
     * Stops the observer
     * @returns {boolean} - Success status
     */
    stop: () => {
      try {
        const observer = state.get("observers")?.[name];
        if (observer) {
          observer.disconnect();
          return true;
        }
        return false;
      } catch (error) {
        console.error(`[Observer] Error stopping ${name} observer:`, error);
        return false;
      }
    }
  };
}; 