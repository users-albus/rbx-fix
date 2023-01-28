import { httpService } from "core-utilities";
import {
  ChallengeIdAndActionType,
  UserId,
} from "../../../react/challenge/twoStepVerification/constants/parameters";
import { Result } from "../../result";
import { toResult } from "../common";
import * as TwoStepVerification from "../types/twoStepVerification";

export const getMetadata = (
  context?: UserId & ChallengeIdAndActionType
): Promise<
  Result<
    TwoStepVerification.GetMetadataReturnType,
    TwoStepVerification.TwoStepVerificationError | null
  >
> =>
  toResult(
    httpService.get(TwoStepVerification.GET_METADATA_CONFIG, context || {}),
    TwoStepVerification.TwoStepVerificationError
  );

export const getUserConfiguration = (
  userId: string,
  challengeParameters?: ChallengeIdAndActionType
): Promise<
  Result<
    TwoStepVerification.GetUserConfigurationReturnType,
    TwoStepVerification.TwoStepVerificationError | null
  >
> =>
  toResult(
    httpService.get(
      TwoStepVerification.GET_USER_CONFIGURATION_CONFIG(userId),
      challengeParameters || {}
    ),
    TwoStepVerification.TwoStepVerificationError
  );

export const sendEmailCode = (
  userId: string,
  challengeParameters: ChallengeIdAndActionType
): Promise<
  Result<
    TwoStepVerification.SendEmailCodeReturnType,
    TwoStepVerification.TwoStepVerificationError | null
  >
> =>
  toResult(
    httpService.post(
      TwoStepVerification.SEND_EMAIL_CODE_CONFIG(userId),
      challengeParameters
    ),
    TwoStepVerification.TwoStepVerificationError
  );

export const verifyEmailCode = (
  userId: string,
  verificationParameters: ChallengeIdAndActionType & TwoStepVerification.Code
): Promise<
  Result<
    TwoStepVerification.VerifyEmailCodeReturnType,
    TwoStepVerification.TwoStepVerificationError | null
  >
> =>
  toResult(
    httpService.post(
      TwoStepVerification.VERIFY_EMAIL_CODE_CONFIG(userId),
      verificationParameters
    ),
    TwoStepVerification.TwoStepVerificationError
  );

export const verifyAuthenticatorCode = (
  userId: string,
  verificationParameters: ChallengeIdAndActionType & TwoStepVerification.Code
): Promise<
  Result<
    TwoStepVerification.VerifyAuthenticatorCodeReturnType,
    TwoStepVerification.TwoStepVerificationError | null
  >
> =>
  toResult(
    httpService.post(
      TwoStepVerification.VERIFY_AUTHENTICATOR_CODE_CONFIG(userId),
      verificationParameters
    ),
    TwoStepVerification.TwoStepVerificationError
  );

export const verifyRecoveryCode = (
  userId: string,
  verificationParameters: ChallengeIdAndActionType & TwoStepVerification.Code
): Promise<
  Result<
    TwoStepVerification.VerifyRecoveryCodeReturnType,
    TwoStepVerification.TwoStepVerificationError | null
  >
> =>
  toResult(
    httpService.post(
      TwoStepVerification.VERIFY_RECOVERY_CODE_CONFIG(userId),
      verificationParameters
    ),
    TwoStepVerification.TwoStepVerificationError
  );

export const sendSmsCode = (
  userId: string,
  challengeParameters: ChallengeIdAndActionType
): Promise<
  Result<
    TwoStepVerification.SendSmsCodeReturnType,
    TwoStepVerification.TwoStepVerificationError | null
  >
> =>
  toResult(
    httpService.post(
      TwoStepVerification.SEND_SMS_CODE_CONFIG(userId),
      challengeParameters
    ),
    TwoStepVerification.TwoStepVerificationError
  );

export const verifySmsCode = (
  userId: string,
  verificationParameters: ChallengeIdAndActionType & TwoStepVerification.Code
): Promise<
  Result<
    TwoStepVerification.VerifySmsCodeReturnType,
    TwoStepVerification.TwoStepVerificationError | null
  >
> =>
  toResult(
    httpService.post(
      TwoStepVerification.VERIFY_SMS_CODE_CONFIG(userId),
      verificationParameters
    ),
    TwoStepVerification.TwoStepVerificationError
  );

export const getSecurityKeyOptions = (
  userId: string,
  challengeParameters: ChallengeIdAndActionType
): Promise<
  Result<
    TwoStepVerification.GetSecurityKeyOptionsReturnType,
    TwoStepVerification.TwoStepVerificationError | null
  >
> =>
  toResult(
    httpService.post(
      TwoStepVerification.GET_SECURITY_KEY_OPTIONS_CONFIG(userId),
      challengeParameters
    ),
    TwoStepVerification.TwoStepVerificationError
  );

// For security keys, the TwoStepVerification.Code is the JSON-encoded assertion response from the authenticator.
export const verifySecurityKeyCredential = (
  userId: string,
  verificationParameters: ChallengeIdAndActionType & TwoStepVerification.Code
): Promise<
  Result<
    TwoStepVerification.VerifySecurityKeyCredentialReturnType,
    TwoStepVerification.TwoStepVerificationError | null
  >
> =>
  toResult(
    httpService.post(
      TwoStepVerification.VERIFY_SECURITY_KEY_CREDENTIAL_CONFIG(userId),
      verificationParameters
    ),
    TwoStepVerification.TwoStepVerificationError
  );
