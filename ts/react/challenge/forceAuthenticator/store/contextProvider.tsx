import React, {
  createContext,
  ReactChild,
  ReactElement,
  useReducer,
  useState,
} from "react";
import { TranslateFunction } from "react-utilities";
import { getResources } from "../constants/resources";
import { OnModalChallengeAbandonedCallback } from "../interface";
import { ForceAuthenticatorAction } from "./action";
import { ForceAuthenticatorState } from "./state";
import forceAuthenticatorStateReducer from "./stateReducer";

export type ForceAuthenticatorContext = {
  state: ForceAuthenticatorState;
  dispatch: React.Dispatch<ForceAuthenticatorAction>;
};

/**
 * A React `Context` is global state maintained for some subtree of the React
 * component hierarchy. This particular context is used for the entire
 * `forceAuthenticator` web app, containing both the app's state as well
 * as a function to dispatch actions on the state.
 */
export const ForceAuthenticatorContext =
  createContext<ForceAuthenticatorContext | null>(
    // The argument passed to `createContext` is supposed to define a default
    // value that gets used if no provider is available in the component tree at
    // the time that `useContext` is called. To avoid runtime errors as a result
    // of forgetting to wrap a subtree with a provider, we use `null` as the
    // default value and test for it whenever global state is accessed.
    null
  );

type Props = {
  renderInline: boolean;
  translate: TranslateFunction;
  onModalChallengeAbandoned: OnModalChallengeAbandonedCallback | null;
  children: ReactChild;
};

/**
 * A React provider is a special component that wraps a tree of components and
 * exposes some global state (context) to the entire tree. Descendants can then
 * access this context with `useContext`.
 */
export const ForceAuthenticatorContextProvider = ({
  renderInline,
  translate,
  onModalChallengeAbandoned,
  children,
}: Props): ReactElement => {
  // We declare these variables as lazy-initialized state variables since they
  // do not need to be re-computed if this component re-renders.
  const [resources] = useState(() => getResources(translate));
  const [initialState] = useState<ForceAuthenticatorState>(() => ({
    // Immutable parameters:
    renderInline,

    // Immutable state:
    resources,
    onModalChallengeAbandoned,

    // Mutable state:
    isModalVisible: true,
  }));

  // Components will access and mutate state via these variables:
  const [state, dispatch] = useReducer(
    forceAuthenticatorStateReducer,
    initialState
  );

  return (
    <ForceAuthenticatorContext.Provider value={{ state, dispatch }}>
      {children}
    </ForceAuthenticatorContext.Provider>
  );
};
