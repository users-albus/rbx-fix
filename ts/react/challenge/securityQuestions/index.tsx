/* eslint-disable import/prefer-default-export */
import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import "../../../../css/challenge/securityQuestions/securityQuestions.scss";
import "../../../../css/common/modalModern.scss";
import "../../../../css/common/spinner.scss";
import { RequestServiceDefault } from "../../../common/request";
import App from "./App";
import {
  COMMON_UI_MESSAGES_LANGUAGE_RESOURCES,
  LOG_PREFIX,
  SECURITY_QUESTIONS_LANGUAGE_RESOURCES,
  TRANSLATION_CONFIG,
} from "./app.config";
import { RenderChallenge } from "./interface";
import { EventServiceDefault } from "./services/eventService";

// Global instance since we do not need Security Questions parameters for
// instantiation.
const requestServiceDefault = new RequestServiceDefault();

// Export some additional enums that are declared in the shared interface (they
// are also defined in the shared interface, but we need to expose them in the
// object hierarchy for the challenge component).
export { ErrorCode } from "./interface";

/**
 * Renders the Security Questions Challenge UI for a given set of parameters.
 * Returns whether the UI could be successfully rendered.
 */
export const renderChallenge: RenderChallenge = async ({
  containerId,
  userId,
  sessionId,
  renderInline,
  shouldDynamicallyLoadTranslationResources,
  onChallengeCompleted,
  onChallengeInvalidated,
  onModalChallengeAbandoned,
}) => {
  // Explicitly coerce user ID to string. Unlike some of the other challenge
  // services, the Security Questions API will reject requests that try to pass
  // user ID as a number; since user ID is (erroneously) stored as number across
  // much of the front-end, this coercion will prevent a common bug.
  // eslint-disable-next-line no-param-reassign
  userId = userId.toString();

  const container = document.getElementById(containerId);
  if (container !== null) {
    // Remove any existing instances of the app.
    unmountComponentAtNode(container);

    // Request language resources dynamically (so this component can use CDN).
    // Populate them on `Roblox.Lang` so we can use standard I18N tooling.
    if (shouldDynamicallyLoadTranslationResources) {
      let result =
        await requestServiceDefault.translations.queryAndOverwriteResourcesForNamespace(
          TRANSLATION_CONFIG.feature,
          SECURITY_QUESTIONS_LANGUAGE_RESOURCES
        );
      if (result.isError) {
        // eslint-disable-next-line no-console
        console.error(
          LOG_PREFIX,
          `Got error code ${
            result.error?.toString() || "null"
          } loading translations`
        );
        return false;
      }

      result =
        await requestServiceDefault.translations.queryAndOverwriteResourcesForNamespace(
          TRANSLATION_CONFIG.common[0], // `CommonUI.Messages`.
          COMMON_UI_MESSAGES_LANGUAGE_RESOURCES
        );
      if (result.isError) {
        // eslint-disable-next-line no-console
        console.error(
          LOG_PREFIX,
          `Got error code ${
            result.error?.toString() || "null"
          } loading translations`
        );
        return false;
      }
    }

    // Instantiate services externally to the app, which will offer future
    // flexibility (e.g. for mocking).
    const eventService = new EventServiceDefault(sessionId);

    // Render the app on the selected element.
    render(
      <App
        userId={userId}
        sessionId={sessionId}
        renderInline={renderInline}
        eventService={eventService}
        requestService={requestServiceDefault}
        onChallengeCompleted={onChallengeCompleted}
        onChallengeInvalidated={onChallengeInvalidated}
        onModalChallengeAbandoned={onModalChallengeAbandoned}
      />,
      container
    );
    return true;
  }

  return false;
};
