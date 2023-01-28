/* eslint-disable import/prefer-default-export */
import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import "../../../../css/common/modalModern.scss";
import "../../../../css/common/spinner.scss";
import { RequestServiceDefault } from "../../../common/request";
import App from "./App";
import {
  FORCE_AUTHENTICATOR_LANGUAGE_RESOURCES,
  LOG_PREFIX,
  TRANSLATION_CONFIG,
} from "./app.config";
import { RenderChallenge } from "./interface";

// Global instance since we do not need force authenticator parameters for
// instantiation.
const requestServiceDefault = new RequestServiceDefault();

// Export some additional enums that are declared in the shared interface (they
// are also defined in the shared interface, but we need to expose them in the
// object hierarchy for the challenge component).
export { ErrorCode } from "./interface";

/**
 * Renders the Force Authenticator Challenge UI for a given set of parameters.
 * Returns whether the UI could be successfully rendered.
 */
export const renderChallenge: RenderChallenge = async ({
  containerId,
  renderInline,
  shouldDynamicallyLoadTranslationResources,
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
          FORCE_AUTHENTICATOR_LANGUAGE_RESOURCES
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
    render(
      <App
        renderInline={renderInline}
        onModalChallengeAbandoned={onModalChallengeAbandoned}
      />,
      container
    );
    return true;
  }

  return false;
};
