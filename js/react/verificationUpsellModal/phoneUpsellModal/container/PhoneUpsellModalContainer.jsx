import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { Modal } from "react-style-guide";
import { DeviceMeta } from "Roblox";
import { originValues } from "../../common/constants/loggingConstants";
import { sendVerificationUpsellEvent } from "../../common/utils/loggingUtils";
import {
  CLOSE_PHONE_NUMBER_MODAL,
  SET_LOGGING_VALUES,
} from "../actions/actionTypes";
// components
import AddPhoneNumber from "../components/AddPhoneNumber";
import AddPhoneSuccess from "../components/AddPhoneSuccess";
import PhoneDiscoverabilityConsent from "../components/PhoneDiscoverabilityConsent";
import VerifyPhoneNumber from "../components/VerifyPhoneNumber";
// pages
import {
  ADD_PHONE_NUMBER_PAGE,
  ADD_PHONE_SUCCESS_PAGE,
  PHONE_DISCOVERABILITY_CONSENT_PAGE,
  VERIFY_PHONE_NUMBER_PAGE,
} from "../constants/pageConstants";
import events from "../constants/phoneVerificationEventStreamConstants";
import usePhoneUpsellState from "../hooks/usePhoneUpsellState";
import getSectionValueForPage from "../utils/loggingUtils";

function PhoneUpsellModalContainer({ translate, onClose, origin }) {
  const { phoneUpsellState, dispatch } = usePhoneUpsellState();
  const section = getSectionValueForPage(phoneUpsellState.pageName);
  const { isInApp } = DeviceMeta ? DeviceMeta() : false;

  const onHide = () => {
    if (isInApp) {
      // don't allow modal to close when shown in a webview. The webview itself
      // should be closed instead.
      return;
    }
    sendVerificationUpsellEvent(events.phoneNumberModalDismissed, {
      origin: phoneUpsellState.origin,
      section,
    });
    onClose(phoneUpsellState.isPhoneVerified);
    dispatch({ type: CLOSE_PHONE_NUMBER_MODAL });
  };
  const modalContent = () => {
    switch (phoneUpsellState.pageName) {
      case ADD_PHONE_NUMBER_PAGE:
        return <AddPhoneNumber translate={translate} onHide={onHide} />;
      case VERIFY_PHONE_NUMBER_PAGE:
        return <VerifyPhoneNumber translate={translate} onHide={onHide} />;
      case ADD_PHONE_SUCCESS_PAGE:
        return <AddPhoneSuccess translate={translate} onHide={onHide} />;
      case PHONE_DISCOVERABILITY_CONSENT_PAGE:
        return (
          <PhoneDiscoverabilityConsent
            translate={translate}
            onHide={onHide}
            origin={phoneUpsellState.origin}
            shouldPrefillAffirmativeDiscoverabilityConsent={
              phoneUpsellState.shouldPrefillAffirmativeDiscoverabilityConsent
            }
          />
        );
      default:
        return <AddPhoneNumber translate={translate} onHide={onHide} />;
    }
  };

  useEffect(() => {
    // don't log impression until the origin value is set in state.
    if (phoneUpsellState.origin !== originValues.unset) {
      sendVerificationUpsellEvent(events.phoneNumberModalShown, {
        origin: phoneUpsellState.origin,
        section,
      });
    }
  }, [phoneUpsellState.pageName, phoneUpsellState.origin]);

  useEffect(() => {
    // set initial state
    dispatch({ type: SET_LOGGING_VALUES, origin });
  }, []);

  return (
    <Modal
      show={phoneUpsellState.isOpen}
      onHide={onHide}
      /* eslint-enable */
      className={
        isInApp
          ? "verification-modal phone-verification-webview"
          : "verification-modal"
      }
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      scrollable="true"
      centered="true"
    >
      {modalContent()}
    </Modal>
  );
}

PhoneUpsellModalContainer.propTypes = {
  translate: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  origin: PropTypes.string,
};

PhoneUpsellModalContainer.defaultProps = {
  origin: originValues.homepage, // homepage is default origin
};

export default PhoneUpsellModalContainer;
