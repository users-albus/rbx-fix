export const pageNames = {
  EnterEmail: "enterEmail",
  EnterCode: "enterCode",
};

export const enterEmailStrings = {
  EmailPlaceholder: "Label.Email",
  InvalidEmail: "Response.InvalidEmail",
  SendCode: "Action.SendCode",
};

export const enterCodeStrings = {
  CodePlaceholder: "Label.LoginCode",
  CodeSent: "Label.CodeSent",
  Resend: "Action.Resend",
  // TODO: change to having trouble once translations are in
  LearnMore: "Label.LearnMore",
};

export const errorStrings = {
  Throttled: "Response.TooManyAttemptsPleaseWait",
  Unknown: "Response.UnknownError",
};

export const errorCodes = {
  unknownError: 0,
  sessionTokenInvalid: 3,
  throttled: 6,
};

export const statusCodes = {
  gatewayThrottle: 429,
};

export const emailLengthLimit = 320;

export const contactType = "email";

export const helpUrl = "https://en.help.roblox.com/hc/articles/11014749736980";
