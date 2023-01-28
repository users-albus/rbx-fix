import PropTypes from "prop-types";
import React from "react";
import { Modal } from "react-style-guide";
import { DeviceMeta, Hybrid } from "Roblox";
import { phoneUpsellStrings } from "../../common/constants/translationConstants";
import { webviewConstants } from "../../common/constants/webviewConstants";
import { sendVerificationUpsellEvent } from "../../common/utils/loggingUtils";
import { CLOSE_PHONE_NUMBER_MODAL } from "../actions/actionTypes";
import events from "../constants/phoneVerificationEventStreamConstants";
import usePhoneUpsellState from "../hooks/usePhoneUpsellState";
import getSectionValueForPage from "../utils/loggingUtils";

function AddPhoneSuccess({ translate }) {
  const { phoneUpsellState, dispatch } = usePhoneUpsellState();
  const { CloseContactMethodUpsellWebview } = webviewConstants;
  const { origin, pageName } = phoneUpsellState;
  const { HeadingPhoneIsVerified, DescriptionPhoneForRecovery, ActionDone } =
    phoneUpsellStrings;

  const { isInApp } = DeviceMeta ? DeviceMeta() : false;
  const section = getSectionValueForPage(pageName);

  const handleDoneClick = () => {
    sendVerificationUpsellEvent(events.phoneAddedDonePressed, {
      origin,
      section,
    });
    if (isInApp && Hybrid && Hybrid.Navigation) {
      // if in a webview, dispatch JS event for Lua webview to interpret
      Hybrid.Navigation.navigateToFeature({
        feature: CloseContactMethodUpsellWebview,
      });
    } else {
      dispatch({ type: CLOSE_PHONE_NUMBER_MODAL });
    }
  };

  return (
    <div>
      <Modal.Body>
        <div className="phone-number-verification-upsell-image" />
        <div className="verification-upsell-title-container phone-number-verification-success-page-title page-title">
          <Modal.Title id="contained-modal-title-vcenter">
            {translate(HeadingPhoneIsVerified)}
          </Modal.Title>
        </div>
        <div className="phone-number-verification-text-body text-description">
          {translate(DescriptionPhoneForRecovery)}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button
          type="button"
          className="btn-cta-md btn-max-width phone-number-verify-button"
          onClick={handleDoneClick}
        >
          {translate(ActionDone)}
        </button>
      </Modal.Footer>
    </div>
  );
}

AddPhoneSuccess.propTypes = {
  translate: PropTypes.func.isRequired,
};

export default AddPhoneSuccess;
