import angularJsUtilitiesModule from "../angularJsUtilitiesModule";

const httpStatusCodes = {
  tooManyAttempts: 429,
};

angularJsUtilitiesModule.constant("httpStatusCodes", httpStatusCodes);
export default httpStatusCodes;
