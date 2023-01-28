export interface DeepLinkParams {
  [param: string]: string;
}

export enum PathPart {
  GameDetails = "game_details",
  Profile = "profile",
  Home = "home",
  Games = "games",
  Avatar = "avatar",
  Catalog = "catalog",
  Friends = "friends",
  ItemDetails = "item_details",
  Navigation = "navigation",
  PlaceId = "placeId",
  UserId = "userId",
  ShareLinks = "share_links",
  Chat = "chat",
}

export type DeepLink = {
  path: Array<PathPart>;
  params: DeepLinkParams;
};

export const DeepLinkNavigationMap: { [path: string]: string } = {
  [PathPart.Home]: "/home",
  [PathPart.Games]: "/games",
  [PathPart.Avatar]: "/my/avatar",
  [PathPart.Catalog]: "/catalog",
  [PathPart.Friends]: "/users/friends",
  [PathPart.ItemDetails]: "/catalog/{itemId}",
};

export const UrlPart = {
  Games: "/games",
  Users: "/users",
  Groups: "/groups",
  Profile: "/profile",
  GameStart: "/games/start",
  ExperienceLauncher: "roblox://experiences/start?",
};

export const buildResolveLinkEvent = (
  linkStatus: string,
  linkId: string,
  linkType: string
): {
  type: string;
  context: string;
  params: { linkType: string; linkStatus: string; linkId: string };
} => {
  return {
    type: "linkResolved",
    context: "deepLink",
    params: {
      linkType,
      linkStatus,
      linkId,
    },
  };
};

export const CounterEvents = {
  NavigationFailed: "DeeplinkParserNavigationFailed",
  InviteResolutionFailed: "DeeplinkParserInviteResolutionFailed",
  NotificationInviteResolutionFailed:
    "DeeplinkParserNotificationInviteResolutionFailed",
  FriendRequestResolutionFailed: "DeeplinkParserFriendRequestResolutionFailed",
  ProfileShareResolutionFailed: "DeeplinkParserProfileShareResolutionFailed",
};

export const buildDeepLinkLaunchGameEvent = (
  placeId: string,
  linkId: string,
  linkStatus: string
): {
  eventName: string;
  ctx: string;
  gamePlayIntentEventCtx: string;
  properties: {
    linkStatus: string;
    linkType: string;
    placeId: string;
    linkId: string;
  };
} => {
  return {
    eventName: "joinGameFromInviteLink",
    ctx: "shareLinks",
    gamePlayIntentEventCtx: "shareLinks",
    properties: {
      linkStatus,
      linkType: "ExperienceInvite",
      placeId,
      linkId,
    },
  };
};
