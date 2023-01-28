import React from "react";
import { withTranslations, WithTranslationsProps } from "react-utilities";
import { RequestService } from "../../../common/request";
import { TRANSLATION_CONFIG } from "./app.config";
import ProofOfWork from "./containers/proofOfWork";
import {
  OnChallengeCompletedCallback,
  OnChallengeInvalidatedCallback,
  OnModalChallengeAbandonedCallback,
} from "./interface";
import { EventService } from "./services/eventService";
import { MetricsService } from "./services/metricsService";
import { ProofOfWorkContextProvider } from "./store/contextProvider";

type Props = {
  sessionId: string;
  renderInline: boolean;
  eventService: EventService;
  metricsService: MetricsService;
  requestService: RequestService;
  onChallengeCompleted: OnChallengeCompletedCallback;
  onChallengeInvalidated: OnChallengeInvalidatedCallback;
  onModalChallengeAbandoned: OnModalChallengeAbandonedCallback | null;
} & WithTranslationsProps;

const App: React.FC<Props> = ({
  sessionId,
  renderInline,
  eventService,
  metricsService,
  requestService,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  translate,
  onChallengeCompleted,
  onChallengeInvalidated,
  onModalChallengeAbandoned,
}: Props) => {
  return (
    <ProofOfWorkContextProvider
      sessionId={sessionId}
      renderInline={renderInline}
      eventService={eventService}
      metricsService={metricsService}
      requestService={requestService}
      translate={translate}
      onChallengeCompleted={onChallengeCompleted}
      onChallengeInvalidated={onChallengeInvalidated}
      onModalChallengeAbandoned={onModalChallengeAbandoned}
    >
      <ProofOfWork />
    </ProofOfWorkContextProvider>
  );
};

export default withTranslations(App, TRANSLATION_CONFIG);
