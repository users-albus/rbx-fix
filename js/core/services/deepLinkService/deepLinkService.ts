import Roblox, { DeviceMeta, Hybrid } from "Roblox";
import { DeepLink, DeepLinkParams, PathPart } from "./deepLinkConstants";
import deepLinkNavigate from "./deepLinkNavigate";
import deepLinkGameJoin from "./deepLinkGameJoin";
import deepLinkFollowUserToExperience from "./deepLinkFollowUserToExperience";
import ExperienceInviteStatus from "./enums/ExperienceInviteStatus";
import FriendInviteStatus from "./enums/FriendInviteStatus";
import ProfileShareStatus from "./enums/ProfileShareStatus";

const firstUriSegmentToHandler: {
  [type: string]: (target: DeepLink) => Promise<boolean>;
} = {
  [PathPart.Navigation]: deepLinkNavigate,
  [PathPart.PlaceId]: deepLinkGameJoin,
  [PathPart.UserId]: deepLinkFollowUserToExperience,
};

const pathRegex = /\/(\w+)/g; // matches: /(pathSegment)
const paramRegex = /(\w+)=(\w+)/g; // matches: (param)=(value)

const HYBRID_TARGET_KEY = "feature";
const HYBRID_TARGET_VALUE = "DeepLink";
const HYBRID_TARGET_PARAM_KEY = "deepLinkUrlPath";

const parseDeepLink = (deepLinkString: string): DeepLink => {
  const path: Array<PathPart> = [];
  const params: DeepLinkParams = {};

  let pathPart = pathRegex.exec(deepLinkString);
  while (pathPart) {
    path.push(pathPart[1] as PathPart);
    pathPart = pathRegex.exec(deepLinkString);
  }

  let paramPart = paramRegex.exec(deepLinkString);
  while (paramPart) {
    const key = paramPart[1];
    const value = paramPart[2];
    params[key] = value;
    paramPart = paramRegex.exec(deepLinkString);
  }

  return {
    path,
    params,
  };
};

const DeepLinkService = {
  parseDeeplink: parseDeepLink,
  navigateToDeepLink: (deepLinkUrl: string): Promise<boolean> => {
    if (DeviceMeta && DeviceMeta().isIosApp && Hybrid) {
      Hybrid.Navigation?.navigateToFeature(
        {
          [HYBRID_TARGET_KEY]: HYBRID_TARGET_VALUE,
          [HYBRID_TARGET_PARAM_KEY]: deepLinkUrl,
        },
        () => true
      );
      return Promise.resolve(true);
    }
    if (DeviceMeta && DeviceMeta().isInApp) {
      // use lua deeplinks map to resolve url if in universal app
      // https://github.com/Roblox/lua-apps/blob/master/src/internal/LuaApp/Modules/LuaApp/DeepLinks/DeepLinkMap.lua
      window.location.href = deepLinkUrl;
      return Promise.resolve(true);
    }
    const target: DeepLink = parseDeepLink(deepLinkUrl);
    const handler = firstUriSegmentToHandler[target.path[0]];
    return handler ? handler(target) : Promise.resolve(false);
  },
};

const ShareLinks = {
  ExperienceInviteStatus,
  FriendInviteStatus,
  ProfileShareStatus,
};

Object.assign(Roblox, {
  DeepLinkService,
  // eslint-disable-next-line no-else-return
  ShareLinks,
});

export default DeepLinkService;
