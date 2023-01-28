import React from "react";
import { Modal } from "react-style-guide";
import InlineChallenge from "../../../common/inlineChallenge";
import InlineChallengeBody from "../../../common/inlineChallengeBody";
import { InlineChallengeFooter } from "../../../common/inlineChallengeFooter";
import {
  FooterButtonConfig,
  FragmentModalFooter,
} from "../../../common/modalFooter";
import {
  FragmentModalHeader,
  HeaderButtonType,
} from "../../../common/modalHeader";
import {
  ACCOUNT_SETTINGS_SECURITY_PATH,
  REDIRECT_URL_SIGNIFIER,
} from "../app.config";
import useForceAuthenticatorContext from "../hooks/useForceAuthenticatorContext";
import { ForceAuthenticatorActionType } from "../store/action";

/**
 * A container element for the Force Authenticator modal UI.
 */
const ForceAuthenticator: React.FC = () => {
  const {
    state: {
      renderInline,
      resources,
      onModalChallengeAbandoned,
      isModalVisible,
    },
    dispatch,
  } = useForceAuthenticatorContext();

  /*
   * Event Handlers
   */

  const closeModal = () => {
    dispatch({
      type: ForceAuthenticatorActionType.HIDE_MODAL_CHALLENGE,
    });
    if (onModalChallengeAbandoned !== null) {
      onModalChallengeAbandoned(() =>
        dispatch({
          type: ForceAuthenticatorActionType.SHOW_MODAL_CHALLENGE,
        })
      );
    }
  };

  /*
   * Render Properties
   */

  const positiveButton: FooterButtonConfig = {
    content: resources.Action.Setup,
    label: resources.Action.Setup,
    enabled: true,
    action: () => {
      closeModal();
      // The `_self` target opens the redirect URL in the current page.
      window.open(
        ACCOUNT_SETTINGS_SECURITY_PATH + REDIRECT_URL_SIGNIFIER,
        "_self"
      );
    },
  };

  /*
   * Rendering Helpers
   */

  const getPageContent = () => {
    const BodyElement = renderInline ? InlineChallengeBody : Modal.Body;
    const FooterElement = renderInline
      ? InlineChallengeFooter
      : FragmentModalFooter;
    const lockIconClassName = renderInline
      ? "inline-challenge-lock-icon"
      : "modal-lock-icon";
    const marginBottomSmallClassName = renderInline
      ? "inline-challenge-margin-bottom-sm"
      : "modal-margin-bottom-sm";
    const marginBottomXLargeClassName = renderInline
      ? "inline-challenge-margin-bottom-xlarge"
      : "modal-margin-bottom-xlarge";

    return (
      <React.Fragment>
        <BodyElement>
          <div className={lockIconClassName} />
          <p className={marginBottomSmallClassName}>
            {resources.Description.SetupAuthenticator}
          </p>
          <p className={marginBottomXLargeClassName}>
            {resources.Description.Reason}
          </p>
        </BodyElement>
        <FooterElement positiveButton={positiveButton} negativeButton={null} />
      </React.Fragment>
    );
  };

  /*
   * Component Markup
   */

  return renderInline ? (
    <InlineChallenge titleText={resources.Header.TurnOnAuthenticator}>
      {getPageContent()}
    </InlineChallenge>
  ) : (
    <Modal
      className="modal-modern"
      show={isModalVisible}
      onHide={closeModal}
      backdrop="static"
    >
      <FragmentModalHeader
        headerText={resources.Header.TurnOnAuthenticator}
        buttonType={HeaderButtonType.CLOSE}
        buttonAction={closeModal}
        buttonEnabled
        headerInfo={null}
      />
      {getPageContent()}
    </Modal>
  );
};

export default ForceAuthenticator;
