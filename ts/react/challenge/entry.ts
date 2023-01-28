import Roblox from "Roblox";
import * as Captcha from "./captcha";
import * as ForceAuthenticator from "./forceAuthenticator";
import * as Generic from "./generic";
import * as HybridWrapper from "./hybridWrapper";
import * as Interface from "./interface";
import * as ProofOfWork from "./proofOfWork";
import * as Reauthentication from "./reauthentication";
import * as SecurityQuestions from "./securityQuestions";
import * as TwoStepVerification from "./twoStepVerification";

// This type constraint (`typeof Interface`) ensures that any changes made to
// the shared interface types for this component get reflected in its compiled
// definition.
const AccountIntegrityChallengeService: typeof Interface = {
  Captcha,
  ForceAuthenticator,
  Generic,
  HybridWrapper,
  ProofOfWork,
  Reauthentication,
  SecurityQuestions,
  TwoStepVerification,
};

Object.assign(Roblox, {
  AccountIntegrityChallengeService,
});
