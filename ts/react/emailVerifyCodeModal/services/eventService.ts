import { eventStreamService } from "core-roblox-utilities";
import EVENT_CONSTANTS from "../../common/constants/eventsConstants";

const { eventTypes } = eventStreamService;

export const sendOtpPageLoadEvent = (ctx: string): void => {
  eventStreamService.sendEventWithTarget(eventTypes.pageLoad, ctx, {});
};

const sendOtpFormInteractionEvent = (
  ctx: string,
  field: string,
  btn?: string,
  atype?: string,
  errorCode?: string
): void => {
  const additionalProperties: Record<string, string> = {};
  additionalProperties.field = field;
  if (btn) {
    additionalProperties.btn = btn;
  }
  if (atype) {
    additionalProperties.atype = atype;
  }
  if (errorCode) {
    additionalProperties.errorCode = errorCode;
  }
  eventStreamService.sendEventWithTarget(
    eventTypes.formInteraction,
    ctx,
    additionalProperties
  );
};

export const sendEmailInputEvent = (): void => {
  sendOtpFormInteractionEvent(
    EVENT_CONSTANTS.context.sendOTP,
    EVENT_CONSTANTS.field.email
  );
};

export const sendCodeInputEvent = (): void => {
  sendOtpFormInteractionEvent(
    EVENT_CONSTANTS.context.enterOTP,
    EVENT_CONSTANTS.field.otpCode
  );
};

export const sendErrorEvent = (ctx: string, errorCode: string): void => {
  const btn =
    ctx === EVENT_CONSTANTS.context.enterOTP
      ? EVENT_CONSTANTS.btn.resendCode
      : undefined;
  sendOtpFormInteractionEvent(
    ctx,
    EVENT_CONSTANTS.field.errorMessage,
    btn,
    EVENT_CONSTANTS.aType.shown,
    errorCode
  );
};

export const sendOtpButtonClickEvent = (ctx: string, btn: string): void => {
  eventStreamService.sendEventWithTarget(eventTypes.buttonClick, ctx, {
    btn,
  });
};
