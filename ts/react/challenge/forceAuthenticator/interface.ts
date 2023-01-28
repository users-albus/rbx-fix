// This file contains the public interface types for this component. Since this
// component uses TS strict mode, which other TS components may not, we keep
// the types for the public interface separate in order to avoid compilation
// errors arising from the strict mode mismatch.

/**
 * An error code for a force authenticator challenge.
 */
export enum ErrorCode {
  UNKNOWN = 0,
}

/*
 * Callback Types
 */

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
 * The parameters required to render a force authenticator challenge.
 */
export type ChallengeParameters = {
  containerId: string;
  shouldDynamicallyLoadTranslationResources: boolean;
} & (ChallengeParametersWithModal | ChallengeParametersWithNoModal);

/**
 * The type of `renderChallenge`.
 */
export type RenderChallenge = (
  challengeParameters: ChallengeParameters
) => Promise<boolean>;

/**
 * Renders a force authenticator modal challenge with the given parameters.
 */
export declare const renderChallenge: RenderChallenge;
