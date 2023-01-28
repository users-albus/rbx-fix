import React, { Fragment, useEffect, useState } from "react";
import { Button, Modal } from "react-style-guide";
import {
  useDebounce,
  withTranslations,
  WithTranslationsProps,
} from "react-utilities";
import {
  TEmailVerifyCodeModalAction,
  emailVerifyCodeModalActionType,
} from "../store/emailVerifyCodeModalStoreContext";
import {
  enterEmailStrings,
  emailLengthLimit,
} from "../constants/EmailVerifyCodeModalConstants";
import { loginTranslationConfig } from "../translation.config";
import { isValidEmail } from "../../common/utils/formUtils";
import EVENT_CONSTANTS from "../../common/constants/eventsConstants";
import {
  sendOtpPageLoadEvent,
  sendOtpButtonClickEvent,
  sendEmailInputEvent,
} from "../services/eventService";

export type enterEmailPageProps = {
  titleText: string;
  descriptionText: string;
  onSendCode: () => void;
  email: string;
  errorMessage: string;
  onClose: () => void;
  dispatch: React.Dispatch<TEmailVerifyCodeModalAction>;
  translate: WithTranslationsProps["translate"];
};

const EnterEmailPage = ({
  titleText,
  descriptionText,
  onSendCode,
  email,
  errorMessage,
  onClose,
  dispatch,
  translate,
}: enterEmailPageProps): JSX.Element => {
  const [isFirstEmailChange, setIsFirstEmailChange] = useState(true);

  const context = EVENT_CONSTANTS.context.sendOTP;
  const debouncedEmail = useDebounce(email, 200);

  const handleEmailChange = (newEmail: string) => {
    dispatch({
      type: emailVerifyCodeModalActionType.SET_EMAIL,
      email: newEmail,
    });
  };

  const handleSendCode = () => {
    sendOtpButtonClickEvent(context, EVENT_CONSTANTS.btn.sendCode);
    onSendCode();
  };

  const handleEmailKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && isValidEmail(email)) {
      handleSendCode();
    }
  };

  useEffect(() => {
    if (isFirstEmailChange && email.length > 0) {
      setIsFirstEmailChange(false);
      sendEmailInputEvent();
    }

    if (!isValidEmail(debouncedEmail) && debouncedEmail.length > 0) {
      dispatch({
        type: emailVerifyCodeModalActionType.SET_ERROR,
        errorMessage: translate(enterEmailStrings.InvalidEmail),
      });
    } else {
      // clear error message from failed send code request
      dispatch({
        type: emailVerifyCodeModalActionType.SET_ERROR,
        errorMessage: "",
      });
    }
  }, [debouncedEmail]);

  const handleClose = (): void => {
    sendOtpButtonClickEvent(context, EVENT_CONSTANTS.btn.cancel);
    onClose();
  };

  useEffect(() => {
    sendOtpPageLoadEvent(context);
  }, []);

  return (
    <Fragment>
      <Modal.Header title={titleText} onClose={handleClose} />
      <Modal.Body>
        <p className="email-verify-code-help-text">{descriptionText}</p>
        <input
          placeholder={translate(enterEmailStrings.EmailPlaceholder)}
          onChange={(e) => handleEmailChange(e.target.value)}
          type="email"
          /* eslint-disable */
          autoFocus
          /* eslint-enable */
          className="form-control input-field email-verify-code-input"
          autoComplete="email"
          maxLength={emailLengthLimit}
          onKeyPress={handleEmailKeyPress}
          value={email}
        />
        <p className="text-error input-validation email-verify-code-error-text">
          {errorMessage}
        </p>
        <Button
          className="email-verify-code-button"
          variant={Button.variants.secondary}
          isDisabled={!isValidEmail(email)}
          onClick={handleSendCode}
        >
          {translate(enterEmailStrings.SendCode)}
        </Button>
      </Modal.Body>
    </Fragment>
  );
};

export default withTranslations(EnterEmailPage, loginTranslationConfig);
