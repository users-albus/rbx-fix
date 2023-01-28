/**
 * Two-Step Verification
 */

import { EnvironmentUrls } from "Roblox";
import UrlConfig from "../../../../../../Roblox.CoreScripts.WebApp/Roblox.CoreScripts.WebApp/js/core/http/interfaces/UrlConfig";

const URL_NOT_FOUND = "URL_NOT_FOUND";

const twoStepVerificationApiUrl =
  EnvironmentUrls.twoStepVerificationApi ?? URL_NOT_FOUND;

export enum TwoStepVerificationError {
  UNKNOWN = 0,
  INVALID_CHALLENGE_ID = 1,
  INVALID_USER_ID = 2,
  INVALID_EMAIL = 3,
  INVALID_PASSWORD = 4,
  TOO_MANY_REQUESTS = 5,
  PIN_LOCKED = 6,
  FEATURE_DISABLED = 7,
  NOT_ALLOWED = 8,
  INVALID_CONFIGURATION = 9,
  INVALID_CODE = 10,
  CONFIGURATION_ALREADY_ENABLED = 11,
  INVALID_SETUP_TOKEN = 12,
}

/**
 * Used as a partial request type.
 */
export type Code = {
  code: string;
};

export type GetMetadataReturnType = {
  twoStepVerificationEnabled: boolean;
  authenticatorEnabled: boolean;
  authenticatorQrCodeSize: string;
  emailCodeLength: number;
  authenticatorCodeLength: number;
  isSecurityKeyOnAllPlatformsEnabled: boolean;
};

/**
 * Request Type: `GET`.
 */
export const GET_METADATA_CONFIG: UrlConfig = {
  url: `${twoStepVerificationApiUrl}/v1/metadata`,
  withCredentials: true,
  timeout: 10000,
};

export type GetUserConfigurationReturnType = {
  primaryMediaType: string;
  methods: {
    mediaType: string;
    enabled: boolean;
    updated: string;
  }[];
};

/**
 * Request Type: `GET`.
 */
export const GET_USER_CONFIGURATION_CONFIG: (userId: string) => UrlConfig = (
  userId
) => ({
  withCredentials: true,
  url: `${twoStepVerificationApiUrl}/v1/users/${userId}/configuration`,
  timeout: 10000,
});

export type SendEmailCodeReturnType = void;

/**
 * Request Type: `POST`.
 */
export const SEND_EMAIL_CODE_CONFIG: (userId: string) => UrlConfig = (
  userId
) => ({
  withCredentials: true,
  url: `${twoStepVerificationApiUrl}/v1/users/${userId}/challenges/email/send-code`,
  timeout: 10000,
});

export type VerifyEmailCodeReturnType = {
  verificationToken: string;
};

/**
 * Request Type: `POST`.
 */
export const VERIFY_EMAIL_CODE_CONFIG: (userId: string) => UrlConfig = (
  userId
) => ({
  withCredentials: true,
  url: `${twoStepVerificationApiUrl}/v1/users/${userId}/challenges/email/verify`,
  timeout: 10000,
});

export type VerifyAuthenticatorCodeReturnType = {
  verificationToken: string;
};

/**
 * Request Type: `POST`.
 */
export const VERIFY_AUTHENTICATOR_CODE_CONFIG: (userId: string) => UrlConfig = (
  userId
) => ({
  withCredentials: true,
  url: `${twoStepVerificationApiUrl}/v1/users/${userId}/challenges/authenticator/verify`,
  timeout: 10000,
});

export type VerifyRecoveryCodeReturnType = {
  verificationToken: string;
};

/**
 * Request Type: `POST`.
 */
export const VERIFY_RECOVERY_CODE_CONFIG: (userId: string) => UrlConfig = (
  userId
) => ({
  withCredentials: true,
  url: `${twoStepVerificationApiUrl}/v1/users/${userId}/challenges/recovery-codes/verify`,
  timeout: 10000,
});

export type SendSmsCodeReturnType = void;

/**
 * Request Type: `POST`.
 */
export const SEND_SMS_CODE_CONFIG: (userId: string) => UrlConfig = (
  userId
) => ({
  withCredentials: true,
  url: `${twoStepVerificationApiUrl}/v1/users/${userId}/challenges/sms/send-code`,
  timeout: 10000,
});

export type VerifySmsCodeReturnType = {
  verificationToken: string;
};

/**
 * Request Type: `POST`.
 */
export const VERIFY_SMS_CODE_CONFIG: (userId: string) => UrlConfig = (
  userId
) => ({
  withCredentials: true,
  url: `${twoStepVerificationApiUrl}/v1/users/${userId}/challenges/sms/verify`,
  timeout: 10000,
});

export type GetSecurityKeyOptionsReturnType = {
  authenticationOptions: string;
  sessionId: string;
};

/**
 * Request Type: `GET`.
 */
export const GET_SECURITY_KEY_OPTIONS_CONFIG: (userId: string) => UrlConfig = (
  userId
) => ({
  withCredentials: true,
  url: `${twoStepVerificationApiUrl}/v1/users/${userId}/challenges/security-key/verify-start`,
  timeout: 10000,
});

export type VerifySecurityKeyCredentialReturnType = {
  verificationToken: string;
};

/**
 * Request Type: `POST`.
 */
export const VERIFY_SECURITY_KEY_CREDENTIAL_CONFIG: (
  userId: string
) => UrlConfig = (userId) => ({
  withCredentials: true,
  url: `${twoStepVerificationApiUrl}/v1/users/${userId}/challenges/security-key/verify-finish`,
  timeout: 100000,
});
