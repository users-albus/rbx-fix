import { ErrorCode, OnChallengeCompletedData } from "../interface";

export enum ReauthenticationActionType {
  SET_CHALLENGE_COMPLETED,
  SET_CHALLENGE_INVALIDATED,
  HIDE_MODAL_CHALLENGE,
  SHOW_MODAL_CHALLENGE,
}

export type ReauthenticationAction =
  | {
      type: ReauthenticationActionType.SET_CHALLENGE_COMPLETED;
      onChallengeCompletedData: OnChallengeCompletedData;
    }
  | {
      type: ReauthenticationActionType.SET_CHALLENGE_INVALIDATED;
      errorCode: ErrorCode;
    }
  | {
      type: ReauthenticationActionType.HIDE_MODAL_CHALLENGE;
    }
  | {
      type: ReauthenticationActionType.SHOW_MODAL_CHALLENGE;
    };
