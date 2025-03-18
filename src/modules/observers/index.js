/**
 * Observers Module
 * Manages DOM observers for the application
 */

import * as registry from "./registry";
import { createChatObserver } from "./observers/chat";

// Create and register observers
const chatObserver = createChatObserver();
registry.register(chatObserver);

// Export a backwards-compatible API
const observers = {
  chat: {
    start: () => registry.startObserver("chat"),
    stop: () => registry.stopObserver("chat"),
  },
};

// Additional utility functions
observers.startAll = registry.startAll;
observers.stopAll = registry.stopAll;

export default observers; 