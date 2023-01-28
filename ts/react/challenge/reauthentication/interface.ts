// This file contains the public interface types for this component. Since this
// component uses TS strict mode, which other TS components may not, we keep
// the types for the public interface separate in order to avoid compilation
// errors arising from the strict mode mismatch.

/**
 * An error code for a re-authentication challenge.
 */
export enum ErrorCode {
  UNKNOWN = 0,
}

/*
 * Callback Types
 */

export type OnChallengeCompletedData = {
  reauthenticationToken: string;
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
 * The parameters required to render a re-authentication challenge.
 */
export type ChallengeParameters = {
  containerId: string;
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
 * Renders a re-authentication challenge with the given parameters.
 */
export declare const renderChallenge: RenderChallenge;
