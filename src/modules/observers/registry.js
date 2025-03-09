/**
 * Observer Registry
 * Manages all observers in the application
 */

/**
 * Registry of all observers
 * @type {Object.<string, Object>}
 */
const observerRegistry = {};

/**
 * Registers an observer in the registry
 * @param {Object} observer - Observer object with name, start, and stop methods
 */
export const register = (observer) => {
  if (!observer || !observer.name) {
    console.error('[ObserverRegistry] Cannot register observer without a name');
    return;
  }
  
  observerRegistry[observer.name] = observer;
};

/**
 * Starts an observer by name
 * @param {string} name - Name of the observer to start
 * @returns {boolean} - Success status
 */
export const startObserver = (name) => {
  const observer = observerRegistry[name];
  if (!observer) {
    console.warn(`[ObserverRegistry] Observer '${name}' not found`);
    return false;
  }
  
  return observer.start();
};

/**
 * Stops an observer by name
 * @param {string} name - Name of the observer to stop
 * @returns {boolean} - Success status
 */
export const stopObserver = (name) => {
  const observer = observerRegistry[name];
  if (!observer) {
    console.warn(`[ObserverRegistry] Observer '${name}' not found`);
    return false;
  }
  
  return observer.stop();
};

/**
 * Starts all observers that match the given condition
 * @param {Function} [condition] - Optional function to filter which observers to start
 */
export const startAll = (condition) => {
  Object.values(observerRegistry).forEach(observer => {
    if (!condition || condition(observer)) {
      observer.start();
    }
  });
};

/**
 * Stops all observers that match the given condition
 * @param {Function} [condition] - Optional function to filter which observers to stop
 */
export const stopAll = (condition) => {
  Object.values(observerRegistry).forEach(observer => {
    if (!condition || condition(observer)) {
      observer.stop();
    }
  });
};

/**
 * Gets an observer by name
 * @param {string} name - Name of the observer to get
 * @returns {Object|undefined} - The observer object or undefined if not found
 */
export const getObserver = (name) => {
  return observerRegistry[name];
};

/**
 * Gets all registered observers
 * @returns {Object.<string, Object>} - All registered observers
 */
export const getAllObservers = () => {
  return { ...observerRegistry };
}; 