import { httpService } from "core-utilities";
import { eventStreamService } from "core-roblox-utilities";
import {
  startVeriffIdVerificationUrlConfig,
  getVerificationStatusUrlConfig,
  getVerifiedAgeUrlConfig,
} from "../constants/urlConstants";
import { ModalEvent } from "../constants/viewConstants";

export const startVeriffIdVerification = (isUniversalApp) => {
  const urlConfig = startVeriffIdVerificationUrlConfig();
  const params = {
    generateLink: isUniversalApp,
  };
  return httpService.post(urlConfig, params).then(
    ({ data }) => {
      return data;
    },
    () => {
      return false;
    }
  );
};

export const getVerifiedAge = () => {
  const urlConfig = getVerifiedAgeUrlConfig();
  return httpService.get(urlConfig).then(({ data }) => {
    return data;
  });
};

export const getVerificationStatus = (token) => {
  const urlConfig = getVerificationStatusUrlConfig();
  const params = {
    token,
  };
  return httpService.get(urlConfig, params).then(({ data }) => {
    return data;
  });
};

export const sendIdVerificationEvent = (event, params) => {
  eventStreamService.sendEventWithTarget(event.type, event.context, {
    ...event.params,
    origin: params.origin,
  });
};

export const startVerificationFlow = () =>
  new Promise((resolve) => {
    const event = new CustomEvent(ModalEvent.OpenIdentityVerificationModal, {
      detail: {
        successCallback: (isUserOldEnough, didVerifyAge) => {
          resolve([isUserOldEnough, didVerifyAge]);
        },
      },
    });
    window.dispatchEvent(event);
  });

export const showBirthdayChangeWarning = () =>
  new Promise((resolve) => {
    const event = new CustomEvent(ModalEvent.OpenBirthdayChangeWarning, {
      detail: {
        closeCallback: (confirmChange) => {
          resolve(confirmChange);
        },
      },
    });
    window.dispatchEvent(event);
  });
