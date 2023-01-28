import React, { createRef, useState, useEffect, useMemo, useRef } from "react";
import {
  withTranslations,
  WithTranslationsProps,
  useDebounce,
} from "react-utilities";
import { AccountIntegrityChallengeService, CaptchaConstants } from "Roblox";
import { localStorageService } from "core-roblox-utilities";
import { signupTranslationConfig } from "../translation.config";

// components
import GenderPicker from "../components/GenderPicker";
import BirthdayPicker from "../components/BirthdayPicker";
import UsernameInput from "../components/UsernameInput";
import PasswordInput from "../components/PasswordInput";
import LegalText from "../components/LegalText";
import CaptchaComponent from "../../common/components/CaptchaComponent";
import EmailInput from "../components/EmailInput";
import IdVerificationHelpText from "../components/IdVerificationHelpText";
import IdVerificationErrorModal from "../components/IdVerificationErrorModal";
// utils
import {
  getFirstDatePart,
  getOrderedBirthdaySelects,
} from "../utils/birthdayUtils";
import {
  isValidBirthday,
  getUsernameValidationMessage,
  getPasswordValidationMessage,
  getLocale,
  handlePostSignup,
  getReturnUrl,
  getBirthdayToPrefill,
  getIsSignupButtonDisabled,
} from "../utils/signupUtils";
import { isUnderThresholdAge } from "../utils/identityVerificationUtils";
import { isValidEmail } from "../../common/utils/formUtils";
import parseErrorCode from "../../common/utils/requestUtils";
import { parseCaptchaData } from "../../common/utils/errorParsingUtils";
// services
import {
  incrementEphemeralCounter,
  incrementSignUpSubmitCounters,
  sendSignupButtonClickEvent,
  sendUsernameValidationEvent,
  sendPasswordValidationEvent,
  sendEmailValidationEvent,
  sendShowPasswordButtonClickEvent,
  sendHidePasswordButtonClickEvent,
} from "../services/eventService";
import {
  signup,
  getMetadataV2,
  getUserAgreements,
} from "../services/signupService";
// constants
import {
  signupFormStrings,
  validationMessages,
  counters,
  errorCodes,
  monthStrings,
  reactSignupCaptchaContainer,
  identityVerificationResultTokenName,
  birthdayPickerConstants,
  experimentNames,
} from "../constants/signupConstants";
import { experimentLayer } from "../constants/landingConstants";
// types
import {
  GenderType,
  FormFieldStatus,
  TSignupParams,
} from "../../common/types/signupTypes";
import {
  TCaptchaInputParams,
  TOnCaptchaChallengeCompletedData,
  TOnCaptchaChallengeInvalidatedData,
} from "../../common/types/captchaTypes";
// hooks
import useExperiments from "../../common/hooks/useExperiments";

// hardware backed authentication util
import { buildAuthParamsWithSecureAuthIntentAndClientKeyPair } from "../../common/hardwareBackedAuth/utils/requestUtils";
import { storeClientKeyPair } from "../../common/hardwareBackedAuth/utils/storeUtils";

export const SignupFormContainer = ({
  translate,
}: WithTranslationsProps): JSX.Element => {
  // birthday states
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [birthdayStatus, setBirthdayStatus] = useState(
    FormFieldStatus.Incomplete
  );
  const [birthdayErrorMessage, setBirthdayErrorMessage] = useState("");
  const [isBirthdayDisabled, setIsBirthdayDisabled] = useState(false);

  // email states only used for korea id flow
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState(FormFieldStatus.Incomplete);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");

  // username states
  const [username, setUsername] = useState("");
  // prevent unnecessary calls to validateUsername endpoint
  const debouncedUsername = useDebounce(username, 200);
  const [usernameStatus, setUsernameStatus] = useState(
    FormFieldStatus.Incomplete
  );
  const [usernameErrorMessage, setUsernameErrorMessage] = useState("");

  // password states
  const [password, setPassword] = useState("");
  const debouncedPassword = useDebounce(password, 200);
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState(
    FormFieldStatus.Incomplete
  );
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [passwordThatFailedServerCheck, setPasswordThatFailedServerCheck] =
    useState("");

  // gender state
  const [gender, setGender] = useState(GenderType.unknown);

  // form state
  const [generalError, setGeneralError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFirstSignUpSubmit, setIsFirstSignUpSubmit] = useState(true);
  const [isUserAgreementsEnabled, setIsUserAgreementsEnabled] = useState(false);
  const [locale, setLocale] = useState("");
  const [isKoreaIdUser, setIsKoreaIdUser] = useState(false);
  const [hasIdVerificationError, setHasIdVerificationError] = useState(false);

  // captcha state
  const [unifiedCaptchaId, setUnifiedCaptchaId] = useState("");
  const [dataExchange, setDataExchange] = useState("");
  const [captchaId, setCaptchaId] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");

  const userAgreementIds = useMemo(() => [] as string[], []);

  // NOTE: react forgets local variables when the component is off screen, e.g,
  // when 2sv is rendering.
  // use uesRef to store a variable that does not cause re-render.
  // client key pair generated for hardware backed authentication
  const clientCryptoKeyPair = useRef({} as CryptoKeyPair);

  const isDisableSignupButtonExperimentEnabled = useExperiments(
    experimentLayer
  )[experimentNames.isSignupButtonDisabled] as boolean;

  // refs for accessibility purposes
  const birthdayDayRef: React.RefObject<HTMLSelectElement> = createRef();
  const birthdayMonthRef: React.RefObject<HTMLSelectElement> = createRef();
  const birthdayYearRef: React.RefObject<HTMLSelectElement> = createRef();
  const emailRef: React.RefObject<HTMLInputElement> = createRef();
  const usernameRef: React.RefObject<HTMLInputElement> = createRef();
  const passwordRef: React.RefObject<HTMLInputElement> = createRef();

  // birthday methods
  const prefillBirthday = (birthdayToPrefill: string) => {
    if (birthdayToPrefill) {
      const birthday = new Date(birthdayToPrefill);
      // add leading zero to signle digit birthday date
      setDay(`0${birthday.getDate().toString()}`.slice(-2));
      // get short version of month eg 'Mar' for March
      setMonth(monthStrings[birthday.getMonth()].slice(6, 9));
      setYear(birthday.getFullYear().toString());

      // lock birthday if user < 18
      const now = new Date();
      const eighteenYearsAgo = new Date(
        now.getFullYear() - 18,
        now.getMonth(),
        now.getDate()
      );
      if (
        now.getTime() - birthday.getTime() <
        now.getTime() - eighteenYearsAgo.getTime()
      ) {
        setIsBirthdayDisabled(true);
      }
    }
  };

  const handleBirthdayChange = (isFromSubmit: boolean): void => {
    if ((year && month && day) || isFromSubmit) {
      if (isValidBirthday(year, month, day)) {
        setBirthdayStatus(FormFieldStatus.Valid);
        setBirthdayErrorMessage("");
      } else {
        setBirthdayStatus(FormFieldStatus.Invalid);
        setBirthdayErrorMessage(validationMessages.birthdayInvalid);
      }
    }
  };

  useEffect(() => {
    handleBirthdayChange(false);
  }, [year, month, day]);

  // email methods
  const handleEmailValidation = () => {
    if (isValidEmail(email)) {
      setEmailErrorMessage("");
      setEmailStatus(FormFieldStatus.Valid);
    } else {
      setEmailErrorMessage(validationMessages.invalidEmail);
      setEmailStatus(FormFieldStatus.Invalid);
      sendEmailValidationEvent(email, validationMessages.invalidEmail);
    }
  };

  useEffect(() => {
    if (email || emailStatus !== FormFieldStatus.Incomplete) {
      handleEmailValidation();
    }
  }, [email]);

  // username methods
  const handleUsernameValidation = async () => {
    const validationMessage: string = await getUsernameValidationMessage(
      username,
      day,
      month,
      year
    );
    setUsernameErrorMessage(validationMessage);
    if (validationMessage) {
      setUsernameStatus(FormFieldStatus.Invalid);
      sendUsernameValidationEvent(username, translate(validationMessage));
    } else {
      setUsernameStatus(FormFieldStatus.Valid);
    }
  };

  useEffect(() => {
    // do not trigger username validation until username is present, or had been filled earlier
    if (username || usernameStatus !== FormFieldStatus.Incomplete) {
      // eslint-disable-next-line no-void
      void handleUsernameValidation();
    }
  }, [debouncedUsername, year, month, day]);

  // password methods
  const togglePasswordVisibility = (): void => {
    // if passwordVisibility is true, then toggling will hide password
    if (passwordVisibility) {
      sendHidePasswordButtonClickEvent();
    } else {
      sendShowPasswordButtonClickEvent();
    }
    setPasswordVisibility(!passwordVisibility);
  };

  const handlePasswordValidation = async () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const validationMessage: string | null = await getPasswordValidationMessage(
      username,
      password,
      passwordThatFailedServerCheck
    )!;

    if (validationMessage) {
      setPasswordStatus(FormFieldStatus.Invalid);
      sendPasswordValidationEvent(translate(validationMessage));
    } else {
      setPasswordStatus(FormFieldStatus.Valid);
    }
    if (validationMessage != null) {
      setPasswordErrorMessage(validationMessage);
    }
  };

  useEffect(() => {
    if (password || passwordStatus !== FormFieldStatus.Incomplete) {
      // eslint-disable-next-line no-void
      void handlePasswordValidation();
    }
  }, [debouncedUsername, debouncedPassword]);

  // needed so that clicking a gender that is already selected deselects the current gender
  const setSelectedGender = (newGender: number): void => {
    if (gender === newGender) {
      setGender(GenderType.unknown);
    } else {
      setGender(newGender);
    }
  };

  // The captcha handler upon triggering the challenge
  const handleCaptchaDataUpdated = (data: TCaptchaInputParams) => {
    setUnifiedCaptchaId(data.unifiedCaptchaId);
    setDataExchange(data.dataExchange);
  };

  const handleCaptchaError = (error: unknown) => {
    const captchaData: TCaptchaInputParams = parseCaptchaData(error);
    incrementEphemeralCounter(counters.captcha);
    handleCaptchaDataUpdated(captchaData);
  };

  // The captcha handler when the challenge is completed
  const handleCaptchaChallengeCompleted = (
    data: TOnCaptchaChallengeCompletedData
  ) => {
    setCaptchaId(data.captchaId);
    setCaptchaToken(data.captchaToken);
  };

  const clearCaptchaData = () => {
    setDataExchange("");
    setUnifiedCaptchaId("");
  };

  // The captcha handler when system errors are returned from the service
  const handleCaptchaChallengeInvalidated = (
    data: TOnCaptchaChallengeInvalidatedData
  ) => {
    switch (data.errorCode) {
      case CaptchaConstants.errorCodes.failedToLoadProviderScript:
        setGeneralError(validationMessages.captchaFailedToLoad);
        return;
      case CaptchaConstants.errorCodes.failedToVerify:
        setGeneralError(validationMessages.captchaFailedToVerify);
        return;
      default:
        setGeneralError(validationMessages.unknownError);
    }
  };

  const handleCaptchaChallengeAbandoned = () => {
    clearCaptchaData();
    setIsSubmitting(false);
  };

  const isFormValid = (): boolean => {
    if (
      isKoreaIdUser &&
      isUnderThresholdAge(18, year, month, day) &&
      emailStatus !== FormFieldStatus.Valid
    ) {
      return false;
    }
    return (
      birthdayStatus === FormFieldStatus.Valid &&
      usernameStatus === FormFieldStatus.Valid &&
      passwordStatus === FormFieldStatus.Valid
    );
  };

  const handleUserAgreements = async () => {
    const userAgreementsResponse = await getUserAgreements();
    if (userAgreementsResponse && userAgreementsResponse.length > 0) {
      userAgreementsResponse.forEach((agreement) => {
        userAgreementIds.push(agreement.id);
      });
    }
  };

  const handleGetMetadata = async () => {
    const metadataResponse = await getMetadataV2();
    if (
      metadataResponse &&
      metadataResponse.IsUserAgreementsSignupIntegrationEnabled
    ) {
      setIsUserAgreementsEnabled(true);
      // eslint-disable-next-line no-void
      void handleUserAgreements();
    }
  };

  useEffect(() => {
    // eslint-disable-next-line no-void
    void handleGetMetadata();
    const currentLocale = getLocale();
    if (currentLocale) {
      setLocale(currentLocale);
    }
    const birthdayString = getBirthdayToPrefill();
    if (birthdayString) {
      prefillBirthday(birthdayString);
      setIsKoreaIdUser(true);
    }
  }, []);

  const focusFirstFieldWithError = () => {
    if (birthdayStatus !== FormFieldStatus.Valid) {
      const firstBirthdayDropdown = getFirstDatePart();
      switch (firstBirthdayDropdown) {
        case birthdayPickerConstants.day.name:
          birthdayDayRef.current?.focus();
          break;
        case birthdayPickerConstants.month.name:
          birthdayMonthRef.current?.focus();
          break;
        case birthdayPickerConstants.year.name:
          birthdayYearRef.current?.focus();
          break;
        default:
      }
    } else if (
      isKoreaIdUser &&
      isUnderThresholdAge(18, year, month, day) &&
      emailStatus !== FormFieldStatus.Valid
    ) {
      emailRef.current?.focus();
    } else if (usernameStatus !== FormFieldStatus.Valid) {
      usernameRef.current?.focus();
    } else if (passwordStatus !== FormFieldStatus.Valid) {
      passwordRef.current?.focus();
    }
  };

  const buildSignupParams = (): TSignupParams => {
    const birthday = new Date(`${day} ${month} ${year}`);

    const signUpParams: TSignupParams = {
      username,
      password,
      birthday,
      gender,
      isTosAgreementBoxChecked: true,
    };

    if (email) {
      signUpParams.email = email;
    }

    if (locale) {
      signUpParams.locale = locale;
    }

    if (captchaId && captchaToken) {
      signUpParams.captchaId = captchaId;
      signUpParams.captchaToken = captchaToken;
    }

    if (isUserAgreementsEnabled && userAgreementIds.length > 0) {
      signUpParams.agreementIds = userAgreementIds;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const identityVerificationResultToken = localStorageService.getLocalStorage(
      identityVerificationResultTokenName
    );
    if (identityVerificationResultToken) {
      signUpParams.identityVerificationResultToken =
        identityVerificationResultToken as string;
    }

    return signUpParams;
  };

  const handleSignupError = (error: unknown) => {
    const errorCode = parseErrorCode(error);
    switch (errorCode) {
      case errorCodes.captcha:
        handleCaptchaError(error);
        return;
      case errorCodes.invalidBirthdate:
        setBirthdayStatus(FormFieldStatus.Invalid);
        setBirthdayErrorMessage(validationMessages.birthdayInvalid);
        break;
      case errorCodes.invalidUsername:
        setUsernameStatus(FormFieldStatus.Invalid);
        setUsernameErrorMessage(validationMessages.usernameInvalid);
        break;
      case errorCodes.usernameTaken:
        setUsernameStatus(FormFieldStatus.Invalid);
        setUsernameErrorMessage(validationMessages.usernameAlreadyInUse);
        break;
      case errorCodes.invalidPassword:
        setPasswordStatus(FormFieldStatus.Invalid);
        setPasswordErrorMessage(validationMessages.useDifferentPassword);
        setPasswordThatFailedServerCheck(password);
        break;
      case errorCodes.passwordSameAsUsername:
      case errorCodes.passwordTooSimple:
        setPasswordStatus(FormFieldStatus.Invalid);
        setPasswordErrorMessage(validationMessages.passwordInvalid);
        setPasswordThatFailedServerCheck(password);
        break;
      case errorCodes.invalidIdentityVerificationResultToken:
      case errorCodes.identityVerificationFailed:
        setHasIdVerificationError(true);
        return;
      case errorCodes.insertAcceptancesFailed:
        setGeneralError(validationMessages.accountCreatedButLoginFailed);
        break;
      default:
        // Ignore generic challenge abandons.
        if (
          AccountIntegrityChallengeService.Generic.ChallengeError.matchAbandoned(
            error
          )
        ) {
          break;
        }
        if (typeof error === "object") {
          if (
            (error as Record<string, unknown>).status ===
            errorCodes.tooManyAttepmts
          ) {
            incrementEphemeralCounter(counters.tooManyAttempts);
          }
        }
        setGeneralError(validationMessages.unknownError);
        break;
    }
    clearCaptchaData();
    setIsSubmitting(false);
    focusFirstFieldWithError();
  };

  const signupWithParams = async (
    params: TSignupParams,
    returnUrlValue: string
  ) => {
    try {
      const { authParams, clientKeyPair } =
        await buildAuthParamsWithSecureAuthIntentAndClientKeyPair(params);
      if (clientKeyPair) {
        clientCryptoKeyPair.current = clientKeyPair;
      }
      const result = await signup(authParams as TSignupParams);
      if (clientCryptoKeyPair.current) {
        await storeClientKeyPair(
          result.userId.toString(),
          clientCryptoKeyPair.current
        );
      }
      handlePostSignup(returnUrlValue);
    } catch (error) {
      handleSignupError(error);
    }
  };

  const handleSubmit = (isUserTriggered: boolean) => {
    if (isUserTriggered) {
      sendSignupButtonClickEvent();
    }

    handleBirthdayChange(true);
    // eslint-disable-next-line no-void
    void handleUsernameValidation();
    // eslint-disable-next-line no-void
    void handlePasswordValidation();
    if (!isFormValid()) {
      focusFirstFieldWithError();
      return;
    }

    setIsSubmitting(true);

    if (isUserTriggered) {
      incrementSignUpSubmitCounters(isFirstSignUpSubmit);
      setIsFirstSignUpSubmit(false);
    }

    const params = buildSignupParams();

    const returnUrlValue: string = getReturnUrl();
    // eslint-disable-next-line no-void
    void signupWithParams(params, returnUrlValue);
  };

  useEffect(() => {
    if (captchaId && captchaToken) {
      handleSubmit(false);
    }
  }, [captchaId + captchaToken]);

  return (
    <div className="signup-container theme-bg rbx-login-form">
      <div id="signup">
        <h3 className="text-center signup-header">
          {translate(signupFormStrings.Heading)}
        </h3>
        <div className="signup-or-log-in new-username-pwd-rule">
          <div className="signup-container">
            {isKoreaIdUser && !isUnderThresholdAge(18, year, month, day) && (
              <IdVerificationHelpText />
            )}
            <div className="signup-input-area">
              <BirthdayPicker
                orderedBirthdaySelects={getOrderedBirthdaySelects(
                  day,
                  month,
                  year,
                  (e) => setDay(e.target.value),
                  (e) => setMonth(e.target.value),
                  (e) => setYear(e.target.value),
                  birthdayDayRef,
                  birthdayMonthRef,
                  birthdayYearRef
                )}
                birthdayStatus={birthdayStatus}
                birthdayErrorMessage={birthdayErrorMessage}
                isBirthdayDisabled={isBirthdayDisabled || isSubmitting}
                translate={translate}
              />
              {isKoreaIdUser && isUnderThresholdAge(18, year, month, day) && (
                <EmailInput
                  email={email}
                  emailStatus={emailStatus}
                  handleEmailChange={setEmail}
                  emailErrorMessage={emailErrorMessage}
                  disabled={isSubmitting}
                  emailRef={emailRef}
                  translate={translate}
                />
              )}
              <UsernameInput
                username={username}
                usernameStatus={usernameStatus}
                handleUsernameChange={setUsername}
                usernameErrorMessage={usernameErrorMessage}
                disabled={isSubmitting}
                usernameRef={usernameRef}
                translate={translate}
              />
              <PasswordInput
                password={password}
                passwordStatus={passwordStatus}
                handlePasswordChange={setPassword}
                passwordErrorMessage={passwordErrorMessage}
                passwordVisibility={passwordVisibility}
                handlePasswordVisibilityToggle={togglePasswordVisibility}
                disabled={isSubmitting}
                passwordRef={passwordRef}
                translate={translate}
              />
              <GenderPicker
                gender={gender}
                setSelectedGender={setSelectedGender}
                translate={translate}
              />
              <LegalText locale={locale} translate={translate} />
              <button
                id="signup-button"
                type="button"
                className="btn-primary-md signup-submit-button btn-full-width"
                name="signupSubmit"
                // function to check if signup button should be disabled is called on every state change
                disabled={getIsSignupButtonDisabled(
                  isDisableSignupButtonExperimentEnabled,
                  isFormValid(),
                  isSubmitting
                )}
                onClick={() => handleSubmit(true)}
              >
                {translate(signupFormStrings.SignUp)}
              </button>
              <noscript>
                <div className="text-danger">
                  <strong>
                    {translate(validationMessages.javascriptRequired)}
                  </strong>
                </div>
              </noscript>
              {generalError && (
                <div
                  role="button"
                  aria-label="dismiss general error"
                  tabIndex={0}
                  id="GeneralErrorText"
                  className="input-validation-large alert-warning font-bold"
                  aria-live="polite"
                  onClick={() => setGeneralError("")}
                >
                  {translate(generalError)}
                </div>
              )}
            </div>
            {unifiedCaptchaId && dataExchange && (
              <CaptchaComponent
                containerId={reactSignupCaptchaContainer}
                actionType={
                  AccountIntegrityChallengeService.Captcha.ActionType.Signup
                }
                unifiedCaptchaId={unifiedCaptchaId}
                dataExchange={dataExchange}
                onCaptchaChallengeCompleted={handleCaptchaChallengeCompleted}
                onCaptchaChallengeInvalidated={
                  handleCaptchaChallengeInvalidated
                }
                onCaptchaChallengeAbandoned={handleCaptchaChallengeAbandoned}
                onUnknownError={() => handleSignupError(null)}
              />
            )}
            {isKoreaIdUser && (
              <IdVerificationErrorModal
                hasIdVerificationError={hasIdVerificationError}
                translate={translate}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withTranslations(SignupFormContainer, signupTranslationConfig);
