import {
  useDebounce,
  useInterval,
  useLocalStorage,
  useOnClickOutside,
  usePrevious,
  useWindowActiveState,
} from "@rbx/react-utilities";
import makeActionCreator from "./redux/makeActionCreator";
import withComponentStatus from "./componentStatus/withComponentStatus";
import withTranslations from "./intl/withTranslations";

// roblox core react utilities
window.ReactUtilities = {
  makeActionCreator,
  withComponentStatus,
  withTranslations,
  useDebounce,
  useInterval,
  useLocalStorage,
  useOnClickOutside,
  usePrevious,
  useWindowActiveState,
};
