import { TranslationConfig } from "react-utilities";

export const FEATURE_NAME = "Reauthentication" as const;
export const LOG_PREFIX = "Re-authentication:" as const;

// Constants used in specific contexts:
// The URL of the Forgot Password support page.
export const FORGOT_PASSWORD_SUPPORT_URL =
  "https://en.help.roblox.com/hc/articles/203313070-I-Forgot-My-Password" as const;

/**
 * Translations required by this web app (remember to also edit
 * `bundle.config.js` if changing this configuration).
 */
export const TRANSLATION_CONFIG: TranslationConfig = {
  common: [],
  feature: "Feature.Reauthentication",
};

/**
 * Language resource keys for re-authentication that are requested dynamically.
 */
export const REAUTHENTICATION_LANGUAGE_RESOURCES = [
  "Action.ForgotYourPassword",
  "Action.PleaseTryAgain",
  "Action.Verify",
  "Description.EnterYourPassword",
  "Header.PasswordVerification",
  "Label.YourPassword",
  "Message.Error.Default",
  "Message.Error.PasswordIncorrect",
] as const;
