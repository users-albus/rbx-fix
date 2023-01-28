import React, {
  createContext,
  ReactChild,
  ReactElement,
  useEffect,
  useReducer,
  useState,
} from "react";
import { TranslateFunction } from "react-utilities";
import { RequestService } from "../../../../common/request";
import { getResources } from "../constants/resources";
import {
  OnChallengeCompletedCallback,
  OnChallengeInvalidatedCallback,
  OnModalChallengeAbandonedCallback,
} from "../interface";
import { EventService } from "../services/eventService";
import { MetricsService } from "../services/metricsService";
import { ProofOfWorkAction } from "./action";
import { ProofOfWorkState } from "./state";
import proofOfWorkStateReducer from "./stateReducer";

export type ProofOfWorkContext = {
  state: ProofOfWorkState;
  dispatch: React.Dispatch<ProofOfWorkAction>;
};

export const ProofOfWorkContext = createContext<ProofOfWorkContext | null>(
  null
);

type Props = {
  sessionId: string;
  renderInline: boolean;
  eventService: EventService;
  metricsService: MetricsService;
  requestService: RequestService;
  translate: TranslateFunction;
  onChallengeCompleted: OnChallengeCompletedCallback;
  onChallengeInvalidated: OnChallengeInvalidatedCallback;
  onModalChallengeAbandoned: OnModalChallengeAbandonedCallback | null;
  children: ReactChild;
};

/**
 * A React provider is a special component that wraps a tree of components and
 * exposes some global state (context) to the entire tree. Descendants can then
 * access this context with `useContext`.
 */
export const ProofOfWorkContextProvider = ({
  sessionId,
  renderInline,
  eventService,
  metricsService,
  requestService,
  translate,
  onChallengeCompleted,
  onChallengeInvalidated,
  onModalChallengeAbandoned,
  children,
}: Props): ReactElement => {
  // We declare these variables as lazy-initialized state variables since they
  // do not need to be re-computed if this component re-renders.
  const [resources] = useState(() => getResources(translate));
  const [initialState] = useState<ProofOfWorkState>(() => ({
    // Immutable parameters:
    sessionId,
    renderInline,
    // Immutable state
    resources,
    eventService,
    metricsService,
    requestService,
    onModalChallengeAbandoned,
    // Mutable state:
    onChallengeCompletedData: null,
    onChallengeInvalidatedData: null,
    isModalVisible: true,
  }));

  // Components will access and mutate state via these variables:
  const [state, dispatch] = useReducer(proofOfWorkStateReducer, initialState);

  // Completion effect:
  useEffect(() => {
    // Ensure that invalidation effect has not already fired.
    if (
      state.onChallengeCompletedData === null ||
      state.onChallengeInvalidatedData !== null
    ) {
      return;
    }

    eventService.sendChallengeCompletedEvent();
    metricsService.fireChallengeCompletedEvent();

    onChallengeCompleted(state.onChallengeCompletedData);
  }, [
    eventService,
    metricsService,
    state.onChallengeCompletedData,
    state.onChallengeInvalidatedData,
    onChallengeCompleted,
  ]);

  // Invalidation effect:
  useEffect(() => {
    // Ensure that completion effect has not already fired.
    if (
      state.onChallengeInvalidatedData === null ||
      state.onChallengeCompletedData !== null
    ) {
      return;
    }

    eventService.sendChallengeInvalidatedEvent();
    metricsService.fireChallengeInvalidatedEvent();

    onChallengeInvalidated(state.onChallengeInvalidatedData);
  }, [
    eventService,
    metricsService,
    state.onChallengeCompletedData,
    state.onChallengeInvalidatedData,
    onChallengeInvalidated,
  ]);

  /*
   * Effects
   *
   * NOTE: These effects cannot go inside the reducer, since reducers must not
   * have side-effects with respect to the app state.
   */

  return (
    <ProofOfWorkContext.Provider value={{ state, dispatch }}>
      {children}
    </ProofOfWorkContext.Provider>
  );
};
