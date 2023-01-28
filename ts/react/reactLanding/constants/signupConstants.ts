import { EnvironmentUrls } from "Roblox";

export const koreaIdVerification = "/id-verification/korea/";

export const localeParamName = "?locale=";

export const urlQueryNames = {
  locale: "locale",
};

export const newUserParam = "nu=true";

export const validateUsernameContext = "Signup";

export const identityVerificationResultTokenName =
  "identityVerificationResultToken";

export const counters = {
  prefix: "WebsiteSignUp_",
  firstAttempt: "FirstAttempt",
  attempt: "Attempt",
  success: "Success",
  captcha: "Captcha",
  tooManyAttempts: "TooManyAttempts",
  passwordInvalid: "PasswordInvalid",
  usernameInvalid: "UsernameInvalid",
  usernameTaken: "UsernameTaken",
  identityVerificationResultTokenInvalid:
    "InvalidIdentityVerificationResultToken",
  identityVerificationFailed: "IdentityVerificationFailed",
  unknownError: "UnknownError",
};

export const urlConstants = {
  signup: `${EnvironmentUrls.authApi}/v2/signup`,
  metadataV2: `${EnvironmentUrls.authApi}/v2/metadata`,
  userAgreements: `${EnvironmentUrls.userAgreementsServiceApi}/v1/agreements-resolution/web`,
  validateUsername: `${EnvironmentUrls.authApi}/v1/usernames/validate`,
  validatePassword: `${EnvironmentUrls.authApi}/v2/passwords/validate`,
  homePageNewUser: "/home?nu=true",
  termsOfUse: `${EnvironmentUrls.websiteUrl}/info/terms`,
  privacy: `${EnvironmentUrls.websiteUrl}/info/privacy`,
};

export const anchorOpeningTag = '<a target="_blank" href="';
export const anchorOpeningTagEnd = '">';
export const anchorClosingTag = "</a>";

export const birthdayPickerConstants = {
  year: {
    id: "YearDropdown",
    class: "year",
    name: "birthdayYear",
    type: "year",
  },
  month: {
    id: "MonthDropdown",
    class: "month",
    name: "birthdayMonth",
    type: "month",
  },
  day: {
    id: "DayDropdown",
    class: "day",
    name: "birthdayDay",
    type: "day",
  },
};

export const monthStrings = [
  "Label.January",
  "Label.February",
  "Label.March",
  "Label.April",
  "Label.May",
  "Label.June",
  "Label.July",
  "Label.August",
  "Label.September",
  "Label.October",
  "Label.November",
  "Label.December",
];

export const signupFormStrings = {
  Heading: "Heading.SignupHaveFun",
  Birthday: "Label.Birthday",
  Day: "Label.Day",
  Month: "Label.Month",
  Year: "Label.Year",
  Username: "Label.Username",
  UsernamePlaceholder: "Message.Username.NoRealNameUse",
  Password: "Label.Password",
  PasswordPlaceholder: "Label.PasswordPlaceholder",
  SignUpAgreement: "Description.SignUpAgreement",
  TermsOfUSe: "Label.TermsOfUse",
  Privacy: "Description.PrivacyPolicy",
  SignUp: "GuestSignUpAB.Action.SignUp",
  EmailU13: "Label.EmailRequirementsUnder13",
  KoreaAdultUser: "Description.PersonalInfoForUser",
  IdVerificationErrorTitle: "Title.VerificationError",
  IdVerificationErrorBody: "Description.VerificationNotComplete",
  TryAgain: "Action.TryAgain",
};

export const validationMessages = {
  usernameInvalid: "Response.UsernameInvalid",
  usernameAlreadyInUse: "Response.UsernameAlreadyInUse",
  badUsername: "Response.BadUsername",
  usernamePii: "Response.UsernamePrivateInfo",
  usernameNotAvailable: "Response.UsernameNotAvailable",
  usernameRequired: "Response.PleaseEnterUsername",
  birthdayRequired: "Response.BirthdayMustBeSetFirst",
  useDifferentPassword: "Response.DifferentPasswordRequired",
  passwordInvalid: "Response.InvalidPassword",
  birthdayInvalid: "Response.InvalidBirthday",
  javascriptRequired: "Response.JavaScriptRequired",
  unknownError: "Response.UnknownError",
  accountCreatedButLoginFailed: "Response.UserAccountCreatedButLoginFailed",
  captchaFailedToLoad: "Response.CaptchaErrorFailedToLoad",
  captchaFailedToVerify: "Response.CaptchaErrorFailedToVerify",
  invalidEmail: "Response.InvalidEmail",
};

export const usernameValidationMessageMap = new Map<number, string>([
  [1, validationMessages.usernameAlreadyInUse],
  [2, validationMessages.badUsername],
  [10, validationMessages.usernamePii],
  [12, validationMessages.usernameNotAvailable],
]);

export const errorCodes = {
  captcha: 2,
  forbidden: 403,
  identityVerificationFailed: 110,
  insertAcceptancesFailed: 111,
  invalidBirthdate: 4,
  invalidIdentityVerificationResultToken: 109,
  invalidPassword: 7,
  invalidUsername: 5,
  passwordSameAsUsername: 8,
  passwordTooSimple: 9,
  usernameTaken: 6,
  tooManyAttepmts: 429,
};

export const experimentNames = {
  isSignupButtonDisabled: "isSignupButtonDisabled",
};

export const maxSignUpAge = 100;
export const maxNumberOfDates = 31;

export const reactSignupCaptchaContainer = "react-signup-captcha-container";
