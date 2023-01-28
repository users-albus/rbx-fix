import { landingPageContainer } from "../../common/constants/browserConstants";

// will add more to this file when doing landing page ui
// eslint-disable-next-line import/prefer-default-export
export const getIsReactUIEnabled = (): boolean => {
  const entryPoint = landingPageContainer();
  const isReactUIEnabled =
    entryPoint?.getAttribute("data-enable-react-ui") === "true";
  return isReactUIEnabled;
};
