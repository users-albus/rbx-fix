import { useContext } from "react";
import { ReauthenticationContext } from "../store/contextProvider";

/**
 * A wrapper around `useContext` for the prompt state, which throws if the
 * context has not actually been provided in the current component scope.
 *
 * We could also check for `null` values wherever the context is used (and
 * return an empty component if necessary), but that would be a lot of cruft
 * for what should be a fatal error anyway.
 */
const useReauthenticationContext: () => ReauthenticationContext = () => {
  const context = useContext(ReauthenticationContext);
  if (context === null) {
    throw new Error(
      "ReauthenticationContext was not provided in the current scope"
    );
  }

  return context;
};

export default useReauthenticationContext;
