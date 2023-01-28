import { TranslationConfig } from "react-utilities";

export const FEATURE_NAME = "ForceAuthenticator" as const;
export const LOG_PREFIX = "ForceAuthenticator:" as const;

// This will be sent when we redirect to the account settings so that we
// know that it's a redirect and not an organic entry to the account settings.
export const REDIRECT_URL_SIGNIFIER = "forceauthenticator" as const;

// This is the 2-Step Verification path in Account Settings.
export const ACCOUNT_SETTINGS_SECURITY_PATH = "/my/account#!/security?src=";

/**
 * Translations required by this web app (remember to also edit
 * `bundle.config.js` if changing this configuration).
 */
export const TRANSLATION_CONFIG: TranslationConfig = {
  common: [],
  feature: "Feature.ForceAuthenticator",
};

/**
 * Language resource keys for force authenticator that are requested dynamically.
 */
export const FORCE_AUTHENTICATOR_LANGUAGE_RESOURCES = [
  "Action.Setup",
  "Description.Reason",
  "Description.SetupAuthenticator",
  "Header.TurnOnAuthenticator",
] as const;
