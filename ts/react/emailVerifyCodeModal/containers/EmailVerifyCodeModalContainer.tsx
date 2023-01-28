/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { Fragment, useEffect } from "react";
import { Modal } from "react-style-guide";
import {
  useDebounce,
  withTranslations,
  WithTranslationsProps,
} from "react-utilities";

import useEmailVerifyCodeModalContext from "../hooks/useEmailVerifyCodeModalContext";
import { emailVerifyCodeModalActionType } from "../store/emailVerifyCodeModalStoreContext";

import EnterEmailPage from "../components/EnterEmailPage";
import EnterCodePage from "../components/EnterCodePage";

import { sendCode, resendCode } from "../services/otpService";
import {
  pageNames,
  contactType,
  errorCodes,
  errorStrings,
  statusCodes,
} from "../constants/EmailVerifyCodeModalConstants";
import EVENT_CONSTANTS from "../../common/constants/eventsConstants";

import { loginTranslationConfig } from "../translation.config";
import { TEnterCodeErrorEvent } from "../../common/types/otpTypes";
import {
  sendErrorEvent,
  sendOtpButtonClickEvent,
} from "../services/eventService";

export type emailVerifyCodeModalContainerProps = {
  emailVerifyCodeError: string;
  containerId: string;
  codeLength: number;
  onEmailCodeEntered: (sessionToken: string, code: string) => void;
  onModalAbandoned: () => void;
  enterEmailTitle: string;
  enterEmailDescription: string;
  enterCodeTitle: string;
  enterCodeDescription: string;
  origin: string;
  translate: WithTranslationsProps["translate"];
};

export const EmailVerifyCodeModalContainer = ({
  containerId,
  codeLength,
  onEmailCodeEntered,
  onModalAbandoned,
  enterEmailTitle,
  enterEmailDescription,
  enterCodeTitle,
  enterCodeDescription,
  origin,
  translate,
}: emailVerifyCodeModalContainerProps): JSX.Element => {
  const {
    state: {
      emailVerifyCodeModalPage,
      email,
      sessionToken,
      code,
      isLoading,
      errorMessage,
      isModalOpen,
    },
    dispatch,
  } = useEmailVerifyCodeModalContext();

  const debouncedCode = useDebounce(code, 200);

  useEffect(() => {
    if (debouncedCode.length === codeLength) {
      onEmailCodeEntered(sessionToken, debouncedCode);
      dispatch({
        type: emailVerifyCodeModalActionType.SET_LOADING,
        isLoading: true,
      });
      sendOtpButtonClickEvent(
        EVENT_CONSTANTS.context.enterOTP,
        EVENT_CONSTANTS.btn.login
      );
    }
  }, [debouncedCode]);

  // attach event listener for onEnterEmailVerifyCodeError to handle errors from
  // submitting the code
  useEffect(() => {
    const onEnterEmailVerifyCodeError = (
      event: CustomEvent<TEnterCodeErrorEvent>
    ) => {
      if (event.detail) {
        if (event.detail.shouldCloseModal) {
          handleCloseModal();
          return;
        }
        dispatch({
          type: emailVerifyCodeModalActionType.SET_ERROR,
          errorMessage: event.detail.errorMessage,
        });
      }
      dispatch({ type: emailVerifyCodeModalActionType.SET_OTP_CODE, code: "" });
      dispatch({
        type: emailVerifyCodeModalActionType.SET_LOADING,
        isLoading: false,
      });
    };

    window.addEventListener(
      "onEnterEmailVerifyCodeError",
      onEnterEmailVerifyCodeError as EventListener
    );
    return () => {
      window.removeEventListener(
        "onEnterEmailVerifyCodeError",
        onEnterEmailVerifyCodeError as EventListener
      );
    };
  }, []);

  const handleCloseModal = () => {
    onModalAbandoned();
    dispatch({ type: emailVerifyCodeModalActionType.CLOSE_MODAL });
  };

  const handleError = (error: unknown, ctx: string) => {
    const errorObject = error as Record<string, unknown>;
    const errorCode = errorObject.data;
    const statusCode = errorObject.status;

    if (errorCode === errorCodes.throttled) {
      dispatch({
        type: emailVerifyCodeModalActionType.SET_ERROR,
        errorMessage: translate(errorStrings.Throttled),
      });
      sendErrorEvent(ctx, String(errorCode));
      return;
    }
    // gateWay throttle has no error code, but same statusCode as ip throttle
    if (statusCode === statusCodes.gatewayThrottle) {
      dispatch({
        type: emailVerifyCodeModalActionType.SET_ERROR,
        errorMessage: translate(errorStrings.Throttled),
      });
      sendErrorEvent(ctx, String(statusCode));
      return;
    }
    if (errorCode === errorCodes.sessionTokenInvalid) {
      // this will only be reached from resend endpoint
      // send new code if session token for previous code expired
      sendErrorEvent(ctx, String(errorCode));
      // eslint-disable-next-line no-void
      void handleSendCode();
      return;
    }
    sendErrorEvent(ctx, String(errorCode));
    dispatch({
      type: emailVerifyCodeModalActionType.SET_ERROR,
      errorMessage: translate(errorStrings.Unknown),
    });
  };

  const handleSendCode = async () => {
    try {
      const data = await sendCode({ origin, contactType, contactValue: email });
      dispatch({
        type: emailVerifyCodeModalActionType.SET_SESSION_TOKEN,
        sessionToken: data?.otpSessionToken ?? "",
      });
      dispatch({
        type: emailVerifyCodeModalActionType.SET_ERROR,
        errorMessage: "",
      });
      dispatch({
        type: emailVerifyCodeModalActionType.SET_ENTER_CODE_PAGE,
      });
    } catch (error) {
      handleError(error, EVENT_CONSTANTS.context.sendOTP);
    }
  };

  const handleResendCode = async () => {
    try {
      const data = await resendCode({
        contactType,
        otpSessionToken: sessionToken,
      });
      dispatch({
        type: emailVerifyCodeModalActionType.SET_SESSION_TOKEN,
        sessionToken: data?.otpSessionToken ?? "",
      });
      dispatch({
        type: emailVerifyCodeModalActionType.SET_ERROR,
        errorMessage: "",
      });
    } catch (error) {
      handleError(error, EVENT_CONSTANTS.context.enterOTP);
    }
  };

  return (
    <Modal
      className="email-verify-code-modal"
      show={isModalOpen}
      size="lg"
      backdrop="static"
      onHide={handleCloseModal}
    >
      <Fragment>
        {emailVerifyCodeModalPage === pageNames.EnterEmail && (
          <EnterEmailPage
            titleText={enterEmailTitle}
            descriptionText={enterEmailDescription}
            onSendCode={handleSendCode}
            email={email}
            errorMessage={errorMessage}
            onClose={handleCloseModal}
            dispatch={dispatch}
            translate={translate}
          />
        )}
        {emailVerifyCodeModalPage === pageNames.EnterCode && sessionToken && (
          <EnterCodePage
            titleText={enterCodeTitle}
            descriptionText={enterCodeDescription}
            code={code}
            codeLength={codeLength}
            onResendCode={handleResendCode}
            isLoading={isLoading}
            errorMessage={errorMessage}
            onClose={handleCloseModal}
            dispatch={dispatch}
            translate={translate}
          />
        )}
      </Fragment>
    </Modal>
  );
};

export default withTranslations(
  EmailVerifyCodeModalContainer,
  loginTranslationConfig
);
