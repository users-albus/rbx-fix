import React from "react";
import Roblox from "Roblox";
import { render } from "react-dom";
import { ready } from "core-utilities";
import { rootElementId } from "./app.config";
import "../../../css/idVerification/emailUpsell.scss";
import "../../../css/idVerification/viewTemplate.scss";
import App from "./App";
import {
  getVerificationStatus,
  getVerifiedAge,
  startVerificationFlow,
  sendIdVerificationEvent,
  showBirthdayChangeWarning,
} from "./services/ageVerificationServices";
import { showVoiceOptInOverlay } from "./services/voiceChatService";
import { isIDVerificationEnabled } from "./services/accountInfoService";

// Expose service to internal apps
Roblox.IdentityVerificationService = {
  getVerificationStatus,
  getVerifiedAge,
  startVerificationFlow,
  sendIdVerificationEvent,
  showBirthdayChangeWarning,
  showVoiceOptInOverlay,
};

function renderApp() {
  const entryPoint = document.getElementById(rootElementId);
  if (entryPoint) {
    const entryAttr = entryPoint.getAttribute("entry");
    if (entryAttr !== null) {
      render(<App entry={entryAttr} />, entryPoint);
    } else {
      render(<App />, entryPoint);
    }
  } else {
    // Recursively call renderApp if target div not found
    // Callback will be triggered before every repaint
    window.requestAnimationFrame(renderApp);
  }
}
ready(() => {
  if (rootElementId) {
    isIDVerificationEnabled().then(
      (isFeatureEnabled) => {
        if (isFeatureEnabled) {
          renderApp();
        }
      },
      () => {
        // If account info metadata endpoint is broken,
        // show the ID verif screen anyway
        renderApp();
      }
    );
  }
});
