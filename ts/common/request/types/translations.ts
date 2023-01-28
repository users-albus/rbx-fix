/**
 * Translations
 */

import { EnvironmentUrls } from "Roblox";
import UrlConfig from "../../../../../../Roblox.CoreScripts.WebApp/Roblox.CoreScripts.WebApp/js/core/http/interfaces/UrlConfig";

const URL_NOT_FOUND = "URL_NOT_FOUND";
const domainUrl = EnvironmentUrls.domain ?? URL_NOT_FOUND;

// TODO: Add this URL to be populated in EnvironmentUrls (in `web-platform`).
const translationsApiUrl = `https://translations.${domainUrl}`;

// TODO: Add more locales here as necessary. We include `EN_US` by default since
// it is used as the fallback locale if getting language resources fails the
// first time. Corresponds to `SupportedLocaleEnum.cs` on the back-end.
export enum TranslationsLocale {
  EN_US = "en_us",
}

export enum TranslationsError {
  UNKNOWN = 0,
  INVALID_LOCALE = 1,
  CONSUMER_TYPE_NOT_SUPPORTED = 2,
  TRANSLATIONS_DO_NOT_EXIST = 3,
  FEATURE_DISABLED = 4,
}

export enum ConsumerType {
  Web = "Web",
}

/**
 * Request Type: `GET`.
 */
export const GET_LANGUAGE_RESOURCES_CONFIG: UrlConfig = {
  withCredentials: true,
  url: `${translationsApiUrl}/v1/translations/language-resources`,
  timeout: 60000,
};

export type GetLanguageResourcesReturnType<K extends ReadonlyArray<string>> = {
  [key in K[number]]: string;
};
