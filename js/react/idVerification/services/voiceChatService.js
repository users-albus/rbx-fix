import { httpService } from "core-utilities";
import { eventStreamService } from "core-roblox-utilities";
import {
  getShowOverlayUrlConfig,
  getPostOptUserInToVoiceChatUrlConfig,
  getRecordUserSeenUpsellModalUrlConfig,
} from "../constants/urlConstants";
import { ModalEvent } from "../constants/viewConstants";

export const postShowOverlay = (showOverlay) => {
  const urlConfig = getShowOverlayUrlConfig();
  const params = {
    showOverlay,
  };
  return httpService.post(urlConfig, params).then(({ data }) => {
    return data;
  });
};

export const postOptUserInToVoiceChat = (
  isUserOptIn,
  isOptedInThroughUpsell
) => {
  const urlConfig = getPostOptUserInToVoiceChatUrlConfig();
  const params = {
    isUserOptIn,
    isOptedInThroughUpsell,
  };
  // This endpoint returns isUserOptIn which will match the input params if successful.
  return httpService.post(urlConfig, params).then(({ data }) => {
    return data;
  });
};

export const recordUserSeenUpsellModal = () => {
  const urlConfig = getRecordUserSeenUpsellModalUrlConfig();
  const params = {};

  return httpService.post(urlConfig, params).then(({ data }) => {
    return data;
  });
};

export const showVoiceOptInOverlay = (
  requireExplicitVoiceConsent,
  useExitBetaLanguage
) =>
  new Promise((resolve) => {
    const event = new CustomEvent(ModalEvent.OpenVoiceOptInOverlay, {
      detail: {
        closeCallback: (success) => {
          resolve(success);
        },
        requireExplicitVoiceConsent,
        useExitBetaLanguage,
      },
    });
    window.dispatchEvent(event);
  });

export const sendVoiceChatEvent = (event) => {
  eventStreamService.sendEventWithTarget(event.type, event.context, {
    ...event.params,
  });
};
