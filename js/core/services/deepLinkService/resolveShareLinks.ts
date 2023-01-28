import { EnvironmentUrls } from "Roblox";
import { httpService } from "../../http/http";
import {
  ExperienceInviteData,
  FriendInviteData,
  ProfileData,
  ShareLinksType,
} from "./shareLinksTypes";

const ResolveShareLinksUrlConfig = {
  url: `${EnvironmentUrls.shareLinksApi}/v1/resolve-link`,
  withCredentials: true,
};

export type ResolveShareLinksResponse = {
  data?: {
    experienceInviteData?: ExperienceInviteData;
    friendInviteData?: FriendInviteData;
    notificationExperienceInviteData?: ExperienceInviteData;
    profileLinkResolutionResponseData?: ProfileData;
  };
};

const resolveShareLinks = (
  linkId: string,
  linkType: ShareLinksType
): Promise<ResolveShareLinksResponse> => {
  return httpService
    .post(ResolveShareLinksUrlConfig, {
      linkId,
      linkType,
    })
    .then((response: ResolveShareLinksResponse) => {
      return response;
    });
};

export default resolveShareLinks;
