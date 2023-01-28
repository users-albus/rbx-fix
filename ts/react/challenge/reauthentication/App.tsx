import React from "react";
import { withTranslations, WithTranslationsProps } from "react-utilities";
import { RequestService } from "../../../common/request";
import { TRANSLATION_CONFIG } from "./app.config";
import Reauthentication from "./containers/reauthentication";
import {
  OnChallengeCompletedCallback,
  OnChallengeInvalidatedCallback,
  OnModalChallengeAbandonedCallback,
} from "./interface";
import { ReauthenticationContextProvider } from "./store/contextProvider";

type Props = {
  renderInline: boolean;
  requestService: RequestService;
  onChallengeCompleted: OnChallengeCompletedCallback;
  onChallengeInvalidated: OnChallengeInvalidatedCallback;
  onModalChallengeAbandoned: OnModalChallengeAbandonedCallback | null;
} & WithTranslationsProps;

export const App: React.FC<Props> = ({
  renderInline,
  requestService,
  translate,
  onChallengeCompleted,
  onChallengeInvalidated,
  onModalChallengeAbandoned,
}: Props) => {
  return (
    <ReauthenticationContextProvider
      renderInline={renderInline}
      requestService={requestService}
      translate={translate}
      onChallengeCompleted={onChallengeCompleted}
      onChallengeInvalidated={onChallengeInvalidated}
      onModalChallengeAbandoned={onModalChallengeAbandoned}
    >
      <Reauthentication />
    </ReauthenticationContextProvider>
  );
};

export default withTranslations(App, TRANSLATION_CONFIG);
