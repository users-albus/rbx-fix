import { UrlParser } from "Roblox";
import { urlService } from "core-utilities";
import { RETURNURL } from "../constants/browserConstants";

export const getUrlParamValue = (name: string): string | null => {
  if (!UrlParser) {
    return null;
  }
  const result = UrlParser.getParameterValueByName(name, false);
  return result ? encodeURIComponent(result) : result;
};

export const navigateToPage = (pageUrl: string): void => {
  window.location.href = pageUrl;
};

// create signup url with return url param
export const buildSignupRedirUrl = (): string => {
  const returnUrl = getUrlParamValue(RETURNURL);
  if (returnUrl) {
    const parsedParams = {
      ReturnUrl: returnUrl,
    };
    const signupRedirUrl = urlService.getUrlWithQueries(
      "/account/signupredir",
      parsedParams
    );
    return signupRedirUrl;
  }
  return urlService.getAbsoluteUrl("/");
};
