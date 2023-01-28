/* eslint-disable no-console */
import { UrlParser } from "Roblox";
import * as z from "zod";
import { ActionType } from "../captcha/interface";
import * as Generic from "../generic";
import {
  ChallengeSpecificProperties,
  ChallengeType,
} from "../generic/interface";
import * as TwoStepVerification from "../twoStepVerification";
import { LOG_PREFIX } from "./app.config";

const APP_TYPE_UNKNOWN = "unknown";
const CHALLENGE_TYPE_GENERIC = "generic";

/**
 * The key constants for different query parameters.
 */
enum QueryParameterKey {
  ACTION_TYPE = "action-type",
  ALLOW_REMEMBER_DEVICE = "allow-remember-device",
  APP_TYPE = "app-type",
  CAPTCHA_ID = "captcha-id",
  CHALLENGE_ID = "challenge-id",
  CHALLENGE_METADATA_JSON = "challenge-metadata-json",
  CHALLENGE_TYPE = "challenge-type",
  DARK_MODE = "dark-mode",
  DATA_EXCHANGE_BLOB = "data-exchange-blob",
  GENERIC_CHALLENGE_TYPE = "generic-challenge-type",
  SESSION_ID = "session-id",
  USER_ID = "user-id",
}

const QueryParametersBaseValidator = z.object({
  // Strip hyphens from the challenge type for the benefit of legacy Lua code
  // (which used hyphens for challenge types per the original GCS contract).
  challengeType: z.preprocess(
    (rawType) =>
      typeof rawType === "string" ? rawType.replace(/-/g, "") : rawType,
    z.union([z.nativeEnum(ChallengeType), z.literal(CHALLENGE_TYPE_GENERIC)])
  ),
  darkMode: z
    .union([z.literal("false"), z.literal("true")])
    .transform((value) => value === "true"),
  appType: z.string().default(APP_TYPE_UNKNOWN),
});

export type QueryParametersBase = z.infer<typeof QueryParametersBaseValidator>;

/**
 * Reads query parameters to determine which hybrid challenge to render.
 */
export const readQueryParametersBase = (): QueryParametersBase | null => {
  const queryParameters = UrlParser.getParametersAsObject();
  const queryParametersRenamed: Record<keyof QueryParametersBase, string> = {
    challengeType: queryParameters[QueryParameterKey.CHALLENGE_TYPE],
    darkMode: queryParameters[QueryParameterKey.DARK_MODE],
    appType: queryParameters[QueryParameterKey.APP_TYPE],
  };

  const result = QueryParametersBaseValidator.safeParse(queryParametersRenamed);
  if (!result.success) {
    console.error(LOG_PREFIX, result.error);
    return null;
  }

  return result.data;
};

const QueryParametersForCaptchaValidator = z.object({
  actionType: z.nativeEnum(ActionType),
  dataExchangeBlob: z.string(),
  unifiedCaptchaId: z.string(),
});

export type QueryParametersForCaptcha = z.infer<
  typeof QueryParametersForCaptchaValidator
>;

/**
 * Reads query parameters to render a hybrid captcha challenge.
 */
export const readQueryParametersForCaptcha =
  (): QueryParametersForCaptcha | null => {
    const queryParameters = UrlParser.getParametersAsObject();
    const queryParametersRenamed: Record<
      keyof QueryParametersForCaptcha,
      string
    > = {
      actionType: queryParameters[QueryParameterKey.ACTION_TYPE],
      dataExchangeBlob: queryParameters[QueryParameterKey.DATA_EXCHANGE_BLOB],
      unifiedCaptchaId: queryParameters[QueryParameterKey.CAPTCHA_ID],
    };

    const result = QueryParametersForCaptchaValidator.safeParse(
      queryParametersRenamed
    );
    if (!result.success) {
      console.error(LOG_PREFIX, result.error);
      return null;
    }

    return result.data;
  };

const QueryParametersForTwoStepVerificationValidator = z.object({
  userId: z.string(),
  challengeId: z.string(),
  actionType: z.nativeEnum(TwoStepVerification.ActionType),
  allowRememberDevice: z
    .union([z.literal("false"), z.literal("true")])
    .transform((value) => value === "true"),
});

export type QueryParametersForTwoStepVerification = z.infer<
  typeof QueryParametersForTwoStepVerificationValidator
>;

/**
 * Reads query parameters to render a hybrid 2SV challenge.
 */
export const readQueryParametersForTwoStepVerification =
  (): QueryParametersForTwoStepVerification | null => {
    const queryParameters = UrlParser.getParametersAsObject();
    const queryParametersRenamed: Record<
      keyof QueryParametersForTwoStepVerification,
      string
    > = {
      userId: queryParameters[QueryParameterKey.USER_ID],
      challengeId: queryParameters[QueryParameterKey.CHALLENGE_ID],
      actionType: queryParameters[QueryParameterKey.ACTION_TYPE],
      allowRememberDevice:
        queryParameters[QueryParameterKey.ALLOW_REMEMBER_DEVICE],
    };

    const result = QueryParametersForTwoStepVerificationValidator.safeParse(
      queryParametersRenamed
    );
    if (!result.success) {
      console.error(LOG_PREFIX, result.error);
      return null;
    }

    return result.data;
  };

const QueryParametersForSecurityQuestionsValidator = z.object({
  userId: z.string(),
  sessionId: z.string(),
});

export type QueryParametersForSecurityQuestions = z.infer<
  typeof QueryParametersForSecurityQuestionsValidator
>;

/**
 * Reads query parameters to render a hybrid security questions challenge.
 */
export const readQueryParametersForSecurityQuestions =
  (): QueryParametersForSecurityQuestions | null => {
    const queryParameters = UrlParser.getParametersAsObject();
    const queryParametersRenamed: Record<
      keyof QueryParametersForSecurityQuestions,
      string
    > = {
      userId: queryParameters[QueryParameterKey.USER_ID],
      sessionId: queryParameters[QueryParameterKey.SESSION_ID],
    };

    const result = QueryParametersForSecurityQuestionsValidator.safeParse(
      queryParametersRenamed
    );
    if (!result.success) {
      console.error(LOG_PREFIX, result.error);
      return null;
    }

    return result.data;
  };

const QueryParametersForProofOfWorkValidator = z.object({
  sessionId: z.string(),
});

export type QueryParametersForProofOfWork = z.infer<
  typeof QueryParametersForProofOfWorkValidator
>;

/**
 * Reads query parameters to render a hybrid proof-of-work challenge.
 */
export const readQueryParametersForProofOfWork =
  (): QueryParametersForProofOfWork | null => {
    const queryParameters = UrlParser.getParametersAsObject();
    const queryParametersRenamed: Record<
      keyof QueryParametersForProofOfWork,
      string
    > = {
      sessionId: queryParameters[QueryParameterKey.SESSION_ID],
    };

    const result = QueryParametersForProofOfWorkValidator.safeParse(
      queryParametersRenamed
    );
    if (!result.success) {
      console.error(LOG_PREFIX, result.error);
      return null;
    }

    return result.data;
  };

const QueryParametersForGenericChallengeValidator = z.object({
  // This is the `generic-challenge-type` query parameter rather than the plain
  // `challenge-type` parameter. The latter will just be `generic` for a generic
  // challenge.
  challengeType: z.nativeEnum(ChallengeType),
  challengeMetadataJson: z.string(),
});

/**
 * Decodes a URL-safe Base-64 string as defined in RFC 4648.
 */
const decodeBase64Url = (base64UrlString: string): string | null => {
  // Remove all characters not in the Base-64 URL-safe set.
  // This effectively serves to trim and concatenate disjoint inputs, but it
  // will not fix bad inputs.
  const rawString = base64UrlString.replace(/[^A-Za-z0-9-_]/g, "");

  // Add standard padding characters and make URL-unsafe replacements.
  const padCharacters = (4 - (rawString.length % 4)) % 4;
  const paddedString = rawString + Array(padCharacters + 1).join("=");
  const replacedString = paddedString.replace(/-/g, "+").replace(/_/g, "/");
  try {
    return atob(replacedString);
  } catch (error) {
    // Specifically catch and suppress if `atob` gets invalid Base-64 input.
    if (
      error instanceof DOMException &&
      error.code === DOMException.INVALID_CHARACTER_ERR
    ) {
      // eslint-disable-next-line no-console
      console.error(LOG_PREFIX, "Base-64 decoding failed", error);
      return null;
    }
    throw error;
  }
};

/**
 * Reads query parameters to render a hybrid generic challenge.
 */
export const readQueryParametersForGenericChallenge =
  (): ChallengeSpecificProperties | null => {
    const queryParameters = UrlParser.getParametersAsObject();
    const queryParametersRenamed: Record<
      keyof z.infer<typeof QueryParametersForGenericChallengeValidator>,
      string
    > = {
      challengeType: queryParameters[QueryParameterKey.GENERIC_CHALLENGE_TYPE],
      challengeMetadataJson:
        queryParameters[QueryParameterKey.CHALLENGE_METADATA_JSON],
    };

    const result = QueryParametersForGenericChallengeValidator.safeParse(
      queryParametersRenamed
    );
    if (!result.success) {
      console.error(LOG_PREFIX, result.error);
      return null;
    }

    const { challengeType, challengeMetadataJson } = result.data;
    // Due to inconsistencies in URL-encoding across UA platforms, we pack the
    // metadata payload in URL-safe Base-64 when passing it to be rendered in a
    // hybrid web view. These characters are unlikely to be tampered with.
    const challegeMetadataJsonDecoded = decodeBase64Url(challengeMetadataJson);
    if (challegeMetadataJsonDecoded === null) {
      return null;
    }

    return Generic.parseChallengeSpecificProperties(
      challengeType,
      challegeMetadataJsonDecoded
    );
  };
