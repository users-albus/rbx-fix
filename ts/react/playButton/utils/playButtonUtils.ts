import {
  EnvironmentUrls,
  IdentityVerificationService,
  GameLauncher,
} from "Roblox";
import {
  deviceMeta as DeviceMeta,
  jsClientDeviceIdentifier,
} from "header-scripts";
import { uuidService } from "core-utilities";
import { playGameService } from "core-roblox-utilities";
import playButtonConstants from "../constants/playButtonConstants";

type TEventProperties = Record<string, string | number | undefined>;

function getEncodedUniversalLink(
  placeId: string,
  eventProperties: TEventProperties = {}
): string {
  let universalLink = `${EnvironmentUrls.websiteUrl}/games/start?placeid=${placeId}`;

  if (GameLauncher.isJoinAttemptIdEnabled()) {
    const { joinAttemptOrigin } = eventProperties;
    let { joinAttemptId } = eventProperties;
    joinAttemptId =
      typeof joinAttemptId === "string"
        ? joinAttemptId
        : uuidService.generateRandomUuid();

    if (joinAttemptId?.length > 0) {
      universalLink += `&joinAttemptId=${joinAttemptId}`;

      if (
        typeof joinAttemptOrigin === "string" &&
        joinAttemptOrigin.length > 0
      ) {
        universalLink += `&joinAttemptOrigin=${joinAttemptOrigin}`;
      }
    }
  }

  return encodeURIComponent(universalLink);
}

export const launchGame = (
  placeId: string,
  rootPlaceId?: string,
  privateServerLinkCode?: string,
  gameInstanceId?: string,
  eventProperties: TEventProperties = {}
): void => {
  const deviceMeta = DeviceMeta.getDeviceMeta();
  if (
    deviceMeta?.isIosDevice ||
    deviceMeta?.isAndroidDevice ||
    jsClientDeviceIdentifier.isIos13Ipad
  ) {
    const encodedUniversalLink = getEncodedUniversalLink(
      placeId,
      eventProperties
    );
    window.open(
      `https://ro.blox.com/Ebh5?pid=share&is_retargeting=true&af_dp=${encodedUniversalLink}&af_web_dp=${encodedUniversalLink}`,
      "_self"
    );
  } else {
    playGameService.launchGame(
      playGameService.buildPlayGameProperties(
        rootPlaceId,
        placeId,
        gameInstanceId,
        /* playerId= */ undefined,
        privateServerLinkCode
      ),
      playButtonConstants.eventStreamProperties(placeId, eventProperties)
    );
  }
};

export const launchLogin = (placeId: string): void => {
  const deviceMeta = DeviceMeta.getDeviceMeta();
  if (
    deviceMeta?.isIosDevice ||
    deviceMeta?.isAndroidDevice ||
    jsClientDeviceIdentifier.isIos13Ipad
  ) {
    const encodedUniversalLink = getEncodedUniversalLink(placeId);
    window.open(
      `https://ro.blox.com/Ebh5?pid=share&is_retargeting=true&af_dp=${encodedUniversalLink}&af_web_dp=${encodedUniversalLink}`,
      "_self"
    );
  } else {
    playGameService.launchGame(
      playGameService.buildPlayGameProperties(undefined, placeId.toString()),
      playButtonConstants.eventStreamProperties(placeId, {})
    );
  }
};

export const startVerificationFlow = async (): Promise<[boolean, boolean]> => {
  try {
    return IdentityVerificationService.startVerificationFlow();
  } catch (e) {
    return [false, false];
  }
};

export const startVoiceOptInOverlayFlow = async (
  requireExplicitVoiceConsent: boolean,
  useExitBetaLanguage: boolean
): Promise<boolean> => {
  try {
    return IdentityVerificationService.showVoiceOptInOverlay(
      requireExplicitVoiceConsent,
      useExitBetaLanguage
    );
  } catch (e) {
    return false;
  }
};

export default {
  launchGame,
  launchLogin,
  startVerificationFlow,
  startVoiceOptInOverlayFlow,
};
