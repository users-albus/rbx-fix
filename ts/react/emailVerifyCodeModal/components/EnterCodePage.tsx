import React, { Fragment, useEffect, useState } from "react";
import { Button, Modal, Loading } from "react-style-guide";
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
  enterCodeStrings,
  helpUrl,
} from "../constants/EmailVerifyCodeModalConstants";
import { loginTranslationConfig } from "../translation.config";
import EVENT_CONSTANTS from "../../common/constants/eventsConstants";
import {
  sendOtpPageLoadEvent,
  sendOtpButtonClickEvent,
  sendCodeInputEvent,
} from "../services/eventService";

export type enterCodePageProps = {
  titleText: string;
  descriptionText: string;
  code: string;
  codeLength: number;
  onResendCode: () => void;
  isLoading: boolean;
  errorMessage: string;
  onClose: () => void;
  dispatch: React.Dispatch<TEmailVerifyCodeModalAction>;
  translate: WithTranslationsProps["translate"];
};

const EnterCodePage = ({
  titleText,
  descriptionText,
  code,
  codeLength,
  onResendCode,
  isLoading,
  errorMessage,
  onClose,
  dispatch,
  translate,
}: enterCodePageProps): JSX.Element => {
  const [isResendEnabled, setIsResendEnabled] = useState(true);
  const [timeUntilResend, setTimeUntilResend] = useState(0);
  const [isFirstCodeChange, setIsFirstCodeChange] = useState(true);

  const debouncedCode = useDebounce(code, 200);

  const context = EVENT_CONSTANTS.context.enterOTP;

  const startCountdownTimer = () => {
    setIsResendEnabled(false);
    if (timeUntilResend === 0) {
      const id = setInterval(() => {
        setTimeUntilResend((time) => {
          if (time === 1) {
            clearInterval(id);
            setIsResendEnabled(true);
          }
          return time - 1;
        });
      }, 1000);
    }
    setTimeUntilResend(30);
  };

  const handleResendCode = () => {
    sendOtpButtonClickEvent(context, EVENT_CONSTANTS.btn.resendCode);
    onResendCode();
    startCountdownTimer();
  };

  const handleCodeChange = (newCode: string) => {
    dispatch({
      type: emailVerifyCodeModalActionType.SET_ERROR,
      errorMessage: "",
    });
    const cleanedCode = newCode.replace(/\D/g, "");
    // do not need to slice as input has maxLength of codeLength already
    dispatch({
      type: emailVerifyCodeModalActionType.SET_OTP_CODE,
      code: cleanedCode,
    });
  };

  useEffect(() => {
    if (isFirstCodeChange && code.length > 0) {
      setIsFirstCodeChange(false);
      sendCodeInputEvent();
    }
  }, [debouncedCode]);

  const handleClose = (): void => {
    sendOtpButtonClickEvent(context, EVENT_CONSTANTS.btn.cancel);
    onClose();
  };

  useEffect(() => {
    sendOtpPageLoadEvent(context);
    startCountdownTimer();
  }, []);

  return (
    <Fragment>
      <Modal.Header title={titleText} onClose={handleClose} />
      <Modal.Body>
        <p className="email-verify-code-help-text">{descriptionText}</p>
        <input
          placeholder={translate(enterCodeStrings.CodePlaceholder)}
          onChange={(e) => handleCodeChange(e.target.value)}
          type="text"
          inputMode="numeric"
          maxLength={codeLength}
          /* eslint-disable */
          autoFocus
          /* eslint-enable */
          className="form-control input-field email-verify-code-input"
          value={code}
          disabled={isLoading}
        />
        <p className="text-error email-verify-code-error-text">
          {errorMessage}
        </p>
        {isLoading ? (
          <Loading />
        ) : (
          <Button
            className="email-verify-code-button"
            variant={Button.variants.secondary}
            onClick={handleResendCode}
            isDisabled={!isResendEnabled}
          >
            {isResendEnabled
              ? translate(enterCodeStrings.Resend)
              : `${translate(enterCodeStrings.CodeSent)} (${timeUntilResend})`}
          </Button>
        )}
        <div className="font-caption-header email-verify-code-help-link">
          <a
            className="text-link"
            href={helpUrl}
            target="_blank"
            rel="noreferrer"
          >
            {translate(enterCodeStrings.LearnMore)}
          </a>
        </div>
      </Modal.Body>
    </Fragment>
  );
};

export default withTranslations(EnterCodePage, loginTranslationConfig);
