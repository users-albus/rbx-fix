/* eslint-disable lines-between-class-members */
import * as AccountPinApi from "./apis/accountPin";
import * as CaptchaApi from "./apis/captcha";
import * as EmailApi from "./apis/email";
import * as GamesApi from "./apis/games";
import * as PasswordsApi from "./apis/passwords";
import * as PromptAssignmentsApi from "./apis/promptAssignments";
import * as ProofOfWorkApi from "./apis/proofOfWork";
import * as ReauthenticationApi from "./apis/reauthentication";
import * as SecurityQuestionsApi from "./apis/securityQuestions";
import * as ThumbnailsApi from "./apis/thumbnails";
import * as TranslationsApi from "./apis/translations";
import * as TwoStepVerificationApi from "./apis/twoStepVerification";
import * as MetricsAPI from "./apis/metrics";

/**
 * A class encapsulating the various HTTP requests in this web app.
 *
 * Note that all of the requests return `Result` types, which can be explicitly
 * instantiated with either a response value or an error, depending on whether
 * the request succeeded. The requests should only throw an error if a fatal
 * (i.e. unexpected) exception occurred.
 */
export class RequestServiceDefault {
  // Note that these names correspond to logical groupings of endpoints rather
  // than explicit microservices.
  accountPin = AccountPinApi;
  captcha = CaptchaApi;
  email = EmailApi;
  games = GamesApi;
  metrics = MetricsAPI;
  password = PasswordsApi;
  promptAssignments = PromptAssignmentsApi;
  securityQuestions = SecurityQuestionsApi;
  reauthentication = ReauthenticationApi;
  thumbnails = ThumbnailsApi;
  translations = TranslationsApi;
  twoStepVerification = TwoStepVerificationApi;
  proofOfWork = ProofOfWorkApi;
}

/**
 * An interface encapsulating the various HTTP requests in this web app.
 *
 * Note that all of the requests return `Result` types, which can be explicitly
 * instantiated with either a response value or an error, depending on whether
 * the request succeeded. The requests should only throw an error if a fatal
 * (i.e. unexpected) exception occurred.
 *
 * This interface type offers future flexibility e.g. for mocking the default
 * request service.
 */
export type RequestService = {
  [K in keyof RequestServiceDefault]: RequestServiceDefault[K];
};
