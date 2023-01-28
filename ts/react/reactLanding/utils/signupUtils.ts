import {
  TValidateUsernameParams,
  TValidateUsernameResponse,
} from "../../common/types/signupTypes";
import {
  usernameValidationMessageMap,
  localeParamName,
  urlQueryNames,
  counters,
  newUserParam,
  urlConstants,
  validationMessages,
  validateUsernameContext,
} from "../constants/signupConstants";
import { validateUsername } from "../services/signupService";
import getInvalidUsernameMessage from "../../common/utils/usernameValidationUtils";
import getInvalidPasswordMessage from "../../common/utils/passwordValidationUtils";
import parseErrorCode from "../../common/utils/requestUtils";
import {
  getUrlParamValue,
  navigateToPage,
} from "../../common/utils/browserUtils";
import { cleanupIdentityVerificationResultToken } from "./identityVerificationUtils";
import {
  incrementEphemeralCounter,
  sendConversionEvent,
} from "../services/eventService";
import { landingPageContainer } from "../../common/constants/browserConstants";

const getErrorCodeFromValidateUsernameResponse = (
  response: TValidateUsernameResponse
): string => {
  let validationMessage = "";
  if (usernameValidationMessageMap.has(response.code)) {
    validationMessage = usernameValidationMessageMap.get(response.code)!;
  }
  return validationMessage;
};

export const getUsernameValidationMessage = async (
  username?: string,
  birthdayDay?: string,
  birthdayMonth?: string,
  birthdayYear?: string
): Promise<string> => {
  let localValidationMessage = "";
  let hasLocalValidationFailure = false;

  if (username === undefined || username === "") {
    hasLocalValidationFailure = true;
    localValidationMessage = validationMessages.usernameRequired;
  } else {
    localValidationMessage = getInvalidUsernameMessage(username);
    if (localValidationMessage !== "") {
      hasLocalValidationFailure = true;
    }
  }

  if (!birthdayDay || !birthdayMonth || !birthdayYear) {
    hasLocalValidationFailure = true;
    localValidationMessage = validationMessages.birthdayRequired;
  }

  if (hasLocalValidationFailure) {
    return localValidationMessage;
  }

  const validateUsernameParams: TValidateUsernameParams = {
    username: username!,
    context: validateUsernameContext,
  };

  const birthday = new Date(
    Date.parse(`${birthdayMonth!} ${birthdayDay!}, ${birthdayYear!}`)
  );

  if (!Number.isNaN(birthday.getMilliseconds())) {
    validateUsernameParams.birthday = birthday;
  }

  try {
    const validateUsernameResponse = await validateUsername(
      validateUsernameParams
    );
    return getErrorCodeFromValidateUsernameResponse(validateUsernameResponse);
  } catch (error) {
    const errorCode = parseErrorCode(error);
    if (errorCode === 2) {
      return validationMessages.birthdayRequired;
    }
  }
  return "";
};

export const getPasswordValidationMessage = async (
  username?: string,
  password?: string,
  passwordThatFailedServerCheck?: string
): Promise<string | null> => {
  let invalidPasswordMessage = "";
  if (password === undefined) {
    return null;
  }
  invalidPasswordMessage = await getInvalidPasswordMessage(password, username);
  if (invalidPasswordMessage !== "") {
    return invalidPasswordMessage;
  }
  if (password === passwordThatFailedServerCheck) {
    return validationMessages.useDifferentPassword;
  }
  return "";
};

export const getLocale = (): string | null => {
  return getUrlParamValue(urlQueryNames.locale);
};

export const buildLinkWithLocale = (url: string, locale: string): string => {
  if (locale) {
    return url + localeParamName + locale;
  }

  return url;
};

export const isValidBirthday = (
  year: string,
  month: string,
  day: string
): boolean => {
  if (!year || !month || !day) {
    return false;
  }

  // Make sure we can create a valid date object
  const testDate = new Date(`${month} ${day} ${year}`);
  if (Number.isNaN(testDate.getTime())) {
    return false;
  }

  // checks that it is actually a valid day in that month (like feb 31 doesn't exist but would generate a valid Date)
  if (testDate.getDate() !== parseInt(day, 10)) {
    return false;
  }

  // age limits
  const today = new Date();
  const isBirthdayValid =
    testDate.getTime() < today.getTime() &&
    testDate.getFullYear() > today.getFullYear() - 100;
  if (!isBirthdayValid) {
    return false;
  }

  return true;
};

export const handlePostSignup = (returnUrlValue?: string): void => {
  cleanupIdentityVerificationResultToken();
  incrementEphemeralCounter(counters.success);
  let returnUrl = returnUrlValue;
  if (typeof returnUrl === "string" && returnUrl.length > 0) {
    if (returnUrl.indexOf("?") === -1) {
      returnUrl += "?";
    } else {
      returnUrl += "&";
    }
    returnUrl += newUserParam;
    sendConversionEvent(() => navigateToPage(returnUrl!));
  } else {
    sendConversionEvent(() => navigateToPage(urlConstants.homePageNewUser));
  }
};

export const getReturnUrl = (): string => {
  const entryPoint = landingPageContainer();
  const returnUrl = entryPoint?.getAttribute("data-return-url") || "";
  return returnUrl;
};

export const getBirthdayToPrefill = (): string => {
  const entryPoint = landingPageContainer();
  const prefillBirthday =
    entryPoint?.getAttribute("data-prefill-birthday") || "";
  return prefillBirthday;
};

export const getIsSignupButtonDisabled = (
  isDisableSignupButtonExperimentEnabled: boolean,
  isFormValid: boolean,
  isSubmitting: boolean
): boolean => {
  return (
    (isDisableSignupButtonExperimentEnabled && !isFormValid) || isSubmitting
  );
};

export default {
  getLocale,
  buildLinkWithLocale,
  isValidBirthday,
  handlePostSignup,
  getUsernameValidationMessage,
  getPasswordValidationMessage,
  getReturnUrl,
  getBirthdayToPrefill,
};
