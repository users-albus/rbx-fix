import React, { useEffect, useRef, useState } from "react";
import { Modal, ProgressBar } from "react-style-guide";
import {
  TimeLockPuzzleMessage,
  TimeLockPuzzleParameters,
  TimeLockPuzzleSolver,
} from "../../../../common/algorithm/timeLockPuzzleSolver";
import InlineChallenge from "../../../common/inlineChallenge";
import InlineChallengeBody from "../../../common/inlineChallengeBody";
import {
  FragmentModalHeader,
  HeaderButtonType,
} from "../../../common/modalHeader";
import { mapProofOfWorkErrorToChallengeErrorCode } from "../constants/resources";
import { AnswerState } from "../constants/types";
import useProofOfWorkContext from "../hooks/useProofOfWorkContext";
import { ErrorCode } from "../interface";
import { ProofOfWorkActionType } from "../store/action";
import timeLockPuzzle from "../worker/timeLockPuzzle";

const PROGRESS_DISPLAY_PERCENTAGE_PRECISION = 0;

/**
 * Utility functions.
 */

const getProgressLabelString = (progressPercentage: number): string =>
  `${progressPercentage.toFixed(PROGRESS_DISPLAY_PERCENTAGE_PRECISION)}%`;

/**
 * A container element for the Proof-of-Work UI.
 *
 * TODO: Consider splitting this component up if it gets much larger.
 */
const ProofOfWork: React.FC = () => {
  const {
    state: {
      sessionId,
      renderInline,
      resources,
      eventService,
      metricsService,
      requestService,
      onModalChallengeAbandoned,
      isModalVisible,
    },
    dispatch,
  } = useProofOfWorkContext();

  /*
   * Component State
   */

  const [puzzleArtifact, setPuzzleArtifact] = useState<string | null>(null);
  const [puzzleSolution, setPuzzleSolution] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>(
    AnswerState.INITIAL
  );
  const [progress, setProgress] = useState<number>(0);

  // Mutable state to hold the initialized Web Worker:
  const worker = useRef<Worker | null>(null);

  // Mutable state to hold the fallback puzzle worker; only when web worker is
  // not available on browsers.
  const fallbackSolver = useRef<TimeLockPuzzleSolver | null>(null);

  /*
   * Event Handlers
   */

  const resetChallengeState = () => {
    setPuzzleArtifact(null);
    setPuzzleSolution(null);
    setAnswerState(AnswerState.INITIAL);
  };

  const solvePuzzle = () => {
    if (
      puzzleArtifact == null ||
      answerState !== AnswerState.READY_TO_COMPUTE
    ) {
      setAnswerState(AnswerState.VERIFIED_INCORRECT);
      dispatch({
        type: ProofOfWorkActionType.SET_CHALLENGE_INVALIDATED,
        onChallengeInvalidatedData: {
          errorCode: ErrorCode.UNKNOWN,
          // TODO: More-specific error handling.
          errorMessage: resources.Description.VerificationError,
        },
      });
      return;
    }
    if (worker.current == null) {
      // If the worker is not initialized properly, run in fallback mode.
      const parameters = JSON.parse(puzzleArtifact) as TimeLockPuzzleParameters;
      fallbackSolver.current = new TimeLockPuzzleSolver(parameters);
      setAnswerState(AnswerState.COMPUTING);
      fallbackSolver.current.runAsync(
        // Progress callback:
        (newProgress: number) => {
          setProgress(newProgress);
        },
        // Answer callback:
        (answer: string | null) => {
          setPuzzleSolution(answer);
          setAnswerState(AnswerState.COMPUTING_DONE);
        }
      );
      return;
    }

    setAnswerState(AnswerState.COMPUTING);
    worker.current.onmessage = (event: MessageEvent<TimeLockPuzzleMessage>) => {
      // Some older browsers send Worker messages as strings.
      const message =
        typeof event.data === "object"
          ? event.data
          : (JSON.parse(event.data) as TimeLockPuzzleMessage);
      setProgress(message.progress);
      if (message.answer) {
        setPuzzleSolution(message.answer);
        setAnswerState(AnswerState.COMPUTING_DONE);
      }
    };
    worker.current.postMessage(puzzleArtifact);
  };

  const checkAnswer = async () => {
    if (puzzleSolution == null) {
      return;
    }
    const result = await requestService.proofOfWork.verifyPuzzle(
      sessionId,
      puzzleSolution
    );

    // Return back to the caller in all error cases.
    if (result.isError) {
      dispatch({
        type: ProofOfWorkActionType.SET_CHALLENGE_INVALIDATED,
        onChallengeInvalidatedData: {
          errorCode: mapProofOfWorkErrorToChallengeErrorCode(result.error),
          // TODO: More-specific error handling.
          errorMessage: resources.Description.VerificationError,
        },
      });
      return;
    }

    // CASE: Correct answer.
    if (result.value.answerCorrect) {
      // CASE: Answer correct; complete challenge.
      setAnswerState(AnswerState.VERIFIED_CORRECT);
      dispatch({
        type: ProofOfWorkActionType.SET_CHALLENGE_COMPLETED,
        onChallengeCompletedData: {
          redemptionToken: result.value.redemptionToken,
        },
      });
    } else {
      // CASE: Incorrect answer
      setAnswerState(AnswerState.VERIFIED_INCORRECT);
      dispatch({
        type: ProofOfWorkActionType.SET_CHALLENGE_INVALIDATED,
        onChallengeInvalidatedData: {
          errorCode: ErrorCode.ANSWER_INVALID,
          // TODO: More-specific error handling.
          errorMessage: resources.Description.VerificationError,
        },
      });
    }
  };

  const loadChallenge = async () => {
    resetChallengeState();
    try {
      worker.current = timeLockPuzzle();
    } catch (error) {
      worker.current = null;
    }

    const resultGetPuzzle = await requestService.proofOfWork.getPuzzle(
      sessionId
    );
    if (resultGetPuzzle.isError) {
      dispatch({
        type: ProofOfWorkActionType.SET_CHALLENGE_INVALIDATED,
        onChallengeInvalidatedData: {
          errorCode: ErrorCode.UNKNOWN,
          // TODO: More-specific error handling.
          errorMessage: resources.Description.VerificationError,
        },
      });
      return;
    }
    setPuzzleArtifact(resultGetPuzzle.value.artifacts);
    setAnswerState(AnswerState.READY_TO_COMPUTE);
  };

  const handleAnswerStateChange = async () => {
    switch (answerState) {
      case AnswerState.READY_TO_COMPUTE: {
        eventService.sendPuzzleInitializedEvent();
        metricsService.firePuzzleInitializedEvent();
        solvePuzzle();
        break;
      }
      case AnswerState.COMPUTING_DONE: {
        eventService.sendPuzzleCompletedEvent();
        metricsService.firePuzzleCompletedEvent();
        await checkAnswer();
        break;
      }
      default: {
        break;
      }
    }
  };

  const terminateComputationAndCloseModal = () => {
    dispatch({
      type: ProofOfWorkActionType.HIDE_MODAL_CHALLENGE,
    });
    if (worker.current) {
      worker.current.terminate();
    }
    if (fallbackSolver.current) {
      fallbackSolver.current.cancelRunAsync();
    }

    resetChallengeState();
    if (onModalChallengeAbandoned !== null) {
      onModalChallengeAbandoned(() =>
        dispatch({
          type: ProofOfWorkActionType.SHOW_MODAL_CHALLENGE,
        })
      );
    }
  };

  /*
   * Effects
   */

  // Challenge loading effect:
  useEffect(() => {
    // eslint-disable-next-line no-void
    void loadChallenge();
    return () => {
      if (worker.current) {
        worker.current.terminate();
        worker.current = null;
      }
      if (fallbackSolver.current) {
        fallbackSolver.current.cancelRunAsync();
        fallbackSolver.current = null;
      }

      resetChallengeState();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // eslint-disable-next-line no-void
    void handleAnswerStateChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answerState]);

  /*
   * Rendering Helpers
   */

  const getPageContent = () => {
    const BodyElement = renderInline ? InlineChallengeBody : Modal.Body;
    const progressPercentage = (progress || 0) * 100;

    return (
      <React.Fragment>
        <BodyElement>
          <div className="pow-body">
            <ProgressBar
              now={progressPercentage}
              label={getProgressLabelString(progressPercentage)}
              striped
            />
          </div>
        </BodyElement>
      </React.Fragment>
    );
  };

  /*
   * Component Markup
   */

  return renderInline ? (
    <InlineChallenge titleText={resources.Description.VerifyingYouAreNotBot}>
      {getPageContent()}
    </InlineChallenge>
  ) : (
    <Modal
      className="modal-modern modal-modern-challenge-proof-of-work"
      show={isModalVisible}
      onHide={terminateComputationAndCloseModal}
      backdrop="static"
    >
      <FragmentModalHeader
        headerText={resources.Description.VerifyingYouAreNotBot}
        buttonType={HeaderButtonType.CLOSE}
        buttonAction={terminateComputationAndCloseModal}
        buttonEnabled
        headerInfo={null}
      />
      {getPageContent()}
    </Modal>
  );
};

export default ProofOfWork;
