/* eslint-disable no-console */
/* eslint-disable no-case-declarations */
import { Hybrid } from "Roblox";
import "../../../../css/challenge/captcha/captcha.scss";
import * as Captcha from "../captcha";
import * as ForceAuthenticator from "../forceAuthenticator";
import * as Generic from "../generic";
import { ChallengeType } from "../generic/interface";
import * as ProofOfWork from "../proofOfWork";
import * as Reauthentication from "../reauthentication";
import * as SecurityQuestions from "../securityQuestions";
import * as TwoStepVerification from "../twoStepVerification";
import { LOG_PREFIX } from "./app.config";
import { HybridTarget, RenderChallengeFromQueryParameters } from "./interface";
import {
  readQueryParametersBase,
  readQueryParametersForCaptcha,
  readQueryParametersForGenericChallenge,
  readQueryParametersForProofOfWork,
  readQueryParametersForSecurityQuestions,
  readQueryParametersForTwoStepVerification,
} from "./query";

const HYBRID_TARGET_KEY = "feature";
const CALLBACK_EVENT_NAME = "callbackInputChanged";
const CLASS_LIGHT_MODE = "light-theme";
const CLASS_DARK_MODE = "dark-theme";

// Export some additional enums that are declared in the shared interface (they
// are also defined in the shared interface, but we need to expose them in the
// object hierarchy for the challenge component).
export { ChallengeType } from "../generic/interface";
export { HybridTarget } from "./interface";

/**
 * Helper function for hybrid callbacks (including a fallback hybrid method for
 * Studio, which does not support the Roblox Hybrid library).
 */
const dispatchNavigateToFeatureHybridEvent = (
  hybridTargetToCallbackInputId: Record<HybridTarget, string>,
  hybridTarget: HybridTarget,
  data: Record<string, unknown>
) => {
  console.log(LOG_PREFIX, "Sending hybrid call:", hybridTarget);
  Hybrid.Navigation?.navigateToFeature(
    {
      [HYBRID_TARGET_KEY]: hybridTarget,
      data,
    },
    () => console.log(LOG_PREFIX, "Sent hybrid call:", hybridTarget)
  );

  // Fallback hybrid method for Studio:
  const callbackElementId = hybridTargetToCallbackInputId[hybridTarget];
  const callbackElement = document.getElementById(
    callbackElementId
  ) as HTMLInputElement;
  if (callbackElement !== null && callbackElement.tagName === "INPUT") {
    callbackElement.value = JSON.stringify(data);

    // Notify Studio with a custom HTML event.
    const callbackEvent = document.createEvent("HTMLEvents");
    callbackEvent.initEvent(CALLBACK_EVENT_NAME, false, false);
    callbackElement.dispatchEvent(callbackEvent);
  }
};

/**
 * Helper function for captcha hybrid challenges.
 */
const renderCaptchaChallengeFromQueryParameters = async (
  containerId: string,
  hybridTargetToCallbackInputId: Record<HybridTarget, string>,
  appType: string
): Promise<boolean> => {
  const queryParameters = readQueryParametersForCaptcha();
  // Handle hybrid callbacks for parse.
  if (queryParameters === null) {
    dispatchNavigateToFeatureHybridEvent(
      hybridTargetToCallbackInputId,
      HybridTarget.CHALLENGE_PARSED,
      { parsed: false }
    );
    return false;
  }
  dispatchNavigateToFeatureHybridEvent(
    hybridTargetToCallbackInputId,
    HybridTarget.CHALLENGE_PARSED,
    { parsed: true }
  );

  const { actionType, dataExchangeBlob, unifiedCaptchaId } = queryParameters;
  const result = await Captcha.renderChallenge({
    containerId,
    actionType,
    appType,
    dataExchangeBlob,
    unifiedCaptchaId,
    renderInline: true,
    shouldDynamicallyLoadTranslationResources: true,
    onChallengeDisplayed: (data) =>
      dispatchNavigateToFeatureHybridEvent(
        hybridTargetToCallbackInputId,
        HybridTarget.CHALLENGE_DISPLAYED,
        data
      ),
    onChallengeCompleted: (data) =>
      dispatchNavigateToFeatureHybridEvent(
        hybridTargetToCallbackInputId,
        HybridTarget.CHALLENGE_COMPLETED,
        data
      ),
    onChallengeInvalidated: (data) =>
      dispatchNavigateToFeatureHybridEvent(
        hybridTargetToCallbackInputId,
        HybridTarget.CHALLENGE_INVALIDATED,
        data
      ),
    onModalChallengeAbandoned: null,
  });
  // Handle hybrid callbacks for initialize.
  if (result === false) {
    dispatchNavigateToFeatureHybridEvent(
      hybridTargetToCallbackInputId,
      HybridTarget.CHALLENGE_INITIALIZED,
      { initialized: false }
    );
    return false;
  }
  dispatchNavigateToFeatureHybridEvent(
    hybridTargetToCallbackInputId,
    HybridTarget.CHALLENGE_INITIALIZED,
    { initialized: true }
  );

  return true;
};

/**
 * Helper function for 2SV hybrid challenges.
 */
const renderTwoStepVerificationChallengeFromQueryParameters = async (
  containerId: string,
  hybridTargetToCallbackInputId: Record<HybridTarget, string>,
  appType: string
): Promise<boolean> => {
  const queryParameters = readQueryParametersForTwoStepVerification();
  // Handle hybrid callbacks for parse.
  if (queryParameters === null) {
    dispatchNavigateToFeatureHybridEvent(
      hybridTargetToCallbackInputId,
      HybridTarget.CHALLENGE_PARSED,
      { parsed: false }
    );
    return false;
  }
  dispatchNavigateToFeatureHybridEvent(
    hybridTargetToCallbackInputId,
    HybridTarget.CHALLENGE_PARSED,
    { parsed: true }
  );

  const { userId, challengeId, actionType, allowRememberDevice } =
    queryParameters;
  const result = await TwoStepVerification.renderChallenge({
    containerId,
    userId,
    challengeId,
    actionType,
    appType,
    renderInline: true,
    // Page changes in the 2SV interface should trigger browser navigation so
    // the back button works correctly in Lua.
    shouldModifyBrowserHistory: true,
    shouldShowRememberDeviceCheckbox: allowRememberDevice,
    shouldDynamicallyLoadTranslationResources: true,
    onChallengeCompleted: (data) =>
      dispatchNavigateToFeatureHybridEvent(
        hybridTargetToCallbackInputId,
        HybridTarget.CHALLENGE_COMPLETED,
        data
      ),
    onChallengeInvalidated: (data) =>
      dispatchNavigateToFeatureHybridEvent(
        hybridTargetToCallbackInputId,
        HybridTarget.CHALLENGE_INVALIDATED,
        data
      ),
    onModalChallengeAbandoned: null,
  });
  // Handle hybrid callbacks for initialize.
  if (result === false) {
    dispatchNavigateToFeatureHybridEvent(
      hybridTargetToCallbackInputId,
      HybridTarget.CHALLENGE_INITIALIZED,
      { initialized: false }
    );
    return false;
  }
  dispatchNavigateToFeatureHybridEvent(
    hybridTargetToCallbackInputId,
    HybridTarget.CHALLENGE_INITIALIZED,
    { initialized: true }
  );

  // Note that for other challenge types, this hybrid callback might be
  // triggered internally to the component.
  dispatchNavigateToFeatureHybridEvent(
    hybridTargetToCallbackInputId,
    HybridTarget.CHALLENGE_DISPLAYED,
    { displayed: true }
  );
  return true;
};

/**
 * Helper function for security questions hybrid challenges.
 */
const renderSecurityQuestionsChallengeFromQueryParameters = async (
  containerId: string,
  hybridTargetToCallbackInputId: Record<HybridTarget, string>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _appType: string
): Promise<boolean> => {
  const queryParameters = readQueryParametersForSecurityQuestions();
  // Handle hybrid callbacks for parse.
  if (queryParameters === null) {
    dispatchNavigateToFeatureHybridEvent(
      hybridTargetToCallbackInputId,
      HybridTarget.CHALLENGE_PARSED,
      { parsed: false }
    );
    return false;
  }
  dispatchNavigateToFeatureHybridEvent(
    hybridTargetToCallbackInputId,
    HybridTarget.CHALLENGE_PARSED,
    { parsed: true }
  );

  const { userId, sessionId } = queryParameters;
  const result = await SecurityQuestions.renderChallenge({
    containerId,
    userId,
    sessionId,
    renderInline: true,
    shouldDynamicallyLoadTranslationResources: true,
    onChallengeCompleted: (data) =>
      dispatchNavigateToFeatureHybridEvent(
        hybridTargetToCallbackInputId,
        HybridTarget.CHALLENGE_COMPLETED,
        data
      ),
    onChallengeInvalidated: (data) =>
      dispatchNavigateToFeatureHybridEvent(
        hybridTargetToCallbackInputId,
        HybridTarget.CHALLENGE_INVALIDATED,
        data
      ),
    onModalChallengeAbandoned: null,
  });
  // Handle hybrid callbacks for initialize.
  if (result === false) {
    dispatchNavigateToFeatureHybridEvent(
      hybridTargetToCallbackInputId,
      HybridTarget.CHALLENGE_INITIALIZED,
      { initialized: false }
    );
    return false;
  }
  dispatchNavigateToFeatureHybridEvent(
    hybridTargetToCallbackInputId,
    HybridTarget.CHALLENGE_INITIALIZED,
    { initialized: true }
  );

  // Note that for other challenge types, this hybrid callback might be
  // triggered internally to the component.
  dispatchNavigateToFeatureHybridEvent(
    hybridTargetToCallbackInputId,
    HybridTarget.CHALLENGE_DISPLAYED,
    { displayed: true }
  );
  return true;
};

/**
 * Helper function for re-authentication hybrid challenges.
 */
const renderReauthenticationChallengeFromQueryParameters = async (
  containerId: string,
  hybridTargetToCallbackInputId: Record<HybridTarget, string>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _appType: string
): Promise<boolean> => {
  // Re-authentication has no custom query parameters.
  dispatchNavigateToFeatureHybridEvent(
    hybridTargetToCallbackInputId,
    HybridTarget.CHALLENGE_PARSED,
    { parsed: true }
  );

  const result = await Reauthentication.renderChallenge({
    containerId,
    renderInline: true,
    shouldDynamicallyLoadTranslationResources: true,
    onChallengeCompleted: (data) =>
      dispatchNavigateToFeatureHybridEvent(
        hybridTargetToCallbackInputId,
        HybridTarget.CHALLENGE_COMPLETED,
        data
      ),
    onChallengeInvalidated: (data) =>
      dispatchNavigateToFeatureHybridEvent(
        hybridTargetToCallbackInputId,
        HybridTarget.CHALLENGE_INVALIDATED,
        data
      ),
    onModalChallengeAbandoned: null,
  });
  // Handle hybrid callbacks for initialize.
  if (result === false) {
    dispatchNavigateToFeatureHybridEvent(
      hybridTargetToCallbackInputId,
      HybridTarget.CHALLENGE_INITIALIZED,
      { initialized: false }
    );
    return false;
  }
  dispatchNavigateToFeatureHybridEvent(
    hybridTargetToCallbackInputId,
    HybridTarget.CHALLENGE_INITIALIZED,
    { initialized: true }
  );

  // Note that for other challenge types, this hybrid callback might be
  // triggered internally to the component.
  dispatchNavigateToFeatureHybridEvent(
    hybridTargetToCallbackInputId,
    HybridTarget.CHALLENGE_DISPLAYED,
    { displayed: true }
  );
  return true;
};

/**
 * Helper function for proof-of-work hybrid challenges.
 */
const renderProofOfWorkChallengeFromQueryParameters = async (
  containerId: string,
  hybridTargetToCallbackInputId: Record<HybridTarget, string>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _appType: string
): Promise<boolean> => {
  const queryParameters = readQueryParametersForProofOfWork();
  // Handle hybrid callbacks for parse.
  if (queryParameters === null) {
    dispatchNavigateToFeatureHybridEvent(
      hybridTargetToCallbackInputId,
      HybridTarget.CHALLENGE_PARSED,
      { parsed: false }
    );
    return false;
  }
  dispatchNavigateToFeatureHybridEvent(
    hybridTargetToCallbackInputId,
    HybridTarget.CHALLENGE_PARSED,
    { parsed: true }
  );

  const { sessionId } = queryParameters;
  const result = await ProofOfWork.renderChallenge({
    containerId,
    sessionId,
    renderInline: true,
    shouldDynamicallyLoadTranslationResources: true,
    onChallengeCompleted: (data) =>
      dispatchNavigateToFeatureHybridEvent(
        hybridTargetToCallbackInputId,
        HybridTarget.CHALLENGE_COMPLETED,
        data
      ),
    onChallengeInvalidated: (data) =>
      dispatchNavigateToFeatureHybridEvent(
        hybridTargetToCallbackInputId,
        HybridTarget.CHALLENGE_INVALIDATED,
        data
      ),
    onModalChallengeAbandoned: null,
  });
  // Handle hybrid callbacks for initialize.
  if (result === false) {
    dispatchNavigateToFeatureHybridEvent(
      hybridTargetToCallbackInputId,
      HybridTarget.CHALLENGE_INITIALIZED,
      { initialized: false }
    );
    return false;
  }
  dispatchNavigateToFeatureHybridEvent(
    hybridTargetToCallbackInputId,
    HybridTarget.CHALLENGE_INITIALIZED,
    { initialized: true }
  );

  // Note that for other challenge types, this hybrid callback might be
  // triggered internally to the component.
  dispatchNavigateToFeatureHybridEvent(
    hybridTargetToCallbackInputId,
    HybridTarget.CHALLENGE_DISPLAYED,
    { displayed: true }
  );
  return true;
};

/**
 * Helper function for generic hybrid challenges.
 */
const renderGenericChallengeFromQueryParameters = async (
  containerId: string,
  hybridTargetToCallbackInputId: Record<HybridTarget, string>,
  appType: string
): Promise<boolean> => {
  const challengeSpecificProperties = readQueryParametersForGenericChallenge();
  // Handle hybrid callbacks for parse.
  if (challengeSpecificProperties === null) {
    dispatchNavigateToFeatureHybridEvent(
      hybridTargetToCallbackInputId,
      HybridTarget.CHALLENGE_PARSED,
      { parsed: false }
    );
    return false;
  }
  dispatchNavigateToFeatureHybridEvent(
    hybridTargetToCallbackInputId,
    HybridTarget.CHALLENGE_PARSED,
    { parsed: true }
  );

  const result = await Generic.renderChallenge({
    challengeBaseProperties: {
      containerId,
      renderInline: true,
      shouldDynamicallyLoadTranslationResources: true,
      appType,
      shouldModifyBrowserHistory: true,
      onChallengeCompleted: (data) =>
        dispatchNavigateToFeatureHybridEvent(
          hybridTargetToCallbackInputId,
          HybridTarget.CHALLENGE_COMPLETED,
          data
        ),
      onChallengeInvalidated: (data) =>
        dispatchNavigateToFeatureHybridEvent(
          hybridTargetToCallbackInputId,
          HybridTarget.CHALLENGE_INVALIDATED,
          data
        ),
      onChallengeDisplayed: (data) =>
        dispatchNavigateToFeatureHybridEvent(
          hybridTargetToCallbackInputId,
          HybridTarget.CHALLENGE_DISPLAYED,
          data
        ),
      onModalChallengeAbandoned: null,
    },
    challengeSpecificProperties,
  });
  // Handle hybrid callbacks for initialize.
  if (result === false) {
    dispatchNavigateToFeatureHybridEvent(
      hybridTargetToCallbackInputId,
      HybridTarget.CHALLENGE_INITIALIZED,
      { initialized: false }
    );
    return false;
  }
  dispatchNavigateToFeatureHybridEvent(
    hybridTargetToCallbackInputId,
    HybridTarget.CHALLENGE_INITIALIZED,
    { initialized: true }
  );

  return true;
};

/**
 * Helper function for force authenticator hybrid challenges.
 */
const renderForceAuthenticatorChallengeFromQueryParameters = async (
  containerId: string,
  hybridTargetToCallbackInputId: Record<HybridTarget, string>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _appType: string
): Promise<boolean> => {
  // Force Authenticator has no custom query parameters.
  dispatchNavigateToFeatureHybridEvent(
    hybridTargetToCallbackInputId,
    HybridTarget.CHALLENGE_PARSED,
    { parsed: true }
  );

  const result = await ForceAuthenticator.renderChallenge({
    containerId,
    renderInline: true,
    shouldDynamicallyLoadTranslationResources: true,
    onModalChallengeAbandoned: null,
  });

  // Handle hybrid callbacks for initialize.
  if (result === false) {
    dispatchNavigateToFeatureHybridEvent(
      hybridTargetToCallbackInputId,
      HybridTarget.CHALLENGE_INITIALIZED,
      { initialized: false }
    );
    return false;
  }
  dispatchNavigateToFeatureHybridEvent(
    hybridTargetToCallbackInputId,
    HybridTarget.CHALLENGE_INITIALIZED,
    { initialized: true }
  );

  // Note that for other challenge types, this hybrid callback might be
  // triggered internally to the component.
  dispatchNavigateToFeatureHybridEvent(
    hybridTargetToCallbackInputId,
    HybridTarget.CHALLENGE_DISPLAYED,
    { displayed: true }
  );
  return true;
};

/**
 * Renders a hybrid challenge in a specific element based on the URL query
 * parameters.
 *
 * A hybrid challenge is one that calls back into a platform's native code by
 * following a designated calling convention.
 */
export const renderChallengeFromQueryParameters: RenderChallengeFromQueryParameters =
  async ({ containerId, hybridTargetToCallbackInputId }) => {
    // Immediately send a hybrid event to confirm that the DOM has loaded without
    // any DOM or JavaScript errors.
    dispatchNavigateToFeatureHybridEvent(
      hybridTargetToCallbackInputId,
      HybridTarget.CHALLENGE_PAGE_LOADED,
      { pageLoaded: true }
    );
    const queryParametersBase = readQueryParametersBase();
    // Handle hybrid callbacks for parse. The final parsed true callback will
    // happen in the individual challenge render functions, since each challenge
    // has some additional parameters it might parse.
    if (queryParametersBase === null) {
      dispatchNavigateToFeatureHybridEvent(
        hybridTargetToCallbackInputId,
        HybridTarget.CHALLENGE_PARSED,
        { parsed: false }
      );
      return false;
    }

    // Set dark or light mode theming.
    if (queryParametersBase.darkMode) {
      document.body.classList.remove(CLASS_LIGHT_MODE);
      document.body.classList.add(CLASS_DARK_MODE);
    } else {
      document.body.classList.remove(CLASS_DARK_MODE);
      document.body.classList.add(CLASS_LIGHT_MODE);
    }

    // Read more query parameters and render the specific challenge from the base
    // parameters.
    switch (queryParametersBase.challengeType) {
      case ChallengeType.CAPTCHA:
        return renderCaptchaChallengeFromQueryParameters(
          containerId,
          hybridTargetToCallbackInputId,
          queryParametersBase.appType
        );
      case ChallengeType.FORCE_AUTHENTICATOR:
        return renderForceAuthenticatorChallengeFromQueryParameters(
          containerId,
          hybridTargetToCallbackInputId,
          queryParametersBase.appType
        );
      case ChallengeType.TWO_STEP_VERIFICATION:
        return renderTwoStepVerificationChallengeFromQueryParameters(
          containerId,
          hybridTargetToCallbackInputId,
          queryParametersBase.appType
        );
      case ChallengeType.SECURITY_QUESTIONS:
        return renderSecurityQuestionsChallengeFromQueryParameters(
          containerId,
          hybridTargetToCallbackInputId,
          queryParametersBase.appType
        );
      case ChallengeType.REAUTHENTICATION:
        return renderReauthenticationChallengeFromQueryParameters(
          containerId,
          hybridTargetToCallbackInputId,
          queryParametersBase.appType
        );
      case ChallengeType.PROOF_OF_WORK:
        return renderProofOfWorkChallengeFromQueryParameters(
          containerId,
          hybridTargetToCallbackInputId,
          queryParametersBase.appType
        );
      case "generic":
        return renderGenericChallengeFromQueryParameters(
          containerId,
          hybridTargetToCallbackInputId,
          queryParametersBase.appType
        );
      default:
        // If we have handled all of the challenge types above, TypeScript will
        // infer `queryParametersBase` to have type `never` and the following
        // assignment should compile successfully.
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const assertCodeIsUnreachable: never =
          queryParametersBase.challengeType;
        return false;
    }
  };
