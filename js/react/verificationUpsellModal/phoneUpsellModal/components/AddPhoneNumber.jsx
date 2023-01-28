import PropTypes from "prop-types";
import React, { useState } from "react";
import { Button, Modal } from "react-style-guide";
import { DeviceMeta } from "Roblox";
import { phoneUpsellStrings } from "../../common/constants/translationConstants";
import {
  getErrorEventWithErrorCodeParam,
  sendVerificationUpsellEvent,
} from "../../common/utils/loggingUtils";
import getErrorCodeFromRequestError from "../../common/utils/requestUtils";
import { SET_ERROR_MESSAGE, SET_PAGE } from "../actions/actionTypes";
import { VERIFY_PHONE_NUMBER_PAGE } from "../constants/pageConstants";
import events from "../constants/phoneVerificationEventStreamConstants";
import usePhoneUpsellState from "../hooks/usePhoneUpsellState";
import { setPhoneNumber } from "../services/phoneService";
import { getErrorMessageFromSubmissionErrorCode } from "../utils/errorUtils";
import getSectionValueForPage from "../utils/loggingUtils";
import InputFieldError from "./InputFieldError";
import PhoneNumberInput from "./PhoneNumberInput";

const {
  ActionAddPhoneNumber,
  ActionContinue,
  DescriptionVerificationCodeSmsFeesMayApply,
  DescriptionPhoneNumberNeverPublic,
} = phoneUpsellStrings;
const { isInApp } = DeviceMeta ? DeviceMeta() : false;
const shouldHideCloseButton = isInApp; // if shown in a webview, rely on the webview's native buttons for closing instead

function AddPhoneNumber({ translate, onHide }) {
  const { phoneUpsellState, dispatch } = usePhoneUpsellState();
  const {
    phone,
    phonePrefixPickerIndex,
    phonePrefixOptionsList,
    pageName,
    origin,
  } = phoneUpsellState;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const section = getSectionValueForPage(pageName);
  const handleContinueClick = async () => {
    setIsSubmitting(true);
    const { prefix, code } = phonePrefixOptionsList[phonePrefixPickerIndex];
    sendVerificationUpsellEvent(events.addPhoneContinuePressed, {
      origin,
      section,
    });
    await setPhoneNumber({ phone, prefix, countryCode: code })
      .then(() => {
        // TODO: add loading UI
        dispatch({ type: SET_PAGE, pageName: VERIFY_PHONE_NUMBER_PAGE });
      })
      .catch((err) => {
        const errorCode = getErrorCodeFromRequestError(err);
        const errorEvent = getErrorEventWithErrorCodeParam(
          events.phoneNumberModalErrorShown,
          errorCode
        );
        sendVerificationUpsellEvent(errorEvent, {
          origin,
          section,
        });
        dispatch({
          type: SET_ERROR_MESSAGE,
          errorMessage: getErrorMessageFromSubmissionErrorCode(errorCode),
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div>
      <Modal.Header useBaseBootstrapComponent>
        <div className="verification-upsell-title-container">
          <button
            type="button"
            hidden={shouldHideCloseButton}
            className="verification-upsell-title-button"
            onClick={onHide}
          >
            <span className="close icon-close" />
          </button>
          <Modal.Title id="contained-modal-title-vcenter">
            {translate(ActionAddPhoneNumber)}
          </Modal.Title>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className="phone-number-submission-container">
          <div className="verification-upsell-text-body text-description">
            {translate(DescriptionVerificationCodeSmsFeesMayApply)}
          </div>
          <PhoneNumberInput translate={translate} />
          <InputFieldError translate={translate} />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="phone-verification-nonpublic-text text-description font-caption-body">
          {translate(DescriptionPhoneNumberNeverPublic)}
        </div>
        <div className="buttons-section">
          <Button
            type="button"
            id="add-phone-number-continue-button"
            className="accept-btn"
            variant={Button.variants.primary}
            isDisabled={isSubmitting || phone.length === 0}
            onClick={() => handleContinueClick()}
          >
            {translate(ActionContinue)}
          </Button>
        </div>
      </Modal.Footer>
    </div>
  );
}

AddPhoneNumber.propTypes = {
  translate: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
};

export default AddPhoneNumber;
