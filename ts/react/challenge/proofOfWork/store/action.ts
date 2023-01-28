import {
  OnChallengeCompletedData,
  OnChallengeInvalidatedData,
} from "../interface";

export enum ProofOfWorkActionType {
  SET_CHALLENGE_COMPLETED,
  SET_CHALLENGE_INVALIDATED,
  HIDE_MODAL_CHALLENGE,
  SHOW_MODAL_CHALLENGE,
}

export type ProofOfWorkAction =
  | {
      type: ProofOfWorkActionType.SET_CHALLENGE_COMPLETED;
      onChallengeCompletedData: OnChallengeCompletedData;
    }
  | {
      type: ProofOfWorkActionType.SET_CHALLENGE_INVALIDATED;
      onChallengeInvalidatedData: OnChallengeInvalidatedData;
    }
  | {
      type: ProofOfWorkActionType.SHOW_MODAL_CHALLENGE;
    }
  | {
      type: ProofOfWorkActionType.HIDE_MODAL_CHALLENGE;
    };
