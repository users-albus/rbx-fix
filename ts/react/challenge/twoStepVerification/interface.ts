// This file contains the public interface types for this component. Since this
// component uses TS strict mode, which other TS components may not, we keep
// the types for the public interface separate in order to avoid compilation
// errors arising from the strict mode mismatch.

/*
 * Enums
 */

/**
 * The context in which 2SV is being called.
 */
export enum ActionType {
  Unknown = "Unknown",
  Login = "Login",
  RobuxSpend = "RobuxSpend",
  ItemTrade = "ItemTrade",
  Resale = "Resale",
  PasswordReset = "PasswordReset",
  RevertAccount = "RevertAccount",
  Generic = "Generic",
  GenericWithRecoveryCodes = "GenericWithRecoveryCodes",
}

/**
 * A 2SV media type.
 */
export enum MediaType {
  Email = "Email",
  Authenticator = "Authenticator",
  RecoveryCode = "RecoveryCode",
  SMS = "SMS",
  SecurityKey = "SecurityKey",
}

/**
 * An error code for a 2SV challenge.
 */
export enum ErrorCode {
  UNKNOWN = 0,
  SESSION_EXPIRED = 1,
}

/*
 * Callback Types
 */

export type OnChallengeCompletedData = {
  verificationToken: string;
  rememberDevice: boolean;
};

export type OnChallengeInvalidatedData = {
  errorCode: ErrorCode;
  errorMessage: string;
};

export type OnChallengeCompletedCallback = (
  data: OnChallengeCompletedData
) => unknown;

export type OnChallengeInvalidatedCallback = (
  data: OnChallengeInvalidatedData
) => unknown;

export type OnModalChallengeAbandonedCallback = (
  restoreModal: () => void
) => unknown;

/*
 * Challenge Method
 */

type ChallengeParametersWithModal = {
  renderInline: false;
  onModalChallengeAbandoned: OnModalChallengeAbandonedCallback;
};

type ChallengeParametersWithNoModal = {
  renderInline: true;
  onModalChallengeAbandoned: null;
};

/**
 * The parameters required to render a 2SV challenge.
 */
export type ChallengeParameters = {
  containerId: string;
  userId: string;
  challengeId: string;
  appType?: string;
  actionType: ActionType;
  shouldModifyBrowserHistory?: boolean;
  shouldShowRememberDeviceCheckbox: boolean;
  shouldDynamicallyLoadTranslationResources: boolean;
  onChallengeCompleted: OnChallengeCompletedCallback;
  onChallengeInvalidated: OnChallengeInvalidatedCallback;
} & (ChallengeParametersWithModal | ChallengeParametersWithNoModal);

/**
 * The type of `renderChallenge`.
 */
export type RenderChallenge = (
  challengeParameters: ChallengeParameters
) => Promise<boolean>;

/**
 * Renders a 2SV challenge with the given parameters.
 */
export declare const renderChallenge: RenderChallenge;
