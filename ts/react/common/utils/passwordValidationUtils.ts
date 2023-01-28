import { httpService } from "core-utilities";
import { EnvironmentUrls } from "Roblox";
import {
  passwordValidatorErrorMessages,
  weakPasswords,
} from "../constants/validationConstants";
import {
  TValidatePasswordParams,
  TValidatePasswordResponse,
} from "../types/signupTypes";
import {
  validatePassword,
  validateUsername,
} from "../../reactLanding/services/signupService";

const isPasswordBadLength = (password: string): boolean => {
  return password.length < 8 || password.length > 200;
};

const isPasswordSameAsUsername = (
  password: string,
  username?: string
): boolean => {
  return password === username;
};

const isPasswordWeak = async (
  username: string,
  password: string
): Promise<boolean> => {
  const lowerCasePassword = password.toLowerCase();
  const validatePasswordParams: TValidatePasswordParams = {
    username,
    password,
  };

  const validatePasswordResponse = await validatePassword(
    validatePasswordParams
  );
  if (validatePasswordResponse.code === 5) {
    return true;
  }

  if (/^[\s]*$/.test(lowerCasePassword)) {
    // if the password only contains whitespace characters, consider it weak
    return true;
  }
  return false;
};

const getInvalidPasswordMessage = async (
  password: string,
  username?: string
): Promise<string> => {
  if (isPasswordBadLength(password)) {
    return passwordValidatorErrorMessages.PasswordBadLength;
  }
  if (isPasswordSameAsUsername(password, username)) {
    return passwordValidatorErrorMessages.PasswordContainsUsernameError;
  }
  if (username != null && (await isPasswordWeak(username, password))) {
    return passwordValidatorErrorMessages.PasswordComplexity;
  }
  return "";
};

export { getInvalidPasswordMessage as default };
