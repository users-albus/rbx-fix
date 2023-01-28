import { fireEvent } from "roblox-event-tracker";
import { ProtocolHandlerClientInterface } from "Roblox";
import {
  DeepLinkNavigationMap,
  DeepLink,
  PathPart,
  UrlPart,
  buildResolveLinkEvent,
  buildDeepLinkLaunchGameEvent,
  CounterEvents,
} from "./deepLinkConstants";
import playGameService from "../playGames/playGameService";
import chatService from "../chatService/chatService";
import eventStreamService from "../eventStreamService/eventStreamService";
import getPlaceIdFromUniverseId from "./getPlaceIdFromUniverseId";
import resolveShareLinks from "./resolveShareLinks";
import { ExperienceInviteData, ShareLinksType } from "./shareLinksTypes";
import ExperienceInviteStatus from "./enums/ExperienceInviteStatus";
import FriendInviteStatus from "./enums/FriendInviteStatus";
import ProfileShareStatus from "./enums/ProfileShareStatus";

const deepLinkNavigate = (target: DeepLink): Promise<boolean> => {
  const { path, params } = target;
  let urlTarget: string;

  const navigateSubPath = path[1];
  if (DeepLinkNavigationMap[navigateSubPath]) {
    urlTarget = DeepLinkNavigationMap[navigateSubPath];
    // For simple mapping of deepLink parameters to url parameters
    // Currently only used for catalog items
    // More complex deepLink handling defined below
    const paramKeys = Object.keys(params);
    for (let i = 0; i < paramKeys.length; i++) {
      const key = paramKeys[i];
      urlTarget = urlTarget.replace(`{${key}}`, params[key]);
    }
  } else if (navigateSubPath === PathPart.GameDetails && params.gameId) {
    // roblox://navigation/game_details?gameId=<universeId>
    // navigate to game page. Deeplink provides a universe id, but we need a
    // placeId for the url - so we call the game info endpoint first
    return getPlaceIdFromUniverseId(params.gameId)
      .then((rootPlaceId: number) => {
        if (rootPlaceId) {
          window.location.href = `${UrlPart.Games}/${rootPlaceId}`;
          return true;
        }
        return false;
      })
      .catch(() => false);
  } else if (navigateSubPath === PathPart.Profile) {
    if (params.userId) {
      // roblox://navigation/profile?userId=<userId>
      // Navigate to user profile
      urlTarget = `${UrlPart.Users}/${params.userId}${UrlPart.Profile}`;
    } else if (params.groupId) {
      // roblox://navigation/profile?groupId=<groupId>
      // Navigate to group profile
      urlTarget = `${UrlPart.Groups}/${params.groupId}`;
    }
  } else if (navigateSubPath === PathPart.ShareLinks) {
    // roblox://navigation/share_links?code=<linkId>&type=<linkType>
    switch (params.type) {
      case ShareLinksType.EXPERIENCE_INVITE: {
        if (params.code) {
          return resolveShareLinks(
            params.code,
            ShareLinksType.EXPERIENCE_INVITE
          )
            .then((response) => {
              const data = response?.data?.experienceInviteData;
              if (!data || !data.placeId) {
                return false;
              }

              const resolveLinkEvent = buildResolveLinkEvent(
                data.status,
                params.code,
                ShareLinksType.EXPERIENCE_INVITE
              );
              eventStreamService.sendEventWithTarget(
                resolveLinkEvent.type,
                resolveLinkEvent.context,
                resolveLinkEvent.params
              );
              if (
                data.status === ExperienceInviteStatus.VALID &&
                data.instanceId
              ) {
                window.location.href = `${UrlPart.Games}/${data.placeId}`;
                playGameService.launchGame(
                  playGameService.buildPlayGameProperties(
                    data.placeId,
                    data.placeId,
                    data.instanceId
                  ),
                  buildDeepLinkLaunchGameEvent(
                    data.placeId.toString(),
                    params.code,
                    data.status
                  )
                );
                return true;
              }
              if (
                data.status === ExperienceInviteStatus.EXPIRED ||
                data.status === ExperienceInviteStatus.INVITER_NOT_IN_EXPERIENCE
              ) {
                window.location.href = `${UrlPart.Games}/${data.placeId}?experienceInviteLinkId=${params.code}&experienceInviteStatus=${data.status}`;
                return true;
              }
              return false;
            })
            .catch(() => {
              fireEvent(CounterEvents.InviteResolutionFailed);
              return false;
            });
        }
        break;
      }
      case ShareLinksType.NOTIFICATION_EXPERIENCE_INVITE: {
        if (params.code) {
          return resolveShareLinks(
            params.code,
            ShareLinksType.NOTIFICATION_EXPERIENCE_INVITE
          )
            .then((response) => {
              const data: ExperienceInviteData | null =
                response?.data?.notificationExperienceInviteData;
              if (data?.placeId) {
                const includeInstanceId =
                  data.instanceId &&
                  data.status === ExperienceInviteStatus.VALID;
                const launchLink = `${UrlPart.ExperienceLauncher}placeId=${
                  data.placeId
                }${
                  data.launchData
                    ? `&launchData=${encodeURIComponent(data.launchData)}`
                    : ""
                }${
                  includeInstanceId ? `&gameInstanceId=${data.instanceId}` : ""
                }`;
                ProtocolHandlerClientInterface.startGameWithDeepLinkUrl(
                  launchLink,
                  data.placeId
                );
                return true;
              }
              return false;
            })
            .catch(() => {
              fireEvent(CounterEvents.NotificationInviteResolutionFailed);
              return false;
            });
        }
        break;
      }
      case ShareLinksType.FRIEND_INVITE: {
        if (params.code) {
          return resolveShareLinks(params.code, ShareLinksType.FRIEND_INVITE)
            .then((response) => {
              const data = response?.data?.friendInviteData;
              if (!data || !data.senderUserId) {
                return false;
              }
              const resolveLinkEvent = buildResolveLinkEvent(
                data.status,
                params.code,
                ShareLinksType.FRIEND_INVITE
              );
              eventStreamService.sendEventWithTarget(
                resolveLinkEvent.type,
                resolveLinkEvent.context,
                resolveLinkEvent.params
              );
              if (
                data.status === FriendInviteStatus.VALID ||
                data.status === FriendInviteStatus.CONSUMED ||
                data.status === FriendInviteStatus.EXPIRED
              ) {
                window.location.href = `${UrlPart.Users}/${data.senderUserId}${UrlPart.Profile}`;
                return true;
              }
              return false;
            })
            .catch(() => {
              fireEvent(CounterEvents.FriendRequestResolutionFailed);
              return false;
            });
        }
        break;
      }
      case ShareLinksType.PROFILE: {
        if (params.code) {
          return resolveShareLinks(params.code, ShareLinksType.PROFILE)
            .then((response) => {
              const data = response?.data?.profileLinkResolutionResponseData;
              if (!data || !data.userId) {
                return false;
              }
              const resolveLinkEvent = buildResolveLinkEvent(
                data.status,
                params.code,
                ShareLinksType.PROFILE
              );
              eventStreamService.sendEventWithTarget(
                resolveLinkEvent.type,
                resolveLinkEvent.context,
                resolveLinkEvent.params
              );
              if (data.status === ProfileShareStatus.VALID) {
                window.location.href = `${UrlPart.Users}/${data.userId}${UrlPart.Profile}?friendshipSourceType=QrCode`;
                return true;
              }
              return false;
            })
            .catch(() => {
              fireEvent(CounterEvents.ProfileShareResolutionFailed);
              return false;
            });
        }
        break;
      }
      default: {
        break;
      }
    }
  } else if (navigateSubPath === PathPart.Chat && params.userId) {
    chatService.startDesktopAndMobileWebChat(params);
    return Promise.resolve(true);
  }

  if (urlTarget) {
    window.location.href = urlTarget;
  } else {
    fireEvent(CounterEvents.NavigationFailed);
  }
  return Promise.resolve(!!urlTarget);
};

export default deepLinkNavigate;
