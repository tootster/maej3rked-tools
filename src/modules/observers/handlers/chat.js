/**
 * Chat Observer Handler
 * Processes mutations from the chat observer
 */

import { processChatMessage } from "../../functions";

/**
 * Handles mutations from the chat observer
 * @param {MutationRecord[]} mutations - Array of mutation records
 */
export const handleChatMutations = (mutations) => {
  mutations.forEach((mutation) => {
    // Skip if not a childList mutation or no nodes were added
    if (mutation.type !== "childList" || mutation.addedNodes.length === 0) {
      return;
    }

    // Process each node that was added to the chat
    mutation.addedNodes.forEach((addedNode) => {
      processChatMessage(addedNode);
    });
  });
}; 