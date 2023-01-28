import { useEffect, useState } from "react";
import playButtonService from "../services/playButtonService";
import { PlayabilityStatus } from "../constants/playButtonConstants";
import { TPlayabilityStatus } from "../types/playButtonTypes";

export const usePlayabilityStatus = (
  universeId: string
): [TPlayabilityStatus | undefined, () => Promise<void>] => {
  const [playabilityStatus, setPlayabilityStatus] = useState<
    TPlayabilityStatus | undefined
  >(undefined);

  const fetchPlayabilityStatus = async () => {
    setPlayabilityStatus(undefined);
    try {
      const response = await playButtonService.getPlayabilityStatus([
        universeId,
      ]);
      setPlayabilityStatus(response.playabilityStatus);
    } catch (e) {
      setPlayabilityStatus(PlayabilityStatus.TemporarilyUnavailable);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line no-void
    void fetchPlayabilityStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [playabilityStatus, fetchPlayabilityStatus];
};

export default usePlayabilityStatus;
