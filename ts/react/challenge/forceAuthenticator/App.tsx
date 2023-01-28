import React from "react";
import { withTranslations, WithTranslationsProps } from "react-utilities";
import { TRANSLATION_CONFIG } from "./app.config";
import ForceAuthenticator from "./containers/forceAuthenticator";
import { OnModalChallengeAbandonedCallback } from "./interface";
import { ForceAuthenticatorContextProvider } from "./store/contextProvider";

type Props = {
  renderInline: boolean;
  onModalChallengeAbandoned: OnModalChallengeAbandonedCallback | null;
} & WithTranslationsProps;

export const App: React.FC<Props> = ({
  renderInline,
  translate,
  onModalChallengeAbandoned,
}: Props) => {
  return (
    <ForceAuthenticatorContextProvider
      renderInline={renderInline}
      translate={translate}
      onModalChallengeAbandoned={onModalChallengeAbandoned}
    >
      <ForceAuthenticator />
    </ForceAuthenticatorContextProvider>
  );
};

export default withTranslations(App, TRANSLATION_CONFIG);
