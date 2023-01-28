import {
  ForceAuthenticatorAction,
  ForceAuthenticatorActionType,
} from "./action";
import { ForceAuthenticatorState } from "./state";

// NOTE: Do not put side-effects with respect to the app state inside this
// reducer. Those should go in `contextProvider.tsx` as `useEffect` blocks.
const forceAuthenticatorStateReducer = (
  oldState: ForceAuthenticatorState,
  action: ForceAuthenticatorAction
): ForceAuthenticatorState => {
  const newState = { ...oldState };
  switch (action.type) {
    case ForceAuthenticatorActionType.HIDE_MODAL_CHALLENGE:
      newState.isModalVisible = false;
      return newState;

    case ForceAuthenticatorActionType.SHOW_MODAL_CHALLENGE:
      newState.isModalVisible = true;
      return newState;

    default:
      return oldState;
  }
};

export default forceAuthenticatorStateReducer;
