/* eslint-disable import/prefer-default-export */
import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import "../../../../css/challenge/proofOfWork/proofOfWork.scss";
import { RequestServiceDefault } from "../../../common/request";
import App from "./App";
import {
  LOG_PREFIX,
  PROOF_OF_WORK_LANGUAGE_RESOURCES,
  TRANSLATION_CONFIG,
} from "./app.config";
import { RenderChallenge } from "./interface";
import { EventServiceDefault } from "./services/eventService";
import { MetricsServiceDefault } from "./services/metricsService";

// Export some additional enums that are declared in the shared interface (they
// are also defined in the shared interface, but we need to expose them in the
// object hierarchy for the challenge component).
export { ErrorCode } from "./interface";

// Global instance since we do not need Proof-of-Work parameters for
// instantiation.
const requestServiceDefault = new RequestServiceDefault();

/**
 * Renders the Proof-of-Work Challenge UI for a given set of parameters.
 * Returns whether the UI could be successfully rendered.
 */
export const renderChallenge: RenderChallenge = async ({
  containerId,
  sessionId,
  appType,
  renderInline,
  shouldDynamicallyLoadTranslationResources,
  onChallengeCompleted,
  onChallengeInvalidated,
  onModalChallengeAbandoned,
}) => {
  const container = document.getElementById(containerId);
  if (container !== null) {
    // Remove any existing instances of the app.
    unmountComponentAtNode(container);

    // Request language resources dynamically (so this component can use CDN).
    // Populate them on `Roblox.Lang` so we can use standard I18N tooling.
    if (shouldDynamicallyLoadTranslationResources) {
      const result =
        await requestServiceDefault.translations.queryAndOverwriteResourcesForNamespace(
          TRANSLATION_CONFIG.feature,
          PROOF_OF_WORK_LANGUAGE_RESOURCES
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
    // Render the app on the selected element.

    // Instantiate services externally to the app, which will offer future
    // flexibility (e.g. for mocking).
    const eventService = new EventServiceDefault(sessionId);
    const metricsService = new MetricsServiceDefault(
      appType,
      requestServiceDefault
    );
    render(
      <App
        sessionId={sessionId}
        renderInline={renderInline}
        eventService={eventService}
        metricsService={metricsService}
        requestService={requestServiceDefault}
        onChallengeCompleted={onChallengeCompleted}
        onChallengeInvalidated={onChallengeInvalidated}
        onModalChallengeAbandoned={onModalChallengeAbandoned}
      />,
      container
    );
    eventService.sendChallengeInitializedEvent();
    metricsService.fireChallengeInitializedEvent();
    return true;
  }

  return false;
};
