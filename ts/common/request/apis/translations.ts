/* eslint-disable import/prefer-default-export */
import { httpService } from "core-utilities";
import Roblox from "Roblox";
import { Result } from "../../result";
import { toResult } from "../common";
import * as Translations from "../types/translations";

/**
 * Falls back to `EN_US` locale if translations do not exist on the initial
 * request.
 */
const getLanguageResources = async <K extends ReadonlyArray<string>>(
  consumerType: Translations.ConsumerType,
  contentNamespace: string,
  keys: K,
  localeCode?: Translations.TranslationsLocale
): Promise<
  Result<
    Translations.GetLanguageResourcesReturnType<K>,
    Translations.TranslationsError | null
  >
> => {
  const result = await toResult<
    Translations.GetLanguageResourcesReturnType<K>,
    typeof Translations.TranslationsError
  >(
    httpService.get(Translations.GET_LANGUAGE_RESOURCES_CONFIG, {
      consumerType,
      contentNamespace,
      keys,
      localeCode,
    }),
    Translations.TranslationsError
  );

  // If the initial request failed due to invalid locale or missing translations
  // and a `EN_US` locale was not explicitly specified, retry the request with a
  // `EN_US` locale.
  if (
    result.isError &&
    (result.error === Translations.TranslationsError.INVALID_LOCALE ||
      result.error ===
        Translations.TranslationsError.TRANSLATIONS_DO_NOT_EXIST) &&
    localeCode !== Translations.TranslationsLocale.EN_US
  ) {
    return getLanguageResources(
      consumerType,
      contentNamespace,
      keys,
      Translations.TranslationsLocale.EN_US
    );
  }

  return result;
};

/**
 * A partial typing of the `Roblox` global that contains the `Lang` fields.
 */
type RobloxWithLangFields = {
  Lang?: Record<string, Record<string, string>>;
  LangDynamic?: Record<string, Record<string, string>>;
  LangDynamicDefault?: Record<string, Record<string, string>>;
};

/**
 * Requests language resources dynamically for a given namespace, patching
 * them into the appropriate global variable for our translation provider.
 */
export const queryAndOverwriteResourcesForNamespace = async <
  K extends ReadonlyArray<string>
>(
  namespace: string,
  keys: K,
  // Special parameter when we need to briefly bolt on additional translations
  // to a different namespace than what we query them from.
  destinationNamespace = namespace,
  forceMergeInsteadOfOverwrite = false
): Promise<Result<void, Translations.TranslationsError | null>> => {
  const result = await getLanguageResources(
    Translations.ConsumerType.Web,
    namespace,
    keys
  );
  if (result.isError) {
    return result;
  }

  // Monkey-patch the resources into `Roblox.LangDynamic`.
  const RobloxWithLangFields = (Roblox as RobloxWithLangFields) || {};
  RobloxWithLangFields.LangDynamic = RobloxWithLangFields.LangDynamic || {};
  if (destinationNamespace !== namespace || forceMergeInsteadOfOverwrite) {
    RobloxWithLangFields.LangDynamic[destinationNamespace] = {
      ...RobloxWithLangFields.LangDynamic[destinationNamespace],
      ...result.value,
    };
  } else {
    RobloxWithLangFields.LangDynamic[destinationNamespace] = result.value;
  }
  return Result.ok(undefined);
};
