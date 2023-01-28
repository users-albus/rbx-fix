import { eventStreamService } from "core-roblox-utilities";
import EVENT_CONSTANTS from "../../common/constants/eventsConstants";
import { counters } from "../constants/signupConstants";
import RobloxEventTracker from "../../common/eventTracker";

const { eventTypes } = eventStreamService;

export const incrementEphemeralCounter = (eventName: string): void => {
  if (RobloxEventTracker && eventName) {
    RobloxEventTracker.fireEvent(counters.prefix + eventName);
  }
};

export const sendConversionEvent = (callback: () => void): void => {
  const gtag = window.gtag || null;
  if (typeof gtag === "undefined" || !gtag || !gtag.conversionEvents) {
    callback();
    return;
  }
  // In case gtag fails
  const id = setTimeout(callback, 2000);
  gtag("event", "conversion", {
    send_to: gtag.conversionEvents.signupConversionEvent,
    event_callback() {
      clearTimeout(id);
      callback();
    },
    event_timeout: 2000,
  });
};

export const sendSignupButtonClickEvent = (): void => {
  eventStreamService.sendEventWithTarget(
    eventTypes.formInteraction,
    EVENT_CONSTANTS.context.signupForm,
    {
      field: EVENT_CONSTANTS.field.signupSubmitButtonName,
      aType: EVENT_CONSTANTS.aType.click,
    }
  );
};

export const sendAppClickEvent = (appName: string): void => {
  eventStreamService.sendEventWithTarget(
    eventTypes.formInteraction,
    EVENT_CONSTANTS.context.landingPage,
    {
      field: appName + EVENT_CONSTANTS.field.appButtonClickName,
      aType: EVENT_CONSTANTS.aType.click,
    }
  );
};

export const incrementSignUpSubmitCounters = (
  isFirstSignUpSubmit: boolean
): void => {
  incrementEphemeralCounter(counters.attempt);

  if (isFirstSignUpSubmit) {
    incrementEphemeralCounter(counters.firstAttempt);
  }
};

type TSignupFormInteractionEventInput = {
  field: string;
  aType: string;
};

const sendSignupFormInteractionEvent = (
  param: TSignupFormInteractionEventInput
) => {
  eventStreamService.sendEventWithTarget(
    eventTypes.formInteraction,
    EVENT_CONSTANTS.context.signupForm,
    {
      field: param.field,
      aType: param.aType,
    }
  );
};

export const sendDayFocusEvent = (): void => {
  sendSignupFormInteractionEvent({
    field: EVENT_CONSTANTS.field.birthdayDay,
    aType: EVENT_CONSTANTS.aType.focus,
  });
};

export const sendDayOffFocusEvent = (): void => {
  sendSignupFormInteractionEvent({
    field: EVENT_CONSTANTS.field.birthdayDay,
    aType: EVENT_CONSTANTS.aType.offFocus,
  });
};

export const sendMonthFocusEvent = (): void => {
  sendSignupFormInteractionEvent({
    field: EVENT_CONSTANTS.field.birthdayMonth,
    aType: EVENT_CONSTANTS.aType.focus,
  });
};

export const sendMonthOffFocusEvent = (): void => {
  sendSignupFormInteractionEvent({
    field: EVENT_CONSTANTS.field.birthdayMonth,
    aType: EVENT_CONSTANTS.aType.offFocus,
  });
};

export const sendYearFocusEvent = (): void => {
  sendSignupFormInteractionEvent({
    field: EVENT_CONSTANTS.field.birthdayYear,
    aType: EVENT_CONSTANTS.aType.focus,
  });
};

export const sendYearOffFocusEvent = (): void => {
  sendSignupFormInteractionEvent({
    field: EVENT_CONSTANTS.field.birthdayYear,
    aType: EVENT_CONSTANTS.aType.offFocus,
  });
};

export const sendUsernameFocusEvent = (): void => {
  sendSignupFormInteractionEvent({
    field: EVENT_CONSTANTS.field.signupUsername,
    aType: EVENT_CONSTANTS.aType.focus,
  });
};

export const sendUsernameOffFocusEvent = (): void => {
  sendSignupFormInteractionEvent({
    field: EVENT_CONSTANTS.field.signupUsername,
    aType: EVENT_CONSTANTS.aType.offFocus,
  });
};

export const sendPasswordFocusEvent = (): void => {
  sendSignupFormInteractionEvent({
    field: EVENT_CONSTANTS.field.signupPassword,
    aType: EVENT_CONSTANTS.aType.focus,
  });
};

export const sendPasswordOffFocusEvent = (): void => {
  sendSignupFormInteractionEvent({
    field: EVENT_CONSTANTS.field.signupPassword,
    aType: EVENT_CONSTANTS.aType.offFocus,
  });
};

export const sendMaleGenderFocusEvent = (): void => {
  sendSignupFormInteractionEvent({
    field: EVENT_CONSTANTS.field.genderMale,
    aType: EVENT_CONSTANTS.aType.focus,
  });
};

export const sendMaleGenderOffFocusEvent = (): void => {
  sendSignupFormInteractionEvent({
    field: EVENT_CONSTANTS.field.genderMale,
    aType: EVENT_CONSTANTS.aType.offFocus,
  });
};

export const sendFemaleGenderFocusEvent = (): void => {
  sendSignupFormInteractionEvent({
    field: EVENT_CONSTANTS.field.genderFemale,
    aType: EVENT_CONSTANTS.aType.focus,
  });
};

export const sendFemaleGenderOffFocusEvent = (): void => {
  sendSignupFormInteractionEvent({
    field: EVENT_CONSTANTS.field.genderFemale,
    aType: EVENT_CONSTANTS.aType.offFocus,
  });
};

const sendKoreaEmailFocusEvent = (): void => {
  eventStreamService.sendEventWithTarget(
    eventTypes.formInteraction,
    EVENT_CONSTANTS.context.signupForm,
    {
      origin: EVENT_CONSTANTS.origin.webVerifiedSignup,
      field: EVENT_CONSTANTS.field.parentEmail,
    }
  );
};

export const sendEmailFocusEvent = (): void => {
  sendSignupFormInteractionEvent({
    field: EVENT_CONSTANTS.field.signupEmail,
    aType: EVENT_CONSTANTS.aType.focus,
  });
  // the angular implmentation sends two events for email focus, one from the directive for the email field
  // and another to indicate that it comes from the korea id verification flow
  sendKoreaEmailFocusEvent();
};

export const sendEmailOffFocusEvent = (): void => {
  sendSignupFormInteractionEvent({
    field: EVENT_CONSTANTS.field.signupEmail,
    aType: EVENT_CONSTANTS.aType.offFocus,
  });
};

export const sendShowPasswordButtonClickEvent = (): void => {
  eventStreamService.sendEventWithTarget(
    eventTypes.buttonClick,
    EVENT_CONSTANTS.context.signupForm,
    {
      field: EVENT_CONSTANTS.field.showPassword,
    }
  );
};

export const sendHidePasswordButtonClickEvent = (): void => {
  eventStreamService.sendEventWithTarget(
    eventTypes.buttonClick,
    EVENT_CONSTANTS.context.signupForm,
    {
      field: EVENT_CONSTANTS.field.hidePassword,
    }
  );
};

export const sendUsernameValidationEvent = (
  input: string,
  message: string
): void => {
  eventStreamService.sendEventWithTarget(
    EVENT_CONSTANTS.eventName.formValidation,
    EVENT_CONSTANTS.context.signupForm,
    {
      input,
      msg: message,
      field: EVENT_CONSTANTS.field.signupUsername,
    }
  );
};

export const sendPasswordValidationEvent = (message: string): void => {
  eventStreamService.sendEventWithTarget(
    EVENT_CONSTANTS.eventName.formValidation,
    EVENT_CONSTANTS.context.signupForm,
    {
      input: EVENT_CONSTANTS.input.redacted,
      msg: message,
      field: EVENT_CONSTANTS.field.signupUsername,
    }
  );
};

export const sendEmailValidationEvent = (
  input: string,
  message: string
): void => {
  eventStreamService.sendEventWithTarget(
    EVENT_CONSTANTS.eventName.formValidation,
    EVENT_CONSTANTS.context.signupForm,
    {
      input,
      msg: message,
      field: EVENT_CONSTANTS.field.signupEmail,
    }
  );
};

export default {
  incrementEphemeralCounter,
  sendConversionEvent,
  sendSignupButtonClickEvent,
  sendAppClickEvent,
  incrementSignUpSubmitCounters,
};
