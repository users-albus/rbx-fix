import * as z from "zod";
import * as Captcha from "../captcha";
import * as CaptchaInterface from "../captcha/interface";
import * as ForceAuthenticator from "../forceAuthenticator";
import * as ForceAuthenticatorInterface from "../forceAuthenticator/interface";
import * as ProofOfWork from "../proofOfWork";
import * as ProofOfWorkInterface from "../proofOfWork/interface";
import * as Reauthentication from "../reauthentication";
import * as ReauthenticationInterface from "../reauthentication/interface";
import * as SecurityQuestions from "../securityQuestions";
import * as SecurityQuestionsInterface from "../securityQuestions/interface";
import * as TwoStepVerification from "../twoStepVerification";
import * as TwoStepVerificationInterface from "../twoStepVerification/interface";
import { LOG_PREFIX } from "./app.config";
import {
  ChallengeErrorData,
  ChallengeErrorKind,
  ChallengeErrorParameters,
  ChallengeSpecificProperties,
  ChallengeType,
  InterceptChallenge,
  ParseChallengeSpecificProperties,
  RenderChallenge,
  RetryRequest,
} from "./interface";
import * as Metadata from "./interface/metadata/interface";
import { ChallengeMetadataValidator } from "./validators";

// Export some additional enums that are declared in the shared interface (they
// are also defined in the shared interface, but we need to expose them in the
// object hierarchy for the challenge component).
export { ChallengeErrorKind, ChallengeType } from "./interface";

/**
 * Parses challenge-specific properties from a challenge type string and a JSON
 * string value representing challenge metadata.
 *
 * The output value of this function can (and almost always should) be passed
 * directly to `renderChallenge` as `challengeSpecificProperties`.
 */
export const parseChallengeSpecificProperties: ParseChallengeSpecificProperties =
  (challengeTypeRaw, challengeMetadataJson) => {
    const challengeType = Object.values(ChallengeType).includes(
      challengeTypeRaw as ChallengeType
    )
      ? (challengeTypeRaw as ChallengeType)
      : null;
    if (challengeType === null) {
      return null;
    }

    let challengeMetadata: unknown;
    try {
      challengeMetadata = JSON.parse(challengeMetadataJson);
    } catch (error) {
      return null;
    }

    // This type hint is not strictly necessary, but it appears to improve IDE
    // type inference with regards to the `result` type below.
    const validator: z.ZodType<Metadata.Challenge<typeof challengeType>> =
      ChallengeMetadataValidator[challengeType];
    const result = validator.safeParse(challengeMetadata);
    if (!result.success) {
      // eslint-disable-next-line no-console
      console.error(LOG_PREFIX, result.error);
      return null;
    }

    // TypeScript cannot figure it out, so we must assert that the `challengeType`
    // and `challengeMetadata` are correlated properties (with a known challenge
    // type) when returning from this function.
    return {
      challengeType,
      challengeMetadata,
    } as ChallengeSpecificProperties;
  };

/**
 * Renders the Generic Challenge UI for a given set of parameters.
 * Returns whether the UI could be successfully rendered.
 */
export const renderChallenge: RenderChallenge = async ({
  challengeBaseProperties,
  challengeSpecificProperties,
}): Promise<boolean> => {
  // NOTE: We can only unpack the `challengeSpecificProperties` AFTER asserting
  // their challenge type. This limitation is due to TypeScript's inference
  // behavior around correlated types in objects—specifically, the correlation
  // decouples itself as soon as the object's fields are separated into
  // variables.
  switch (challengeSpecificProperties.challengeType) {
    case ChallengeType.CAPTCHA: {
      const { challengeType, challengeMetadata } = challengeSpecificProperties;
      // Construct the parameters object specific to `Captcha.renderChallenge` (a
      // challenge provider).
      // In general, this object is constructed by:
      //   1. Defining defaults for optional properties required by the provider
      //   2. Unpacking the base properties for the challenge
      //   3. Unpacking specific challenge metadata from the back-end
      //   4. Overriding any properties that don't match the provider's interface
      const fullParameters: CaptchaInterface.ChallengeParameters = {
        onChallengeDisplayed: () => undefined,
        appType: null,
        ...challengeBaseProperties,
        ...challengeMetadata,
        onChallengeInvalidated: (data) =>
          challengeBaseProperties.onChallengeInvalidated({
            challengeType,
            ...data,
          }),
        onChallengeCompleted: (data) =>
          challengeBaseProperties.onChallengeCompleted({
            challengeType,
            metadata: {
              unifiedCaptchaId: data.captchaId,
              captchaToken: data.captchaToken,
              // GCS does not have access to the action type at the time of
              // redemption but needs it to record appropriate telemetry.
              actionType: challengeMetadata.actionType,
            },
          }),
      };
      return Captcha.renderChallenge(fullParameters);
    }

    case ChallengeType.FORCE_AUTHENTICATOR: {
      const { challengeMetadata } = challengeSpecificProperties;
      const fullParameters: ForceAuthenticatorInterface.ChallengeParameters = {
        ...challengeBaseProperties,
        ...challengeMetadata,
      };
      const success = await ForceAuthenticator.renderChallenge(fullParameters);
      if (
        success &&
        challengeBaseProperties.onChallengeDisplayed !== undefined
      ) {
        challengeBaseProperties.onChallengeDisplayed({ displayed: true });
      }
      return success;
    }

    case ChallengeType.TWO_STEP_VERIFICATION: {
      const { challengeType, challengeMetadata } = challengeSpecificProperties;
      const fullParameters: TwoStepVerificationInterface.ChallengeParameters = {
        ...challengeBaseProperties,
        ...challengeMetadata,
        onChallengeInvalidated: (data) =>
          challengeBaseProperties.onChallengeInvalidated({
            challengeType,
            ...data,
          }),
        onChallengeCompleted: (data) =>
          challengeBaseProperties.onChallengeCompleted({
            challengeType,
            metadata: {
              ...data,
              challengeId: challengeMetadata.challengeId,
              actionType: challengeMetadata.actionType,
            },
          }),
      };
      const success = await TwoStepVerification.renderChallenge(fullParameters);

      // Some consumers (e.g. the hybrid web view) make use of a callback for a
      // challenge being displayed, which is not a logical callback in most of our
      // challenge types. The generic wrapper polyfills support for this callback
      // by firing it when a challenge provider returns successfully.
      if (
        success &&
        challengeBaseProperties.onChallengeDisplayed !== undefined
      ) {
        challengeBaseProperties.onChallengeDisplayed({ displayed: true });
      }
      return success;
    }

    case ChallengeType.SECURITY_QUESTIONS: {
      const { challengeType, challengeMetadata } = challengeSpecificProperties;
      const fullParameters: SecurityQuestionsInterface.ChallengeParameters = {
        ...challengeBaseProperties,
        ...challengeMetadata,
        onChallengeInvalidated: (data) =>
          challengeBaseProperties.onChallengeInvalidated({
            challengeType,
            ...data,
          }),
        onChallengeCompleted: (data) =>
          challengeBaseProperties.onChallengeCompleted({
            challengeType,
            metadata: data,
          }),
      };
      const success = await SecurityQuestions.renderChallenge(fullParameters);
      if (
        success &&
        challengeBaseProperties.onChallengeDisplayed !== undefined
      ) {
        challengeBaseProperties.onChallengeDisplayed({ displayed: true });
      }
      return success;
    }

    case ChallengeType.REAUTHENTICATION: {
      const { challengeType, challengeMetadata } = challengeSpecificProperties;
      const fullParameters: ReauthenticationInterface.ChallengeParameters = {
        ...challengeBaseProperties,
        ...challengeMetadata,
        onChallengeInvalidated: (data) =>
          challengeBaseProperties.onChallengeInvalidated({
            challengeType,
            ...data,
          }),
        onChallengeCompleted: (data) =>
          challengeBaseProperties.onChallengeCompleted({
            challengeType,
            metadata: data,
          }),
      };
      const success = await Reauthentication.renderChallenge(fullParameters);
      if (
        success &&
        challengeBaseProperties.onChallengeDisplayed !== undefined
      ) {
        challengeBaseProperties.onChallengeDisplayed({ displayed: true });
      }
      return success;
    }

    case ChallengeType.PROOF_OF_WORK: {
      const { challengeType, challengeMetadata } = challengeSpecificProperties;
      const fullParameters: ProofOfWorkInterface.ChallengeParameters = {
        ...challengeBaseProperties,
        ...challengeMetadata,
        onChallengeInvalidated: (data) =>
          challengeBaseProperties.onChallengeInvalidated({
            challengeType,
            ...data,
          }),
        onChallengeCompleted: (data) =>
          challengeBaseProperties.onChallengeCompleted({
            challengeType,
            metadata: {
              ...data,
              sessionId: challengeMetadata.sessionId,
            },
          }),
      };
      const success = await ProofOfWork.renderChallenge(fullParameters);
      if (
        success &&
        challengeBaseProperties.onChallengeDisplayed !== undefined
      ) {
        challengeBaseProperties.onChallengeDisplayed({ displayed: true });
      }
      return success;
    }

    default: {
      // If we have handled all of the challenge types above, TypeScript will
      // infer `challengeSpecificProperties` to have type `never` and the
      // following assignment should compile successfully.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const assertCodeIsUnreachable: never = challengeSpecificProperties;
      return false;
    }
  }
};

/**
 * A custom error type to propagate challenge failures from a generic challenge
 * interceptor.
 */
export class ChallengeError<
    P extends ChallengeErrorParameters = ChallengeErrorParameters
  >
  extends Error
  implements ChallengeError<P>
{
  /**
   * Helper function to match against any errors returned from the Generic
   * Challenge Flow.
   */
  public static match(error: unknown): error is ChallengeError {
    return error instanceof ChallengeError;
  }

  /**
   * Helper function to match against any challenge abandons returned from the
   * Generic Challenge Flow.
   */
  public static matchAbandoned(error: unknown): error is ChallengeError<{
    kind: ChallengeErrorKind.ABANDONED;
    data: ChallengeErrorData<ChallengeErrorKind.ABANDONED>;
  }> {
    return (
      ChallengeError.match(error) &&
      error.parameters.kind === ChallengeErrorKind.ABANDONED
    );
  }

  private static getMessage(parameters: ChallengeErrorParameters): string {
    return `Got (${[
      `Kind: ${parameters.kind}`,
      `Type: ${parameters.data.challengeType || "unknown"}`,
      `Code: ${
        parameters.kind === ChallengeErrorKind.INVALIDATED
          ? parameters.data.errorCode
          : "null"
      }`,
    ].join("; ")})`;
  }

  private _parameters: P;

  public get parameters(): P {
    return this._parameters;
  }

  constructor(parameters: P) {
    super(ChallengeError.getMessage(parameters));
    Object.setPrototypeOf(this, ChallengeError.prototype);
    this.name = ChallengeError.name;
    this._parameters = parameters;
  }
}

/**
 * Wraps `renderChallenge` to retry an HTTP request on challenge success or
 * throw an appropriate `ChallengeError` on challenge failure.
 */
export const interceptChallenge: InterceptChallenge = <T>(parameters: {
  retryRequest: RetryRequest<T>;
  containerId: string;
  challengeId: string;
  challengeTypeRaw: string;
  challengeMetadataJsonBase64: string;
}): Promise<T> =>
  new Promise((resolve, reject) => {
    const {
      retryRequest,
      containerId,
      challengeId,
      challengeTypeRaw,
      challengeMetadataJsonBase64,
    } = parameters;
    let challengeMetadataJson: string;
    try {
      challengeMetadataJson = atob(challengeMetadataJsonBase64);
    } catch (error) {
      // Specifically catch and suppress if `atob` gets invalid Base-64 input.
      if (
        error instanceof DOMException &&
        error.code === DOMException.INVALID_CHARACTER_ERR
      ) {
        // eslint-disable-next-line no-console
        console.error(LOG_PREFIX, "Base-64 decoding failed", error);
        reject(
          new ChallengeError({
            kind: ChallengeErrorKind.UNKNOWN,
            data: {},
          })
        );
        return;
      }
      throw error;
    }
    const challengeSpecificProperties = parseChallengeSpecificProperties(
      challengeTypeRaw,
      challengeMetadataJson
    );
    if (challengeSpecificProperties === null) {
      // Fail the request on a challenge that fails to be parsed.
      // eslint-disable-next-line no-console
      console.error(LOG_PREFIX, "Challenge headers failed to be parsed");
      reject(
        new ChallengeError({
          kind: ChallengeErrorKind.UNKNOWN,
          data: {},
        })
      );
      return;
    }

    // Ensure that we have a hidden container to render into.
    if (document.getElementById(containerId) === null) {
      const genericChallengeContainer = document.createElement("div");
      genericChallengeContainer.id = containerId;
      document.body.appendChild(genericChallengeContainer);
    }

    // Attempt to render the challenge.
    // eslint-disable-next-line no-void
    void renderChallenge({
      challengeBaseProperties: {
        containerId,
        shouldDynamicallyLoadTranslationResources: false,
        renderInline: false,
        onChallengeCompleted: (data) => {
          // Retry the request on success.
          try {
            resolve(
              retryRequest(challengeId, btoa(JSON.stringify(data.metadata)))
            );
          } catch (error) {
            // Specifically catch and suppress if `btoa` gets invalid input (can
            // happen with wide Unicode code points).
            if (
              error instanceof DOMException &&
              error.code === DOMException.INVALID_CHARACTER_ERR
            ) {
              // eslint-disable-next-line no-console
              console.error(LOG_PREFIX, "Base-64 encoding failed", error);
              reject(
                new ChallengeError({
                  kind: ChallengeErrorKind.UNKNOWN,
                  data: {
                    challengeType: challengeSpecificProperties.challengeType,
                  },
                })
              );
            } else {
              throw error;
            }
          }
        },
        onChallengeInvalidated: (data) =>
          // Fail the request on an invalidated challenge.
          reject(
            new ChallengeError({
              kind: ChallengeErrorKind.INVALIDATED,
              data,
            })
          ),
        onModalChallengeAbandoned: () =>
          // Fail the request on an abandoned challenge.
          reject(
            new ChallengeError({
              kind: ChallengeErrorKind.ABANDONED,
              data: {
                challengeType: challengeSpecificProperties.challengeType,
              },
            })
          ),
      },
      challengeSpecificProperties,
    }).then((success) => {
      if (!success) {
        // Fail the request on a challenge that fails to initialize.
        // eslint-disable-next-line no-console
        console.error(LOG_PREFIX, "Challenge component failed to initialize");
        reject(
          new ChallengeError({
            kind: ChallengeErrorKind.UNKNOWN,
            data: {
              challengeType: challengeSpecificProperties.challengeType,
            },
          })
        );
      }
    });
  });
