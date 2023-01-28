import * as Reauthentication from "../../../../common/request/types/reauthentication";
import { REAUTHENTICATION_LANGUAGE_RESOURCES } from "../app.config";
import { ErrorCode } from "../interface";

/**
 * A type adapted from the base type of `translate`, which we use to limit the
 * keys that can be translated.
 */
type TranslateFunction = (
  resourceId: (typeof REAUTHENTICATION_LANGUAGE_RESOURCES)[number],
  parameters?: Record<string, unknown>
) => string;

// IMPORTANT: Add resource keys to `app.config.ts` as well.
export const getResources = (translate: TranslateFunction) =>
  ({
    Action: {
      // IMPORTANT: Do not inject user input into this variable; this content is
      // rendered as HTML.
      ForgotYourPassword: (linkStart: string, linkEnd: string) =>
        translate("Action.ForgotYourPassword", {
          linkStart,
          linkEnd,
        }),
      PleaseTryAgain: translate("Action.PleaseTryAgain"),
      Verify: translate("Action.Verify"),
    },
    Description: {
      EnterYourPassword: translate("Description.EnterYourPassword"),
    },
    Header: {
      PasswordVerification: translate("Header.PasswordVerification"),
    },
    Label: {
      YourPassword: translate("Label.YourPassword"),
    },
    Message: {
      Error: {
        Default: translate("Message.Error.Default"),
        PasswordIncorrect: translate("Message.Error.PasswordIncorrect"),
      },
    },
  } as const);

export type ReauthenticationResources = ReturnType<typeof getResources>;

export const mapChallengeErrorCodeToResource = (
  resources: ReauthenticationResources,
  errorCode: ErrorCode
): string => {
  switch (errorCode) {
    default:
      return resources.Message.Error.Default;
  }
};

export const mapReauthenticationErrorToResource = (
  resources: ReauthenticationResources,
  error: Reauthentication.ReauthenticationError | null
): string => {
  switch (error) {
    case Reauthentication.ReauthenticationError.PASSWORD_INCORRECT:
      return resources.Message.Error.PasswordIncorrect;
    default:
      return resources.Message.Error.Default;
  }
};

export const mapReauthenticationErrorToChallengeErrorCode = (
  error: Reauthentication.ReauthenticationError | null
): ErrorCode => {
  switch (error) {
    default:
      return ErrorCode.UNKNOWN;
  }
};
