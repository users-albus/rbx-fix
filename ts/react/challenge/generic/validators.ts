/* eslint-disable import/prefer-default-export */
import * as z from "zod";
import * as Captcha from "../captcha/interface";
import { ActionType } from "../twoStepVerification/interface";
import { ChallengeType } from "./interface";
import * as Metadata from "./interface/metadata/interface";

const TwoStepVerificationChallengeMetadataValidator = z.object({
  userId: z.string(),
  challengeId: z.string(),
  shouldShowRememberDeviceCheckbox: z.boolean(),
  actionType: z.nativeEnum(ActionType),
});

const CaptchaChallengeMetadataValidator = z.object({
  actionType: z.nativeEnum(Captcha.ActionType),
  dataExchangeBlob: z.string(),
  unifiedCaptchaId: z.string(),
});

const SecurityQuestionsChallengeMetadataValidator = z.object({
  userId: z.string(),
  sessionId: z.string(),
});

const ReauthenticationValidator = z.object({});

const ForceAuthenticatorValidator = z.object({});

const ProofOfWorkValidator = z.object({
  sessionId: z.string(),
});

/**
 * A dictionary of validators corresponding to the challenge metadata types
 * defined in the `interface` directory. The type constraints expressed here
 * will force the validators to remain synchronized with the interface.
 */
export const ChallengeMetadataValidator: {
  [K in ChallengeType]: z.ZodType<Metadata.Challenge<K>>;
} = {
  [ChallengeType.TWO_STEP_VERIFICATION]:
    TwoStepVerificationChallengeMetadataValidator,
  [ChallengeType.CAPTCHA]: CaptchaChallengeMetadataValidator,
  [ChallengeType.FORCE_AUTHENTICATOR]: ForceAuthenticatorValidator,
  [ChallengeType.SECURITY_QUESTIONS]:
    SecurityQuestionsChallengeMetadataValidator,
  [ChallengeType.REAUTHENTICATION]: ReauthenticationValidator,
  [ChallengeType.PROOF_OF_WORK]: ProofOfWorkValidator,
};
