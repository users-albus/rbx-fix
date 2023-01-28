import React, { createContext, useReducer } from "react";
import { Button } from "react-style-guide";
import PropTypes from "prop-types";
import { CurrentUser, Hybrid, EnvironmentUrls } from "Roblox";
import { urlService } from "core-utilities";
import {
  SET_USER_EMAIL_STATES,
  SET_PAGENAME_STATE,
  SET_MODAL_STATES,
  SET_INPUT_STATE,
  SET_ERROR_STATE,
  SET_EMAIL_UPDATING_STATE,
  SET_TRIGGER_ORIGIN,
  SET_INPUT_CLEAR,
  SET_VERIFICATION_CALLBACK,
  SET_CALLBACK_READY,
  CLEANUP_MODAL,
} from "../actions/actionTypes";
import emailUpsellConstants from "../constants/emailUpsellConstants";
import {
  DisplayView,
  CloseVendorModalEvent,
  VerificationChecklistStep,
} from "../constants/viewConstants";
import events from "../constants/idVerificationEventStreamConstants";
import { sendIdVerificationEvent } from "../services/ageVerificationServices";
import {
  postOptUserInToVoiceChat,
  sendVoiceChatEvent,
} from "../services/voiceChatService";

const { websiteUrl } = EnvironmentUrls;

const {
  ActionGenericSkip,
  ActionChangeEmail,
  ActionContinue,
  DescriptionAddEmailTextOver13,
  DescriptionAddEmailTextUnder13,
  HeadingAddEmail,
  LabelEmailInputPlaceholderOver13,
  LabelEmailInputPlaceholderUnder13,
} = emailUpsellConstants;

const initialState = {
  pageName: DisplayView.PENDING,
  isEmailVerified: false,
  isEmailSent: false,
  isEmailUpdating: false,
  origin: "",
  userEmail: "",
  userEmailInput: "",
  userEmailInputPlaceholder: LabelEmailInputPlaceholderOver13,
  errorMsg: "",
  titleText: HeadingAddEmail,
  bodyText: DescriptionAddEmailTextOver13,
  primaryButtonText: ActionContinue,
  secondaryButtonText: ActionChangeEmail,
  daysUntilNextVerification: 0,
  skipCallback: null,
  pageState: null,
  closeCallback: null,
  callbackReady: false,
};

const IdVerificationStoreContext = createContext(initialState);

function fireCloseEvent(overage, verified) {
  // hybrid bridge for lua
  if (Hybrid && Hybrid.Navigation) {
    Hybrid.Navigation.navigateToFeature({
      feature: CloseVendorModalEvent,
      overage,
      verified,
    });
  }
}

const idVerificationReducer = (oldState, action) => {
  let pageState = null;
  switch (action.type) {
    case SET_INPUT_CLEAR:
      return {
        ...oldState,
        userEmailInput: "",
      };
    case SET_TRIGGER_ORIGIN:
      return {
        ...oldState,
        origin: action.origin,
        skipCallback: action.skipCallback,
      };
    case SET_USER_EMAIL_STATES:
      return {
        ...oldState,
        isEmailVerified: action.isEmailVerified,
        userEmail: action.userEmail,
      };
    case SET_PAGENAME_STATE:
      if (action.pageName === DisplayView.SUCCESS_OVERAGE) {
        pageState = {
          heading: "Heading.ThankYou",
          icon: "success-icon",
          bodyText: ["Label.OverageVerification", "Label.VoiceChat"],
          buttonStack: [
            {
              variant: Button.variants.primary,
              text: "Action.OK",
              callback: () => {
                action.close();
              },
            },
          ],
          canClose: false,
        };
      } else if (action.pageName === DisplayView.SUCCESS_UNDERAGE) {
        pageState = {
          heading: "Heading.ThankYou",
          icon: "success-icon",
          bodyText: ["Label.UnderageVerification", "Label.VoiceChat"],
          footerText: "Label.ToggleFeatures",
          buttonStack: [
            {
              variant: Button.variants.primary,
              text: "Action.Close",
              callback: () => {
                action.close();
              },
            },
          ],
          canClose: false,
        };
      } else if (action.pageName === DisplayView.SUCCESS_GENERIC) {
        sendIdVerificationEvent(events.successPage, {
          origin: oldState.origin,
        });
        pageState = {
          heading: "Heading.ThankYou",
          icon: "success-icon",
          bodyText: ["Label.GenericVerified"],
          buttonStack: [
            {
              variant: Button.variants.primary,
              text: "Action.Close",
              callback: () => {
                sendIdVerificationEvent(events.successPageClose, {
                  origin: oldState.origin,
                });
                action.close();
              },
            },
          ],
          canClose: false,
        };
      } else if (action.pageName === DisplayView.EXTERNAL_EMAIL) {
        pageState = {
          heading: "Heading.VerifyEmail",
          icon: "shield-icon",
          bodyText: ["Label.EmailSent"],
          buttonStack: [
            {
              variant: Button.variants.primary,
              text: "Action.Continue",
              callback: () => {
                action.dispatch({
                  type: SET_PAGENAME_STATE,
                  pageName: DisplayView.POLLING,
                });
                action.poll();
              },
            },
          ],
          userEmail: oldState.userEmail,
        };
      } else if (action.pageName === DisplayView.EMAIL_CONTINUE) {
        pageState = {
          heading: "Heading.VerificationPending",
          icon: "shield-icon",
          bodyText: ["Label.EmailSent"],
          buttonStack: [
            {
              variant: Button.variants.primary,
              text: "Action.Continue",
              callback: () => {
                action.dispatch({
                  type: SET_PAGENAME_STATE,
                  pageName: DisplayView.POLLING,
                });
                action.poll();
              },
            },
          ],
          userEmail: oldState.userEmail,
        };
      } else if (action.pageName === DisplayView.POLLING) {
        pageState = {
          ...action,
        };
      } else if (action.pageName === DisplayView.PENDING) {
        pageState = {
          heading: "Heading.VerificationPending",
          icon: "failure-icon",
          bodyText: ["Label.PendingVerification"],
          buttonStack: [
            {
              variant: Button.variants.primary,
              text: "Action.Close",
              callback: () => {
                action.close();
              },
            },
          ],
          canClose: false,
        };
      } else if (action.pageName === DisplayView.FAILURE) {
        sendIdVerificationEvent(events.failurePage, {
          origin: oldState.origin,
        });
        pageState = {
          heading: "Heading.VerificationFailed",
          icon: "failure-icon",
          bodyText: [action.textKey || "Label.FailedVerification"],
          errorState: true,
          buttonStack: [
            {
              variant: Button.variants.primary,
              text: "Action.Close",
              callback: () => {
                sendIdVerificationEvent(events.failurePageClose, {
                  origin: oldState.origin,
                });
                action.close();
              },
            },
          ],
          canClose: false,
        };
      } else if (action.pageName === DisplayView.LANDING) {
        pageState = {
          heading: "Heading.VerifyAge",
          icon: "shield-icon",
          bodyText: ["Label.VoiceChatUpsell"],
          buttonStack: [
            {
              text: "Action.SkipVoiceChat",
              callback: () => {
                action.dispatch({ type: CLEANUP_MODAL });
              },
            },
            {
              variant: Button.variants.primary,
              text: "Action.Continue",
              callback: () => {
                action.continue();
              },
            },
          ],
          userEmail: oldState.userEmail,
          displayCheckbox: true,
        };
      } else if (action.pageName === DisplayView.ERROR) {
        pageState = {
          heading: "Heading.Error",
          icon: "failure-icon",
          bodyText: ["Label.GenericError"],
          buttonStack: [
            {
              variant: Button.variants.primary,
              text: "Action.OK",
              callback: () => {
                action.close();
              },
            },
          ],
          canClose: false,
        };
      } else if (action.pageName === DisplayView.TEMP_BAN) {
        sendIdVerificationEvent(events.tempBanPage, {
          origin: oldState.origin,
        });
        pageState = {
          heading: "Heading.Error",
          icon: "failure-icon",
          bodyText: ["Label.VerificationDeclined"],
          buttonStack: [
            {
              variant: Button.variants.primary,
              text: "Action.OK",
              callback: () => {
                sendIdVerificationEvent(events.tempBanPageClose, {
                  origin: oldState.origin,
                });
                action.close();
              },
            },
          ],
          daysUntilNextVerification: action.daysUntilNextVerification,
          canClose: false,
        };
      } else if (action.pageName === DisplayView.VENDOR_LINK) {
        if (action.useQRCode) {
          sendIdVerificationEvent(events.showQRCode, {
            origin: oldState.origin,
          });
        }
        pageState = {
          verificationLink: action.verificationLink,
          useQRCode: action.useQRCode,
          origin: oldState.origin,
        };
      } else if (action.pageName === DisplayView.BIRTHDAY_WARNING) {
        pageState = {
          heading: "Heading.Warning",
          bodyText: ["Label.BirthdayChangeWarning"],
          buttonStack: [
            {
              text: "Action.GoBack",
              callback: () => {
                action.closeCallback(false);
              },
            },
            {
              variant: Button.variants.primary,
              text: "Action.Continue",
              callback: () => {
                action.closeCallback(true);
              },
            },
          ],
          canClose: false,
          thinLayout: true,
        };
      } else if (action.pageName === DisplayView.ENABLE_VOICE_CHAT) {
        pageState = {
          communityStandardsUrl: urlService.resolveUrl(
            websiteUrl,
            "/info/community-guidelines"
          ),
          voiceFAQUrl: urlService.resolveUrl(websiteUrl, "/info/voice-faq"),
          exitBetaChatWithVoiceUrl: urlService.resolveUrl(
            websiteUrl,
            "/info/spatial-voice"
          ),
          requireExplicitVoiceConsent: action.requireExplicitVoiceConsent,
          useExitBetaLanguage: action.useExitBetaLanguage,
          voiceExpandedModalFlag: action.voiceExpandedModalFlag,
          heading: "Heading.LetsChat",
          exitBetaHeading: "Heading.YourNewWayToChat",
          enableVoiceChat: "Label.EnableVoiceChat1",
          exitBetaEnableMicrophone: "Label.EnableChatWithVoiceWithLink",
          followCommunityStandards: "Label.FollowCommunityStandards",
          implicitConsent: "Label.ImplicitConsentVoiceCollection",
          explicitConsent: "Label.ConsentVoiceCollection",
          learnMoreAboutVoiceRecording: "Label.LearnMoreAboutVoiceRecording",
          buttonStack: [
            {
              explicitDisable: false,
              variant: Button.variants.secondary,
              text: "Action.SkipVoiceChat",
              callback: () => {
                sendVoiceChatEvent(events.joinWithoutVoiceChat);
                action.close();
              },
            },
            {
              explicitDisable: true,
              variant: Button.variants.primary,
              text: "Label.EnableVoiceChat",
              callback: () => {
                postOptUserInToVoiceChat(true, true);
                action.close();
              },
            },
          ],
          exitBetaButtonStack: [
            {
              explicitDisable: false,
              variant: Button.variants.secondary,
              text: "Label.JoinWithoutMicrophone",
              callback: () => {
                sendVoiceChatEvent(events.joinWithoutVoiceChat);
                action.close();
              },
            },
            {
              explicitDisable: true,
              variant: Button.variants.secondary,
              text: "Label.EnableMicrophone",
              callback: () => {
                postOptUserInToVoiceChat(true, true);
                action.close();
              },
            },
          ],
        };
      }
      return {
        ...oldState,
        pageName: action.pageName,
        pageState,
      };
    case SET_ERROR_STATE:
      return {
        ...oldState,
        errorMsg: action.errorMsg,
      };
    case SET_EMAIL_UPDATING_STATE:
      return {
        ...oldState,
        isEmailUpdating: action.isEmailUpdating,
      };
    case SET_INPUT_STATE:
      if (oldState.pageName === DisplayView.EMAIL) {
        return {
          ...oldState,
          userEmailInput: action.value,
          errorMsg: "",
        };
      }

      return oldState;
    case SET_MODAL_STATES:
      // Set modal states based on pageName
      if (oldState.pageName === DisplayView.EMAIL) {
        // Note that different texts are shown for users under 13.
        const isUserOver13 = CurrentUser && !CurrentUser.isUnder13;
        const over13String = DescriptionAddEmailTextOver13;
        const under13String = DescriptionAddEmailTextUnder13;
        const headingString = HeadingAddEmail;
        let secondaryText = "";
        if (oldState.skipCallback) {
          secondaryText = ActionGenericSkip;
        }

        return {
          ...oldState,
          titleText: headingString,
          bodyText: isUserOver13 ? over13String : under13String,
          primaryButtonText: ActionContinue,
          secondaryButtonText: secondaryText,
          errorMsg: "",
          userEmailInputPlaceholder: isUserOver13
            ? LabelEmailInputPlaceholderOver13
            : LabelEmailInputPlaceholderUnder13,
        };
      }
      return oldState;
    case SET_VERIFICATION_CALLBACK:
      return {
        ...oldState,
        closeCallback: action.callback,
        callbackReady: true,
      };
    case SET_CALLBACK_READY:
      return {
        ...oldState,
        callbackReady: true,
      };
    case CLEANUP_MODAL:
      if (oldState.callbackReady) {
        const isUserOldEnough =
          oldState.pageName === DisplayView.SUCCESS_GENERIC ||
          oldState.pageName === DisplayView.SUCCESS_OVERAGE;
        const didVerifyAge =
          isUserOldEnough || oldState.pageName === DisplayView.SUCCESS_UNDERAGE;
        fireCloseEvent(isUserOldEnough, didVerifyAge);
        if (oldState.closeCallback) {
          oldState.closeCallback(isUserOldEnough, didVerifyAge);
        }
      }
      return {
        ...initialState,
      };
    default:
      return oldState;
  }
};

const IdVerificationStateProvider = ({ children }) => {
  const [idVerificationState, dispatch] = useReducer(
    idVerificationReducer,
    initialState
  );

  return (
    <IdVerificationStoreContext.Provider
      value={{ idVerificationState, dispatch }}
    >
      {children}
    </IdVerificationStoreContext.Provider>
  );
};

IdVerificationStateProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { IdVerificationStoreContext, IdVerificationStateProvider };
