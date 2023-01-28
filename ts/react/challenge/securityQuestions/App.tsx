import React from "react";
import { withTranslations, WithTranslationsProps } from "react-utilities";
import { RequestService } from "../../../common/request";
import { TRANSLATION_CONFIG } from "./app.config";
import SecurityQuestions from "./containers/securityQuestions";
import {
  OnChallengeCompletedCallback,
  OnChallengeInvalidatedCallback,
  OnModalChallengeAbandonedCallback,
} from "./interface";
import { EventService } from "./services/eventService";
import { SecurityQuestionsContextProvider } from "./store/contextProvider";

type Props = {
  userId: string;
  sessionId: string;
  renderInline: boolean;
  eventService: EventService;
  requestService: RequestService;
  onChallengeCompleted: OnChallengeCompletedCallback;
  onChallengeInvalidated: OnChallengeInvalidatedCallback;
  onModalChallengeAbandoned: OnModalChallengeAbandonedCallback | null;
} & WithTranslationsProps;

export const App: React.FC<Props> = ({
  userId,
  sessionId,
  renderInline,
  eventService,
  requestService,
  translate,
  onChallengeCompleted,
  onChallengeInvalidated,
  onModalChallengeAbandoned,
}: Props) => {
  return (
    <SecurityQuestionsContextProvider
      userId={userId}
      sessionId={sessionId}
      renderInline={renderInline}
      eventService={eventService}
      requestService={requestService}
      translate={translate}
      onChallengeCompleted={onChallengeCompleted}
      onChallengeInvalidated={onChallengeInvalidated}
      onModalChallengeAbandoned={onModalChallengeAbandoned}
    >
      <SecurityQuestions />
    </SecurityQuestionsContextProvider>
  );
};

export default withTranslations(App, TRANSLATION_CONFIG);
