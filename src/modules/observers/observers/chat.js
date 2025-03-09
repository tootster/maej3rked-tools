/**
 * Chat Observer
 * Observes the chat list for new messages
 */

import { createObserver } from "../factory";
import { handleChatMutations } from "../handlers/chat";
import ELEMENTS from "../../../data/elements";

/**
 * Creates a chat observer
 * @returns {Object} - Chat observer instance
 */
export const createChatObserver = () => {
  return createObserver(
    "chat", 
    handleChatMutations, 
    {
      selector: ELEMENTS.chat.list.selector,
      config: { childList: true }
    }
  );
}; 