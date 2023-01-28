const verificationUpsellConstants = {
  // page names
  Verification: "Verification",
  UpdateEmail: "UpdateEmail",
  UpdatePassword: "UpdatePassword",
  PhoneNumberEnterCTA: "PhoneNumberEnterCTA",
  PhoneNumberVerificationCTA: "PhoneNumberVerificationCTA",
  PhoneNumberVerificationEnterCode: "PhoneNumberVerificationEnterCode",
  PhoneNumberVerificationSendError: "PhoneNumberVerificationSendError",

  // origins
  Logout: "logout",
  BuyRobux: "buyRobuxPage",
  HomePage: "homepage",
  SubscriptionPurchase: "premiumSubscriptionPage",
  PurchaseWarning: "purchaseWarning",
  Signup: "Signup",

  // keys
  Enter: "Enter",

  // translation string keys
  // TODO: remove email strings and use common
  ActionChangeEmail: "Action.ChangeEmail",
  ActionResendConfirmationEmail: "Action.ResendConfirmationEmail",
  ActionSendConfirmationEmail: "Action.SendConfirmationEmail",
  ActionSent: "Action.Sent",
  ActionLogoutSkip: "Action.Logout",
  ActionGenericSkip: "Action.GenericSkip",
  ActionContinue: "Action.Continue",
  HomePageAddEmailTextOver13: "Description.PleaseEnterEmail",
  HomePageAddEmailTextUnder13: "Description.PleaseEnterParentEmail",
  DescriptionAddEmailTextOver13: "Description.AddEmailTextOver13",
  DescriptionAddEmailTextUnder13: "Description.AddEmailTextUnder13",
  DescriptionLogoutTextOver13: "Description.LogoutAddEmailTextOver13",
  DescriptionLogoutTextUnder13: "Description.LogoutAddEmailTextUnder13",
  DescriptionEnterPassword: "Description.EnterPassword",
  DescriptionVerifyEmailBody: "Description.VerifyEmailBody",
  DescriptionAddEmailTextStrongMessaging:
    "Description.AddEmailTextStrongMessaging",
  HeadingAddEmailHomePage: "Heading.PleaseAddEmail",
  HeadingAddEmail: "Heading.AddEmail",
  HeadingVerifyEmail: "Heading.VerifyEmail",
  HeadingVerifyOnLogout: "Heading.VerifyOnLogout",
  HeadingCompleteSetupOnLogout: "Heading.CompleteSetupOnLogout",
  LabelEmailInputPlaceholderOver13: "Label.EmailInputPlaceholderOver13",
  LabelEmailInputPlaceholderUnder13: "Label.EmailInputPlaceholderUnder13",
  LabelPasswordInputPlaceholder: "Label.PasswordInputPlaceholder",
  MessageConfirmationEmailNotSent: "Message.ConfirmationEmailNotSent",
  MessageInvalidEmailAddress: "Message.InvalidEmailAddress",
  MessageWrongPassword: "Message.WrongPassword",
  ResponseErrorTryAgain: "Response.ErrorTryAgain",
  ResponseTooManyAttemptsTryAgainLater: "Response.TooManyAttemptsTryAgainLater",
};

export { verificationUpsellConstants as default };
