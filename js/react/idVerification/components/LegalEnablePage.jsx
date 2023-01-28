import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { Button, Modal } from "react-style-guide";
import HeartsIcon from "../../../../images/idVerification/hearts_large@3x.png";
import VoiceChatIcon from "../../../../images/idVerification/voicechat_large@3x.png";
import events from "../constants/idVerificationEventStreamConstants";
import {
  recordUserSeenUpsellModal,
  sendVoiceChatEvent,
} from "../services/voiceChatService";
import useVoiceConsentForm from "./useVoiceConsentForm";

const ICON_SIZE = 60;

function LegalEnablePage({
  translate,
  onHide,
  heading,
  icon,
  buttonStack,
  exitBetaButtonStack,
  implicitConsent,
  explicitConsent,
  enableVoiceChat,
  exitBetaHeading,
  exitBetaEnableMicrophone,
  followCommunityStandards,
  requireExplicitVoiceConsent,
  useExitBetaLanguage,
  learnMoreAboutVoiceRecording,
  communityStandardsUrl,
  voiceFAQUrl,
  exitBetaChatWithVoiceUrl,
}) {
  const [checkbox, buttons] = useVoiceConsentForm(
    translate,
    buttonStack,
    exitBetaButtonStack,
    implicitConsent,
    explicitConsent,
    requireExplicitVoiceConsent,
    useExitBetaLanguage
  );

  useEffect(() => {
    sendVoiceChatEvent(events.showEnableVoiceChatModal);
    recordUserSeenUpsellModal();
  }, []);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        sendVoiceChatEvent(events.closeEnableVoiceChatModal);
      }
    }

    const div = document.querySelector(".email-upsell-modal");
    div.addEventListener("keydown", handleKeyDown);
  }, []);

  const exitBetaLanguageEnable = (
    <p
      className="legal-enable-page-row-label"
      dangerouslySetInnerHTML={{
        __html: translate(exitBetaEnableMicrophone, {
          linkStart: `<a class="text-name" target="_blank" rel="noreferrer" href=${exitBetaChatWithVoiceUrl}>`,
          linkEnd: "</a>",
        }),
      }}
    />
  );

  const betaLanguageEnable = (
    <p className="legal-enable-page-row-label">{translate(enableVoiceChat)}</p>
  );

  return (
    <React.Fragment>
      <Modal.Header useBaseBootstrapComponent>
        <div className="email-upsell-title-container">
          <Modal.Title id="contained-modal-title-vcenter">
            {useExitBetaLanguage
              ? translate(exitBetaHeading)
              : translate(heading)}
          </Modal.Title>
        </div>
      </Modal.Header>
      <Modal.Body>
        {icon && <div className={icon} />}
        <div>
          <div className="legal-enable-page-row">
            <img
              width={ICON_SIZE}
              height={ICON_SIZE}
              src={VoiceChatIcon}
              alt=""
            />
            {useExitBetaLanguage ? exitBetaLanguageEnable : betaLanguageEnable}
          </div>
          <div className="legal-enable-page-row">
            <img width={ICON_SIZE} height={ICON_SIZE} src={HeartsIcon} alt="" />
            <p
              className="legal-enable-page-row-label"
              dangerouslySetInnerHTML={{
                __html: translate(followCommunityStandards, {
                  linkStart: `<a class="text-name" target="_blank" rel="noreferrer" href=${communityStandardsUrl}>`,
                  linkEnd: "</a>",
                }),
              }}
            />
          </div>
        </div>
        {checkbox}
      </Modal.Body>
      <Modal.Footer>{buttons}</Modal.Footer>
      <div className="text-footer legal-enable-page-text-footer border-top">
        <span>
          <div className="icon-moreinfo" />
          <a
            className="text-link legal-enable-page-text-footer-link"
            target="_blank"
            rel="noreferrer"
            href={voiceFAQUrl}
          >
            {translate(learnMoreAboutVoiceRecording) ||
              "Learn More about Voice Recording"}
          </a>
        </span>
      </div>
    </React.Fragment>
  );
}

LegalEnablePage.propTypes = {
  translate: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  heading: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  enableVoiceChat: PropTypes.string.isRequired,
  exitBetaHeading: PropTypes.string.isRequired,
  exitBetaEnableMicrophone: PropTypes.string.isRequired,
  followCommunityStandards: PropTypes.string.isRequired,
  buttonStack: PropTypes.arrayOf(
    PropTypes.shape({
      variant: PropTypes.oneOf(Button.variants),
      text: PropTypes.string,
      callback: PropTypes.func,
    })
  ).isRequired,
  exitBetaButtonStack: PropTypes.arrayOf(
    PropTypes.shape({
      variant: PropTypes.oneOf(Button.variants),
      text: PropTypes.string,
      callback: PropTypes.func,
    })
  ).isRequired,
  implicitConsent: PropTypes.string.isRequired,
  explicitConsent: PropTypes.string.isRequired,
  requireExplicitVoiceConsent: PropTypes.bool.isRequired,
  useExitBetaLanguage: PropTypes.bool.isRequired,
  learnMoreAboutVoiceRecording: PropTypes.string.isRequired,
  communityStandardsUrl: PropTypes.string.isRequired,
  voiceFAQUrl: PropTypes.string.isRequired,
  exitBetaChatWithVoiceUrl: PropTypes.string.isRequired,
};

export default LegalEnablePage;
