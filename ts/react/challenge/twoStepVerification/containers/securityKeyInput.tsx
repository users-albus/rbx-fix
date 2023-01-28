import { cryptoUtil, hybridResponseService } from "core-roblox-utilities";
import React, { useState } from "react";
import { Modal } from "react-style-guide";
import { DeviceMeta } from "Roblox";
import * as TwoStepVerification from "../../../../common/request/types/twoStepVerification";
import InlineChallengeBody from "../../../common/inlineChallengeBody";
import RememberDeviceCheckBox from "../components/rememberDeviceCheckBox";
import SupportHelp from "../components/supportHelp";
import {
  mapTwoStepVerificationErrorToChallengeErrorCode,
  mapTwoStepVerificationErrorToResource,
} from "../constants/resources";
import { useActiveMediaType } from "../hooks/useActiveMediaType";
import useTwoStepVerificationContext from "../hooks/useTwoStepVerificationContext";
import { TwoStepVerificationActionType } from "../store/action";

type Props = {
  requestInFlight: boolean;
  setRequestInFlight: React.Dispatch<React.SetStateAction<boolean>>;
  // eslint-disable-next-line react/require-default-props
  children?: React.ReactNode;
};

/**
 * A container element for the Security Key verification UI.
 */
const SecurityKeyInput: React.FC<Props> = ({
  requestInFlight,
  setRequestInFlight,
  children,
}: Props) => {
  const {
    state: {
      userId,
      challengeId,
      actionType,
      renderInline,
      shouldShowRememberDeviceCheckbox,
      resources,
      metadata,
      eventService,
      metricsService,
      requestService,
    },
    dispatch,
  } = useTwoStepVerificationContext();
  const activeMediaType = useActiveMediaType();

  /*
   * Component State
   */

  const [requestError, setRequestError] = useState<string | null>(null);
  const [rememberDevice, setRememberDevice] = useState<boolean>(false);

  /*
   * Helper Functions
   */

  const handleError = (
    error: TwoStepVerification.TwoStepVerificationError | null,
    sendEvent: boolean
  ) => {
    if (sendEvent) {
      eventService.sendCodeVerificationFailedEvent(
        activeMediaType,
        TwoStepVerification.TwoStepVerificationError[
          error || TwoStepVerification.TwoStepVerificationError.UNKNOWN
        ]
      );
    }
    if (
      error === TwoStepVerification.TwoStepVerificationError.INVALID_USER_ID ||
      error ===
        TwoStepVerification.TwoStepVerificationError.INVALID_CHALLENGE_ID
    ) {
      dispatch({
        type: TwoStepVerificationActionType.SET_CHALLENGE_INVALIDATED,
        errorCode: mapTwoStepVerificationErrorToChallengeErrorCode(error),
      });
      return;
    }

    setRequestInFlight(false);
    setRequestError(mapTwoStepVerificationErrorToResource(resources, error));
  };

  const base64StringToBase64UrlString = (rawString: string) => {
    return rawString.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  };

  /*
   * Event Handlers
   */

  const verifyCode = async () => {
    setRequestInFlight(true);
    setRequestError(null);

    const options =
      await requestService.twoStepVerification.getSecurityKeyOptions(userId, {
        challengeId,
        actionType,
      });

    if (options.isError) {
      handleError(options.error, true);
      return;
    }

    /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
    const makeAssertionOptions = JSON.parse(
      options.value.authenticationOptions
    );
    if (!makeAssertionOptions.publicKey) {
      handleError(TwoStepVerification.TwoStepVerificationError.UNKNOWN, false);
      return;
    }

    makeAssertionOptions.publicKey.challenge =
      cryptoUtil.base64StringToArrayBuffer(
        makeAssertionOptions.publicKey.challenge as unknown as string
      );
    if (!makeAssertionOptions.publicKey.challenge) {
      handleError(TwoStepVerification.TwoStepVerificationError.UNKNOWN, false);
      return;
    }
    for (
      let i = 0;
      i < makeAssertionOptions.publicKey.allowCredentials.length;
      i++
    ) {
      makeAssertionOptions.publicKey.allowCredentials[i].id =
        cryptoUtil.base64StringToArrayBuffer(
          makeAssertionOptions.publicKey.allowCredentials[i].id
        );
    }

    let code = "";
    if (DeviceMeta && DeviceMeta().isInApp) {
      // If we're in a web-view and Security Keys are enabled, we should call the native implementation of FIDO2.
      const credentialString = await hybridResponseService
        .getNativeResponse(
          hybridResponseService.FeatureTarget.GET_CREDENTIALS,
          { authenticationOptionsJSON: options.value.authenticationOptions },
          300000
        )
        .catch(() => {
          handleError(
            TwoStepVerification.TwoStepVerificationError.UNKNOWN,
            false
          );
        });
      if (credentialString == null) {
        handleError(
          TwoStepVerification.TwoStepVerificationError.UNKNOWN,
          false
        );
        return;
      }
      try {
        const credential = JSON.parse(credentialString);
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const publicKeyCredential = {
          id: base64StringToBase64UrlString(credential.id),
          type: credential.type,
          response: {
            authenticatorData: base64StringToBase64UrlString(
              credential.response.authenticatorData
            ),
            clientDataJSON: base64StringToBase64UrlString(
              credential.response.clientDataJSON
            ),
          },
        };
        if ("rawId" in credential) {
          (publicKeyCredential as any).rawId = base64StringToBase64UrlString(
            credential.rawId
          );
        }
        if ("signature" in credential.response) {
          (publicKeyCredential as any).response.signature =
            base64StringToBase64UrlString(credential.response.signature);
        }
        if ("userHandle" in credential.response) {
          (publicKeyCredential as any).response.userHandle =
            base64StringToBase64UrlString(credential.response.userHandle);
        }
        /* eslint-enable @typescript-eslint/no-explicit-any */
        code = JSON.stringify(publicKeyCredential);
      } catch {
        handleError(
          TwoStepVerification.TwoStepVerificationError.UNKNOWN,
          false
        );
        return;
      }
    } else {
      const credential = await navigator.credentials
        .get({
          publicKey: makeAssertionOptions.publicKey,
        })
        .catch(() => {
          handleError(
            TwoStepVerification.TwoStepVerificationError.UNKNOWN,
            false
          );
        });
      try {
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const authData = new Uint8Array(
          (credential as any).response.authenticatorData
        );
        const clientDataJSON = new Uint8Array(
          (credential as any).response.clientDataJSON
        );
        const rawId = new Uint8Array((credential as any).rawId);
        const signature = new Uint8Array(
          (credential as any).response.signature
        );
        const userHandle = new Uint8Array(
          (credential as any).response.userHandle
        );
        const publicKeyCredential = {
          id: (credential as any).id,
          rawId: base64StringToBase64UrlString(
            cryptoUtil.arrayBufferToBase64String(rawId)
          ),
          type: (credential as any).type,
          response: {
            authenticatorData: base64StringToBase64UrlString(
              cryptoUtil.arrayBufferToBase64String(authData)
            ),
            clientDataJSON: base64StringToBase64UrlString(
              cryptoUtil.arrayBufferToBase64String(clientDataJSON)
            ),
            signature: base64StringToBase64UrlString(
              cryptoUtil.arrayBufferToBase64String(signature)
            ),
            userHandle: base64StringToBase64UrlString(
              cryptoUtil.arrayBufferToBase64String(userHandle)
            ),
          },
        };
        /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any */
        code = JSON.stringify(publicKeyCredential);
      } catch {
        handleError(
          TwoStepVerification.TwoStepVerificationError.UNKNOWN,
          false
        );
        return;
      }
    }
    const result =
      await requestService.twoStepVerification.verifySecurityKeyCredential(
        userId,
        {
          challengeId,
          actionType,
          code,
        }
      );

    if (result.isError) {
      handleError(result.error, true);
      return;
    }

    eventService.sendCodeVerifiedEvent(activeMediaType);
    metricsService.fireVerifiedEvent(activeMediaType);

    dispatch({
      type: TwoStepVerificationActionType.SET_CHALLENGE_COMPLETED,
      onChallengeCompletedData: {
        verificationToken: result.value.verificationToken,
        rememberDevice,
      },
    });
  };

  /*
   * Render Properties
   */

  const BodyElement = renderInline ? InlineChallengeBody : Modal.Body;
  const lockIconClassName = renderInline
    ? "inline-challenge-lock-icon"
    : "modal-lock-icon";
  const marginBottomClassName = renderInline
    ? "inline-challenge-margin-bottom"
    : "modal-margin-bottom";
  let actionButtonClassName = renderInline
    ? "inline-challenge-action-button"
    : "modal-action-button";
  actionButtonClassName = actionButtonClassName.concat(" ", "btn-cta-md");
  actionButtonClassName = actionButtonClassName.concat(
    " ",
    marginBottomClassName
  );
  const marginBottomLargeClassName = renderInline
    ? "inline-margin-bottom-xlarge"
    : "modal-margin-bottom-xlarge";
  const textErrorClassName = marginBottomLargeClassName.concat(
    " ",
    "text-error xsmall"
  );
  const marginBottomSmallClassName = renderInline
    ? "inline-challenge-margin-bottom-sm"
    : "modal-margin-bottom-sm";

  /*
   * Component Markup
   */

  return (
    metadata && (
      <React.Fragment>
        <BodyElement>
          <div className={lockIconClassName} />
          <p className={marginBottomSmallClassName}>
            {resources.Label.VerifyWithSecurityKey}
          </p>
          <p className={marginBottomClassName}>
            {resources.Label.SecurityKeyDirections}
          </p>
          <button
            type="button"
            className={actionButtonClassName}
            aria-label={resources.Action.Verify}
            disabled={requestInFlight}
            onClick={verifyCode}
          >
            {requestInFlight ? (
              <span className="spinner spinner-xs spinner-no-margin" />
            ) : (
              resources.Action.Verify
            )}
          </button>
          {shouldShowRememberDeviceCheckbox && (
            <RememberDeviceCheckBox
              disabled={requestInFlight}
              rememberDevice={rememberDevice}
              setRememberDevice={setRememberDevice}
              className={marginBottomClassName}
            />
          )}
          {children}
          <SupportHelp className={marginBottomClassName} />
          <p className={textErrorClassName}>{requestError}</p>
        </BodyElement>
      </React.Fragment>
    )
  );
};

export default SecurityKeyInput;
