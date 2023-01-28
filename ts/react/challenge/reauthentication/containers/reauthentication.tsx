import React, { useState } from "react";
import { Modal } from "react-style-guide";
import InlineChallenge from "../../../common/inlineChallenge";
import InlineChallengeBody from "../../../common/inlineChallengeBody";
import { InlineChallengeFooter } from "../../../common/inlineChallengeFooter";
import InputControl, { validateTrue } from "../../../common/inputControl";
import {
  FooterButtonConfig,
  FragmentModalFooter,
} from "../../../common/modalFooter";
import {
  FragmentModalHeader,
  HeaderButtonType,
} from "../../../common/modalHeader";
import ForgotYourPasswordLink from "../components/forgotYourPasswordLink";
import { mapReauthenticationErrorToResource } from "../constants/resources";
import useReauthenticationContext from "../hooks/useReauthenticationContext";
import { ReauthenticationActionType } from "../store/action";

/**
 * A container element for the Re-authentication UI. For now, we lump most
 * business logic into this component; in the future, different question types
 * might get split out.
 *
 * TODO: Consider splitting this component up if it gets much larger.
 */
const Reauthentication: React.FC = () => {
  const {
    state: {
      renderInline,
      resources,
      requestService,
      onModalChallengeAbandoned,
      isModalVisible,
    },
    dispatch,
  } = useReauthenticationContext();

  /*
   * Component State
   */

  const [password, setPassword] = useState<string>("");
  const [requestInFlight, setRequestInFlight] = useState<boolean>(false);
  const [requestError, setRequestError] = useState<string | null>(null);

  /*
   * Event Handlers
   */

  const clearRequestError = () => setRequestError(null);

  const closeModal = () => {
    dispatch({
      type: ReauthenticationActionType.HIDE_MODAL_CHALLENGE,
    });
    if (onModalChallengeAbandoned !== null) {
      onModalChallengeAbandoned(() =>
        dispatch({
          type: ReauthenticationActionType.SHOW_MODAL_CHALLENGE,
        })
      );
    }
  };

  const verifyPassword = async () => {
    // Check password and generate token if correct.
    setRequestInFlight(true);
    const result = await requestService.reauthentication.generateToken(
      password
    );

    // Request failures on this endpoint are considered transient (the requests
    // can be tried again, potentially after changing the password).
    if (result.isError) {
      setRequestError(
        `${mapReauthenticationErrorToResource(resources, result.error)} ${
          resources.Action.PleaseTryAgain
        }`
      );
      setRequestInFlight(false);
      return;
    }

    // Handle request success (token generated).
    setRequestError(null);
    dispatch({
      type: ReauthenticationActionType.SET_CHALLENGE_COMPLETED,
      onChallengeCompletedData: {
        reauthenticationToken: result.value.token,
      },
    });
  };

  /*
   * Render Properties
   */

  const positiveButton: FooterButtonConfig = {
    // Show a spinner as the button content when a request is in flight.
    content: requestInFlight ? (
      <span className="spinner spinner-xs spinner-no-margin" />
    ) : (
      resources.Action.Verify
    ),
    label: resources.Action.Verify,
    enabled: !requestInFlight && password.length > 0,
    action: verifyPassword,
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
    const marginBottomXLargeClassName = renderInline
      ? "inline-challenge-margin-bottom-xlarge"
      : "modal-margin-bottom-xlarge";

    return (
      <React.Fragment>
        <BodyElement>
          <div className={lockIconClassName} />
          <p className={marginBottomXLargeClassName}>
            {resources.Description.EnterYourPassword}
          </p>

          <InputControl
            id="reauthentication-password-input"
            inputType="password"
            disabled={requestInFlight}
            value={password}
            setValue={setPassword}
            error={requestError}
            setError={setRequestError}
            validate={validateTrue}
            canSubmit={password.length > 0}
            handleSubmit={verifyPassword}
            onChange={clearRequestError}
            // Optional parameters:
            autoComplete="off"
            placeholder={resources.Label.YourPassword}
            hideFeedback
          />

          <p>
            <ForgotYourPasswordLink />
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
    <InlineChallenge titleText={resources.Header.PasswordVerification}>
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
        headerText={resources.Header.PasswordVerification}
        buttonType={HeaderButtonType.CLOSE}
        buttonAction={closeModal}
        buttonEnabled={!requestInFlight}
        headerInfo={null}
      />
      {getPageContent()}
    </Modal>
  );
};

export default Reauthentication;
