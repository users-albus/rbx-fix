/**
 * Constants for event stream events in auth webapp.
 */
const EVENT_CONSTANTS = {
  eventName: {
    loginOtherDevice: "loginOtherDevice",
    formValidation: "formValidation",
  },
  context: {
    loginPage: "loginPage",
    loginForm: "LoginForm",
    landingPage: "Multiverse",
    signupForm: "MultiverseSignupForm",
    sendOTP: "sendOTP",
    enterOTP: "enterOTP",
    disambiguationOTP: "disambiguationOTP",
    disambiguationEmail: "disambiguationEmail",
    disambiguationPhone: "disambiguationPhone",
  },
  aType: {
    buttonClick: "buttonClick",
    click: "click",
    offFocus: "offFocus",
    focus: "focus",
    shown: "shown",
  },
  field: {
    loginOtherDevice: "loginOtherDevice",
    loginOTP: "loginOTP",
    loginSubmitButtonName: "loginSubmit",
    password: "password",
    username: "username",
    signupSubmitButtonName: "signupSubmit",
    appButtonClickName: "AppLink",
    showPassword: "showPassword",
    hidePassword: "hidePassword",
    birthdayDay: "birthdayDay",
    birthdayMonth: "birthdayMonth",
    birthdayYear: "birthdayYear",
    signupUsername: "signupUsername",
    signupPassword: "signupPassword",
    signupEmail: "signupEmail",
    parentEmail: "parentEmail",
    genderMale: "genderMale",
    genderFemale: "genderFemale",
    email: "email",
    otpCode: "OTPcode",
    errorMessage: "errorMessage",
    accountSelection: "accountSelection",
  },
  btn: {
    cancel: "cancel",
    sendCode: "sendCode",
    resendCode: "resendCode",
    login: "login",
  },
  input: {
    redacted: "[Redacted]",
  },
  origin: {
    webVerifiedSignup: "WebVerifiedSignup",
  },
} as const;

export default EVENT_CONSTANTS;
