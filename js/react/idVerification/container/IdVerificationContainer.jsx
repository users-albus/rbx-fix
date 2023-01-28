import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-style-guide";
import { DeviceMeta } from "Roblox";
import {
  CLEANUP_MODAL,
  SET_CALLBACK_READY,
  SET_EMAIL_UPDATING_STATE,
  SET_ERROR_STATE,
  SET_INPUT_CLEAR,
  SET_INPUT_STATE,
  SET_MODAL_STATES,
  SET_PAGENAME_STATE,
  SET_TRIGGER_ORIGIN,
  SET_USER_EMAIL_STATES,
  SET_VERIFICATION_CALLBACK,
} from "../actions/actionTypes";
import ChecklistPage from "../components/ChecklistPage";
import IdVerificationModal from "../components/IdVerificationModal";
import LegalEnablePage from "../components/LegalEnablePage";
import VendorLinkPage from "../components/VendorLinkPage";
import ViewTemplate from "../components/ViewTemplate";
import emailUpsellConstants from "../constants/emailUpsellConstants";
import events from "../constants/idVerificationEventStreamConstants";
import {
  DisplayView,
  IdVerificationVendor,
  minimumAge,
  ModalEntry,
  ModalEvent,
  VerificationChecklistStep,
  VerificationErrorCode,
  VerificationStatusCode,
} from "../constants/viewConstants";
import useIdVerificationState from "../hooks/useIdVerificationState";
import {
  getVerificationStatus,
  getVerifiedAge,
  sendIdVerificationEvent,
  startVeriffIdVerification,
} from "../services/ageVerificationServices";
import {
  getUserEmailAddress,
  getUserEmailStatus,
  sendEmailVerification,
  updateEmailAddress,
  validateEmailAddress,
} from "../services/userEmailService";
import {
  postShowOverlay,
  sendVoiceChatEvent,
} from "../services/voiceChatService";

const { isAndroidApp, isDesktop } = DeviceMeta ? DeviceMeta() : false;
const { MessageConfirmationEmailNotSent, MessageInvalidEmailAddress } =
  emailUpsellConstants;

function IdVerificationContainer({ translate, entry, vendor }) {
  const { idVerificationState, dispatch } = useIdVerificationState();
  const { pageName, pageState } = idVerificationState;
  const [isSessionStarting, setSessionStarting] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const tokenRef = useRef("");

  const POLLING_INTERVAL = 15000; // 15 seconds
  const POLLING_TIMEOUT = 1800000; // 30 minutes

  function handleModalDismiss() {
    dispatch({ type: CLEANUP_MODAL });
    setModalOpen(false);
    tokenRef.current = "";

    if (
      entry === ModalEntry.AccountSettings &&
      pageName === DisplayView.SUCCESS_GENERIC
    ) {
      document.location.reload();
    }
  }

  function handleModalDismissFromX() {
    sendIdVerificationEvent(events.exitIdentityVerification, {
      origin: entry,
    });
    handleModalDismiss();
  }

  function dispatchLanding() {
    setModalOpen(true);
    dispatch({
      type: SET_PAGENAME_STATE,
      pageName: DisplayView.LANDING,
      dispatch,
      continue: () => {
        // eslint-disable-next-line no-use-before-define
        checkEmailAndStartVerification();
      },
    });
  }

  const handleVerificationData = (data) => {
    if (data?.isVerified && data?.verifiedAge) {
      // Reset Don't Show Again checkbox endpoint for game details page age verification
      // upsell so that it can be used again for Enable Voice Chat overlay
      try {
        postShowOverlay(true);
      } catch (e) {
        console.log(e);
      }
      if (entry === ModalEntry.AccountSettings) {
        dispatch({
          type: SET_PAGENAME_STATE,
          pageName: DisplayView.SUCCESS_GENERIC,
          dispatch,
          close: () => {
            handleModalDismiss();
          },
        });
      } else if (data.verifiedAge >= minimumAge) {
        dispatch({
          type: SET_PAGENAME_STATE,
          pageName: DisplayView.SUCCESS_OVERAGE,
          dispatch,
          close: () => {
            // This dispatches the enable voice chat screen. It is presumed this
            // will only be called from the game details page age verification flow.
            dispatch({
              type: SET_PAGENAME_STATE,
              pageName: DisplayView.ENABLE_VOICE_CHAT,
              dispatch,
              close: () => {
                handleModalDismiss();
              },
            });
          },
        });
      } else {
        dispatch({
          type: SET_PAGENAME_STATE,
          pageName: DisplayView.SUCCESS_UNDERAGE,
          dispatch,
          close: () => {
            handleModalDismiss();
          },
        });
      }
    } else {
      dispatch({
        type: SET_PAGENAME_STATE,
        pageName: DisplayView.FAILURE,
        dispatch,
        close: () => {
          handleModalDismiss();
        },
      });
    }
  };

  // The polling function
  const pollVerificationStatus = (token, verificationLink) => {
    const endTime = Number(new Date()) + POLLING_TIMEOUT;
    let currentStatusCode = VerificationStatusCode.NotStarted;
    tokenRef.current = token;

    async function checkVerificationCondition(resolve, reject) {
      const status = await getVerificationStatus(token).catch(() => {
        // catch and continue polling if endpoint call fails
        return {
          sessionStatus: currentStatusCode,
        };
      });
      const statusCode = status.sessionStatus;
      let endScreen = null;
      let endTextKey = null;
      if (statusCode && statusCode !== currentStatusCode) {
        currentStatusCode = statusCode;
        let checklistStep = VerificationChecklistStep.Connecting;
        switch (statusCode) {
          case VerificationStatusCode.RetryNeeded:
          case VerificationStatusCode.Failure:
            endScreen = DisplayView.FAILURE;
            switch (status.sessionErrorCode) {
              case VerificationErrorCode.InvalidDocument:
              case VerificationErrorCode.BelowMinimumAge:
                endTextKey = "Label.FailedVerificationInvalidDocument";
                break;
              case VerificationErrorCode.LowQualityMedia:
              case VerificationErrorCode.InvalidSelfie:
                endTextKey = "Label.FailedVerificationLowQuality";
                break;
              case VerificationErrorCode.DocumentUnsupported:
                endTextKey = "Label.FailedVerificationUnsupportedDocument";
                break;
              default:
                endTextKey = "Label.FailedVerification";
                break;
            }
            break;
          case VerificationStatusCode.ManualReview:
            endScreen = DisplayView.PENDING;
            break;
          case VerificationStatusCode.Success:
            endScreen = DisplayView.SUCCESS_GENERIC;
            break;
          case VerificationStatusCode.LinkOpened:
            sendIdVerificationEvent(events.verificationInProgress, {
              origin: entry,
            });
            checklistStep = VerificationChecklistStep.Verifying;
            break;
          case VerificationStatusCode.Submitting:
            sendIdVerificationEvent(events.verificationPending, {
              origin: entry,
            });
            checklistStep = VerificationChecklistStep.Pending;
            break;
          case VerificationStatusCode.UpdatingRoblox:
            checklistStep = VerificationChecklistStep.UpdatingRoblox;
            break;
          case VerificationStatusCode.NotStarted:
          default:
            break;
        }

        if (currentStatusCode !== VerificationStatusCode.NotStarted) {
          dispatch({
            type: SET_PAGENAME_STATE,
            pageName: DisplayView.POLLING,
            origin: entry,
            verificationLink,
            useQRCode: isDesktop,
            checklistStep,
            dispatch,
          });
        }
      }

      if (tokenRef.current !== token) {
        // If the user has closed the modal, stop polling/don't display an end screen
        resolve(false);
      } else if (endScreen) {
        // We got a final result on verification, display end screen
        dispatch({
          type: SET_PAGENAME_STATE,
          pageName: endScreen,
          textKey: endTextKey,
          dispatch,
          close: () => {
            handleModalDismiss();
          },
        });
        resolve(currentStatusCode);
      } else if (Number(new Date()) < endTime) {
        // If the condition isn't met but the timeout hasn't elapsed, go again
        setTimeout(
          checkVerificationCondition,
          POLLING_INTERVAL,
          resolve,
          reject
        );
      } else {
        // Didn't match and too much time, show failure screen
        dispatch({
          type: SET_PAGENAME_STATE,
          pageName: DisplayView.FAILURE,
          textKey: "Label.SessionTimeout",
          dispatch,
          close: () => {
            handleModalDismiss();
          },
        });
        resolve(false);
      }
    }
    return new Promise(checkVerificationCondition);
  };

  const startVerification = async () => {
    let data;
    switch (vendor) {
      case IdVerificationVendor.Veriff:
      default:
        data = await startVeriffIdVerification(true);
        break;
    }

    setSessionStarting(false);
    if (data && data.verificationLink && data.sessionIdentifier) {
      sendIdVerificationEvent(events.showModal, {
        origin: entry,
      });

      dispatch({
        type: SET_PAGENAME_STATE,
        pageName: DisplayView.VENDOR_LINK,
        verificationLink: data.verificationLink,
        useQRCode: isDesktop,
        dispatch,
      });

      pollVerificationStatus(data.sessionIdentifier, data.verificationLink);
    } else if (data?.daysUntilNextVerification > 0) {
      dispatch({
        type: SET_PAGENAME_STATE,
        pageName: DisplayView.TEMP_BAN,
        daysUntilNextVerification: data.daysUntilNextVerification,
        dispatch,
        close: () => {
          handleModalDismiss();
        },
      });
    } else {
      dispatch({
        type: SET_PAGENAME_STATE,
        pageName: DisplayView.ERROR,
        dispatch,
        close: () => {
          handleModalDismiss();
        },
      });
    }

    setModalOpen(true);
  };

  useEffect(() => {
    if (isSessionStarting) {
      startVerification();
    }
  }, [isSessionStarting]);

  /// email upsell functions
  function handlePrimaryAction() {
    // switch statement left for future states to be added
    switch (idVerificationState.pageName) {
      case DisplayView.EMAIL:
        if (validateEmailAddress(idVerificationState.userEmailInput)) {
          sendIdVerificationEvent(events.addEmailConfirm, {
            origin: entry,
          });
          dispatch({ type: SET_EMAIL_UPDATING_STATE, isEmailUpdating: true });
          updateEmailAddress({
            emailAddress: idVerificationState.userEmailInput,
          }).then((rst) => {
            if (rst === emailUpsellConstants.InvalidEmailCode) {
              dispatch({
                type: SET_ERROR_STATE,
                errorMsg: MessageInvalidEmailAddress,
              });
              dispatch({
                type: SET_EMAIL_UPDATING_STATE,
                isEmailUpdating: false,
              });
            } else {
              // after updating email address, verification email is
              // automatically sent. Transition to the verification flow
              getUserEmailAddress().then((userEmail) => {
                if (!userEmail) {
                  dispatch({
                    type: SET_ERROR_STATE,
                    errorMsg: MessageConfirmationEmailNotSent,
                  });
                } else {
                  dispatch({
                    type: SET_USER_EMAIL_STATES,
                    isEmailVerified: false,
                    userEmail,
                  });
                  sendEmailVerification();
                  dispatch({ type: SET_INPUT_CLEAR });
                  dispatch({
                    type: SET_EMAIL_UPDATING_STATE,
                    isEmailUpdating: false,
                  });
                  setSessionStarting(true);
                }
              });
            }
          });
          dispatch({ type: SET_MODAL_STATES });
        } else {
          dispatch({
            type: SET_ERROR_STATE,
            errorMsg: MessageInvalidEmailAddress,
          });
        }
        break;
      default:
        handleModalDismiss();
    }
  }

  function handleSecondaryAction() {
    // switch statement left for future states to be added
    switch (idVerificationState.pageName) {
      case DisplayView.EMAIL:
        if (idVerificationState.skipCallback) {
          idVerificationState.skipCallback();
        }
        dispatch({ type: SET_INPUT_CLEAR });
        setModalOpen(false);
        break;
      default:
    }
  }

  function handleInputFocus() {
    sendIdVerificationEvent(events.useAddEmailField, {
      origin: entry,
    });
  }

  function handleInputChange(value) {
    dispatch({
      type: SET_INPUT_STATE,
      pageName: DisplayView.EMAIL,
      value,
    });
  }
  function handleKeyDown(value) {
    if (value === emailUpsellConstants.Enter) {
      return handlePrimaryAction();
    }
    return false;
  }

  function checkEmailAndStartVerification() {
    getUserEmailStatus().then(
      (emailStatus) => {
        if (emailStatus) {
          dispatch({
            type: SET_TRIGGER_ORIGIN,
            origin: entry,
            skipCallback: false,
          });
          dispatch({
            type: SET_USER_EMAIL_STATES,
            isEmailVerified: emailStatus.isEmailVerified,
            userEmail: emailStatus.emailAddress,
          });
          if (emailStatus.emailAddress) {
            setSessionStarting(true);
          } else {
            sendIdVerificationEvent(events.showAddEmailModal, {
              origin: entry,
            });
            dispatch({
              type: SET_PAGENAME_STATE,
              pageName: DisplayView.EMAIL,
              dispatch,
            });
            dispatch({ type: SET_MODAL_STATES });
            setModalOpen(true);
          }
        }
      },
      () => {
        dispatch({
          type: SET_PAGENAME_STATE,
          pageName: DisplayView.ERROR,
          dispatch,
          close: () => {
            handleModalDismiss();
          },
        });
        dispatch({ type: SET_MODAL_STATES });
        setModalOpen(true);
      }
    );
  }

  useEffect(() => {
    dispatch({
      type: SET_TRIGGER_ORIGIN,
      origin: entry,
      skipCallback: false,
    });

    window.addEventListener(
      ModalEvent.OpenIdentityVerificationModal,
      (event) => {
        dispatch({
          type: SET_VERIFICATION_CALLBACK,
          callback: event.detail.successCallback,
        });
        getVerifiedAge().then((data) => {
          if (data?.isVerified) {
            setModalOpen(true);
            handleVerificationData(data);
          } else if (entry === ModalEntry.WebApp) {
            dispatchLanding();
          } else {
            checkEmailAndStartVerification();
          }
        });
      },
      false
    );

    window.addEventListener(ModalEvent.OpenBirthdayChangeWarning, (event) => {
      dispatch({
        type: SET_PAGENAME_STATE,
        pageName: DisplayView.BIRTHDAY_WARNING,
        dispatch,
        closeCallback: (confirmChange) => {
          event.detail.closeCallback(confirmChange);
          handleModalDismiss();
        },
      });
      setModalOpen(true);
    });

    window.addEventListener(ModalEvent.OpenVoiceOptInOverlay, (event) => {
      const { requireExplicitVoiceConsent, useExitBetaLanguage } = event.detail;
      setModalOpen(true);
      dispatch({
        type: SET_PAGENAME_STATE,
        pageName: DisplayView.ENABLE_VOICE_CHAT,
        requireExplicitVoiceConsent,
        useExitBetaLanguage,
        dispatch,
        close: () => {
          event.detail.closeCallback(true);
          handleModalDismiss();
        },
      });
    });

    // Open modal immediately from LuaApp
    if (entry === ModalEntry.LuaApp) {
      dispatch({ type: SET_CALLBACK_READY });
      getVerifiedAge().then(
        (data) => {
          if (data?.isVerified) {
            setModalOpen(true);
            handleVerificationData(data);
          } else {
            checkEmailAndStartVerification();
          }
        },
        () => {
          dispatch({
            type: SET_PAGENAME_STATE,
            pageName: DisplayView.ERROR,
            dispatch,
            close: () => {
              handleModalDismiss();
            },
          });
          setModalOpen(true);
        }
      );
    }
  }, []);

  let modalContent = null;
  if (pageState) {
    if (pageName === DisplayView.VENDOR_LINK) {
      modalContent = (
        <VendorLinkPage
          {...pageState}
          onHide={() => handleModalDismissFromX()}
          translate={translate}
        />
      );
    } else if (pageName === DisplayView.POLLING) {
      modalContent = (
        <ChecklistPage
          {...pageState}
          onHide={() => handleModalDismissFromX()}
          translate={translate}
        />
      );
    } else if (pageName === DisplayView.ENABLE_VOICE_CHAT) {
      modalContent = (
        <LegalEnablePage
          {...pageState}
          onHide={() => {
            sendVoiceChatEvent(events.closeEnableVoiceChatModal);
            handleModalDismissFromX();
          }}
          translate={translate}
        />
      );
    } else {
      modalContent = (
        <ViewTemplate
          {...pageState}
          onHide={() => handleModalDismissFromX()}
          translate={translate}
        />
      );
    }
  }

  return (
    <div>
      <Modal
        show={isModalOpen}
        onHide={() => {
          handleModalDismissFromX();
        }}
        backdrop="static"
        /* eslint-enable */
        className={`${
          isAndroidApp ? "email-upsell-android-modal" : ""
        } email-upsell-modal`}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        scrollable="true"
        centered="true"
      >
        {pageName === DisplayView.EMAIL ? (
          <IdVerificationModal
            onHide={() => {
              handleModalDismissFromX();
            }}
            onPrimaryAction={() => handlePrimaryAction()}
            onSecondaryAction={() => handleSecondaryAction()}
            onInputFocus={() => handleInputFocus()}
            onInputChange={(value) => handleInputChange(value)}
            onKeyDown={(value) => handleKeyDown(value)}
          />
        ) : (
          modalContent
        )}
      </Modal>
    </div>
  );
}

IdVerificationContainer.propTypes = {
  translate: PropTypes.func.isRequired,
  entry: PropTypes.string.isRequired,
  vendor: PropTypes.string.isRequired,
};

export default IdVerificationContainer;
