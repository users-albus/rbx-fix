// This file contains the public interface types for this component. Since this
// component uses TS strict mode, which other TS components may not, we keep
// the types for the public interface separate in order to avoid compilation
// errors arising from the strict mode mismatch.

/**
 * The requested challenge to render.
 */
enum ChallengeType {
  CAPTCHA = "captcha",
  FORCE_AUTHENTICATOR = "forceauthenticator",
  TWO_STEP_VERIFICATION = "twostepverification",
  SECURITY_QUESTIONS = "securityquestions",
  REAUTHENTICATION = "reauthentication",
  PROOF_OF_WORK = "proofofwork",
}

export default ChallengeType;
