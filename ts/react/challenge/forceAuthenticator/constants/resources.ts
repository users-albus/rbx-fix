import { FORCE_AUTHENTICATOR_LANGUAGE_RESOURCES } from "../app.config";

/**
 * A type adapted from the base type of `translate`, which we use to limit the
 * keys that can be translated.
 */
type TranslateFunction = (
  resourceId: (typeof FORCE_AUTHENTICATOR_LANGUAGE_RESOURCES)[number],
  parameters?: Record<string, unknown>
) => string;

// IMPORTANT: Add resource keys to `app.config.ts` as well.
export const getResources = (translate: TranslateFunction) =>
  ({
    Description: {
      SetupAuthenticator: translate("Description.SetupAuthenticator"),
      Reason: translate("Description.Reason"),
    },
    Header: {
      TurnOnAuthenticator: translate("Header.TurnOnAuthenticator"),
    },
    Action: {
      Setup: translate("Action.Setup"),
    },
  } as const);

export type ForceAuthenticatorResources = ReturnType<typeof getResources>;
