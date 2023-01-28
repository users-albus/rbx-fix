import { urlService } from "core-utilities";
import { locale, localeParamName } from "../constants/localization";

const localization = {
  getLocale: () => {
    const _locale = urlService ? urlService.getQueryParam(locale) : null;
    if (typeof _locale === "string") {
      return encodeURIComponent(_locale);
    } else if (Array.isArray(_locale)) {
      return encodeURIComponent(_locale[0]);
    }
    return null;
  },
  buildLinkWithLocale: (url: string, locale: string) => {
    if (locale) {
      return url + localeParamName + locale;
    }

    return url;
  },
};

export default localization;
