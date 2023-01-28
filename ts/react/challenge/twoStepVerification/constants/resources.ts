import * as TwoStepVerification from "../../../../common/request/types/twoStepVerification";
import {
  TWO_STEP_VERIFICATION_LANGUAGE_RESOURCES,
  TWO_STEP_VERIFICATION_LANGUAGE_RESOURCES_NEW,
} from "../app.config";
import { ErrorCode } from "../interface";

/**
 * A type adapted from the base type of `translate`, which we use to limit the
 * keys that can be translated.
 */
type TranslateFunction = (
  resourceId:
    | (typeof TWO_STEP_VERIFICATION_LANGUAGE_RESOURCES)[number]
    | (typeof TWO_STEP_VERIFICATION_LANGUAGE_RESOURCES_NEW)[number],
  parameters?: Record<string, unknown>
) => string;

// IMPORTANT: Add resource keys to `app.config.ts` as well.
export const getResources = (translate: TranslateFunction) =>
  ({
    Action: {
      ChangeMediaType: translate("Action.ChangeMediaType"),
      Reload: translate("Action.Reload"),
      Resend: translate("Action.Resend"),
      Verify: translate("Action.Verify"),
    },
    Description: {
      SecurityWarningShort: translate("Description.SecurityWarningShort", {
        // No bolding of `IMPORTANT:` for now.
        boldStart: "",
        boldEnd: "",
      }),
      SecurityWarningShortBackupCodes: translate(
        "Description.SecurityWarningShortBackupCodes",
        {
          // No bolding of `IMPORTANT:` for now.
          boldStart: "",
          boldEnd: "",
        }
      ),
    },
    Label: {
      AuthenticatorMediaType: translate("Label.AuthenticatorMediaType"),
      ChooseAlternateMediaType: translate("Label.ChooseAlternateMediaType"),
      CharacterCodeInputPlaceholderText: (codeLength: number) =>
        translate("Label.CharacterCodeInputPlaceholderText", { codeLength }),
      CodeInputPlaceholderText: (codeLength: number) =>
        translate("Label.CodeInputPlaceholderText", { codeLength }),
      EmailMediaType: translate("Label.EmailMediaType"),
      EnterAuthenticatorCode: translate("Label.EnterAuthenticatorCode"),
      EnterEmailCode: translate("Label.EnterEmailCode"),
      EnterRecoveryCode: translate("Label.EnterRecoveryCode"),
      EnterTextCode: translate("Label.EnterTextCode"),
      // IMPORTANT: Do not inject user input into this variable; this content is
      // rendered as HTML.
      NeedHelpContactSupport: (supportLinkHtml: string) =>
        translate("Label.NeedHelpContactSupport", {
          supportLink: supportLinkHtml,
        }),
      RecoveryCodeMediaType: translate("Label.RecoveryCodeMediaType"),
      RobloxSupport: translate("Label.RobloxSupport"),
      SecurityKeyDirections: translate("Label.SecurityKeyDirections"),
      SecurityKeyMediaType: translate("Label.SecurityKeyMediaType"),
      SmsMediaType: translate("Label.SmsMediaType"),
      TrustThisDevice: translate("Label.TrustThisDevice"),
      TwoStepVerification: translate("Label.TwoStepVerification"),
      VerifyWithSecurityKey: translate("Label.VerifyWithSecurityKey"),
    },
    Response: {
      CodeSent: translate("Response.CodeSent"),
      DefaultError: translate("Response.DefaultError"),
      FeatureNotAvailable: translate("Response.FeatureNotAvailable"),
      InvalidCode: translate("Response.InvalidCode"),
      SessionExpired: translate("Response.SessionExpired"),
      SystemErrorSwitchingToEmail: translate(
        "Response.SystemErrorSwitchingToEmail"
      ),
      TooManyAttempts: translate("Response.TooManyAttempts"),
      VerificationError: translate("Response.VerificationError"),
    },
  } as const);

export type TwoStepVerificationResources = ReturnType<typeof getResources>;

export const mapChallengeErrorCodeToResource = (
  resources: TwoStepVerificationResources,
  errorCode: ErrorCode
): string => {
  switch (errorCode) {
    case ErrorCode.SESSION_EXPIRED:
      return resources.Response.SessionExpired;
    default:
      return resources.Response.DefaultError;
  }
};

export const mapTwoStepVerificationErrorToResource = (
  resources: TwoStepVerificationResources,
  error: TwoStepVerification.TwoStepVerificationError | null
): string => {
  switch (error) {
    case TwoStepVerification.TwoStepVerificationError.FEATURE_DISABLED:
      return resources.Response.FeatureNotAvailable;
    case TwoStepVerification.TwoStepVerificationError.INVALID_CODE:
      return resources.Response.InvalidCode;
    case TwoStepVerification.TwoStepVerificationError.TOO_MANY_REQUESTS:
      return resources.Response.TooManyAttempts;
    case TwoStepVerification.TwoStepVerificationError.INVALID_CHALLENGE_ID:
      return resources.Response.SessionExpired;
    default:
      return resources.Response.DefaultError;
  }
};

export const mapTwoStepVerificationErrorToChallengeErrorCode = (
  error: TwoStepVerification.TwoStepVerificationError | null
): ErrorCode => {
  switch (error) {
    case TwoStepVerification.TwoStepVerificationError.INVALID_CHALLENGE_ID:
      return ErrorCode.SESSION_EXPIRED;
    default:
      return ErrorCode.UNKNOWN;
  }
};
