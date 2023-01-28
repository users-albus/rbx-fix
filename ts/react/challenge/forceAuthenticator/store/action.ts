export enum ForceAuthenticatorActionType {
  HIDE_MODAL_CHALLENGE,
  SHOW_MODAL_CHALLENGE,
}

export type ForceAuthenticatorAction =
  | {
      type: ForceAuthenticatorActionType.HIDE_MODAL_CHALLENGE;
    }
  | {
      type: ForceAuthenticatorActionType.SHOW_MODAL_CHALLENGE;
    };
