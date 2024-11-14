import state from "./state";
import config from "./config";
import {
  processChatMessage,
  getElementText,
  checkTTSFilteredWords,
  displayCurrentTankTime,
  displayUserNameOverlay,
  toggleNavigationOverlay,
  toggleTokenConversion,
  toggleControlOverlay,
  createEventLogEntry,
  hideToastMessage,
  hideGiftMessage,
} from "./functions";
import ELEMENTS from "../data/elements";
import { makeDraggable } from "./events";

const observers = {
  chat: {
    start: () => {
      state.get("observers").chat?.disconnect();

      const chat = document.querySelector(ELEMENTS.chat.list.selector);

      const chatObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.type !== "childList" ||
            mutation.addedNodes.length === 0
          ) {
            return;
          }

          mutation.addedNodes.forEach((addedNode) => {
            processChatMessage(addedNode);
          });
        });
      });

      chatObserver.observe(chat, { childList: true });

      state.set("observers", { ...state.get("observers"), chat: chatObserver });
    },

    stop: () => {
      const observers = state.get("observers");
      observers.chat?.disconnect();
    },
  },

  chatters: {
    start: () => {
      state.get("observers").chatters?.disconnect();

      const chatters = document.querySelector(
        `#${ELEMENTS.chat.header.presence.id}`
      );

      const chattersObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          const chattersOnlineNew = document.querySelector(
            ELEMENTS.chat.header.presence.online.selector
          );

          const text =
            mutation.type === "childList"
              ? mutation.target.textContent
              : mutation.target.wholeText;

          chattersOnlineNew.textContent = text;
        });
      });

      chattersObserver.observe(chatters, {
        childList: true,
        characterData: true,
        subtree: true,
      });

      state.set("observers", {
        ...state.get("observers"),
        chatters: chattersObserver,
      });
    },

    stop: () => {
      const observers = state.get("observers");
      observers.chatters?.disconnect();
    },
  },

  modal: {
    start: () => {
      state.get("observers").modal?.disconnect();

      const nextElement = document.getElementById("__next");

      const modalObserver = new MutationObserver(async (mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.type !== "childList" ||
            mutation.addedNodes.length === 0
          ) {
            return;
          }

          mutation.addedNodes.forEach((addedNode) => {
            if (addedNode.innerHTML.includes("Application error:")) {
              addedNode.innerHTML =
                addedNode.innerHTML +
                `<div style="background-color: rgba(0,0,0,0.5); padding: 10px; width: 775px; line-height: 1em; color: red; font-weight: 900; font-size: 2em; text-shadow: 0 0 3px maroon">MAEJOK-TOOLS NOTICE</div><div style="background-color: rgba(0,0,0,0.5); width: 775px; color: #ff7b7b; font-weight: 900; padding: 10px; text-shadow: 0 0 6px black">Something happened and the site crashed...<br/><br/>Please, for the love of everything holy, DISABLE MAEJOK-TOOLS AND CONFIRM THE PLUGIN IS NOT THE CAUSE OF THE ERROR *BEFORE* MAKING ANY BUG REPORTS<br/><br/>If the error no longer exists after disabling the plugin, <a href="https://github.com/f3rked/maej3rked-tools/issues" target="_blank" style="color: #4747ff;">report the bug on GitHub</a>. <br/><br/>However, if, AND ONLY IF, the error persists after fully disabling MAEJOK-TOOLS from within your UserScript extension, you may report the bug on <a href="https://fishtank.guru/" target="_blank" style="color: #4747ff;">the fishtank.guru discord.</a><br/><br/>DO NOT <u><b>UNDER ANY CIRCUMSTANCE</u></b> CONTACT WES, JET, FISHTANK STAFF OR ANYONE ELSE ABOUT A BUGS CAUSED BY MAEJOK-TOOLS!</div>`;
            }

            if (addedNode.id === "modal") {
              checkTTSFilteredWords(addedNode);

              const title = getElementText(ELEMENTS.modal.title.text.selector);

              const hideMissionsEnabled = config.get("hideGlobalMissions");
              if (hideMissionsEnabled && title?.includes("Global Mission")) {
                addedNode.setAttribute("style", "display: none !important");
              }

              const dragModalEnabled = config.get("enableDragModal");
              if (
                dragModalEnabled &&
                (title?.includes("Send a TTS Message") ||
                  title?.includes("Play a Sound Effect"))
              ) {
                makeDraggable(addedNode);
              }
            }

            if (
              config.get("enableEventsLog") &&
              addedNode.className.includes("toast")
            ) {
              createEventLogEntry(addedNode);
            }

            if (
              config.get("hideToastMessages") &&
              addedNode.className.includes("toast")
            ) {
              hideToastMessage(addedNode);
            }

            if (
              config.get("hideGiftedPassMessage") &&
              addedNode.className.includes("toast")
            ) {
              hideGiftMessage(addedNode);
            }
          });
        });
      });

      modalObserver.observe(nextElement, { childList: true });

      state.set("observers", {
        ...state.get("observers"),
        modal: modalObserver,
      });
    },

    stop: () => {
      const observers = state.get("observers");
      observers.modal?.disconnect();
    },
  },
  home: {
    start: () => {
      state.get("observers").home?.disconnect();

      const mainPanel = document.getElementById("main-panel");

      const mainPanelObserver = new MutationObserver(async (mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.type !== "childList" ||
            mutation.addedNodes.length === 0
          ) {
            return;
          }

          const livestreamAdded = mutation.addedNodes[0].classList?.contains(
            ELEMENTS.livestreams.player.class
          );

          const playerControlsAdded =
            mutation.addedNodes[0].classList?.contains(
              "livepeer-video-player_controls__y36El"
            );

          if (!livestreamAdded && !playerControlsAdded) {
            return;
          }

          const controlOverlayEnabled = config.get("enableControlOverlay");
          const timestampOverlayEnabled = config.get("enableTimestampOverlay");
          const userOverlayEnabled = config.get("enableUserOverlay");
          const hideNavigationOverlayEnabled = config.get(
            "hideNavigationOverlayEnabled"
          );

          if (
            !controlOverlayEnabled &&
            !timestampOverlayEnabled &&
            !userOverlayEnabled &&
            !hideNavigationOverlayEnabled
          ) {
            return;
          }

          mutation.addedNodes.forEach((addedNode) => {
            if (livestreamAdded) {
              const liveStreamPanel = document.querySelector(
                ELEMENTS.livestreams.selected.selector
              );

              if (!liveStreamPanel) {
                return;
              }

              if (timestampOverlayEnabled) {
                displayCurrentTankTime();
              }

              if (userOverlayEnabled) {
                displayUserNameOverlay();
              }

              if (hideNavigationOverlayEnabled) {
                toggleNavigationOverlay(true);
              }
            }

            if (playerControlsAdded && controlOverlayEnabled) {
              toggleControlOverlay(state.get("controlOverlayDisabled"));
            }
          });
        });
      });

      mainPanelObserver.observe(mainPanel, {
        childList: true,
        subtree: true,
      });

      state.set("observers", {
        ...state.get("observers"),
        home: mainPanelObserver,
      });
    },

    stop: () => {
      const observers = state.get("observers");
      observers.home?.disconnect();
    },
  },

  body: {
    start: () => {
      state.get("observers").body?.disconnect();

      const body = document.querySelector("body");

      const bodyObserver = new MutationObserver(async (mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.type !== "childList" ||
            mutation.addedNodes.length === 0
          ) {
            return;
          }

          if (
            mutation.addedNodes[0]?.className.includes(
              "global-mission-modal_backdrop__oVezg"
            )
          ) {
            mutation.addedNodes[0].setAttribute(
              "style",
              "display: none !important"
            );
          }
        });
      });

      bodyObserver.observe(body, { childList: true });

      state.set("observers", {
        ...state.get("observers"),
        body: bodyObserver,
      });
    },

    stop: () => {
      const observers = state.get("observers");
      observers.body?.disconnect();
    },
  },

  tokens: {
    start: () => {
      if (state.get("observers").tokensActive) return; // Only start if tokens observer is inactive

      state.get("observers").tokens?.disconnect();

      const tokenObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (
                (node.matches(
                  `${ELEMENTS.token.topBarUserTokens.selector}, ${ELEMENTS.token.ttsModalTokens.selector}, ${ELEMENTS.token.sfxModalTokens.selector}, ${ELEMENTS.token.toysFishtoysTokens.selector}, ${ELEMENTS.token.buyTokensModal.selector}, ${ELEMENTS.token.voteModalTokens.selector} span`
                ) || node.querySelector(
                  `${ELEMENTS.token.topBarUserTokens.selector}, ${ELEMENTS.token.ttsModalTokens.selector}, ${ELEMENTS.token.sfxModalTokens.selector}, ${ELEMENTS.token.toysFishtoysTokens.selector}, ${ELEMENTS.token.buyTokensModal.selector}, ${ELEMENTS.token.voteModalTokens.selector} span`
                )) &&
                !node.closest(
                  `.${ELEMENTS.token.toysBigToyPrice.classes[0]}.${ELEMENTS.token.toysBigToyPrice.classes[1]}`
                )
              ) {
                toggleTokenConversion(config.get("convertTokenValues"));
              }
            }
          });
        });
      });

      tokenObserver.observe(document.body, { childList: true, subtree: true });

      state.set("observers", {
        ...state.get("observers"),
        tokens: tokenObserver,
        tokensActive: true,
      });
    },

    stop: () => {
      const observers = state.get("observers");
      observers.tokens?.disconnect();
      state.set("observers", { ...observers, tokensActive: false }); 
    },
  },
};

export default observers;
