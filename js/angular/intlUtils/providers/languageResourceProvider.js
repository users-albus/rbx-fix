import angular from "angular";
import { Intl, TranslationResourceProvider } from "Roblox";
import intlUtilsModule from "../intlUtilsModule";

function languageResourceProvider() {
  const intl = new Intl();
  const pageResources = {};
  let translationResources = null;
  let isTranslationResourceInitialized = false;

  // this will be deleted after rollout
  const getFromLangObject = (resourceKey, params) => {
    let translatedText = pageResources[resourceKey];
    if (!translatedText) {
      // eslint-disable-next-line no-console
      console.warn(
        `Language key '${resourceKey}' not found. Please check for any typo or a missing key.`
      );
      translatedText = "";
    } else if (params && Object.keys(params).length > 0) {
      translatedText = intl.f(translatedText, params);
    }

    return translatedText;
  };

  const getFromTranslationResources = (resourceKey, params) => {
    if (translationResources === null) {
      throw new Error("Translation resources is not properly initialized");
    }

    // delegate to the combined translation resources
    return translationResources.get(resourceKey, params);
  };

  this.setLanguageKeysFromFile = (keys) => {
    if (keys && typeof keys === "object" && !Array.isArray(keys)) {
      angular.extend(pageResources, keys);
    }
  };

  this.setTranslationResources = (resources) => {
    const combinedTranslationResources =
      TranslationResourceProvider.combineTranslationResources(
        intl,
        ...resources
      );

    if (translationResources !== null) {
      translationResources =
        TranslationResourceProvider.combineTranslationResources(
          intl,
          translationResources,
          combinedTranslationResources
        );
    } else {
      translationResources = combinedTranslationResources;
      isTranslationResourceInitialized = true;
    }
  };

  this.$get = [
    function languageResource() {
      return {
        get: isTranslationResourceInitialized
          ? getFromTranslationResources
          : getFromLangObject,
        intl,
      };
    },
  ];
}

intlUtilsModule.provider("languageResource", languageResourceProvider);

export default languageResourceProvider;
