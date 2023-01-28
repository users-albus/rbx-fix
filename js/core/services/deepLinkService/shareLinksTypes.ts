import ExperienceInviteStatus from "./enums/ExperienceInviteStatus";
import FriendInviteStatus from "./enums/FriendInviteStatus";
import ProfileShareStatus from "./enums/ProfileShareStatus";

enum ShareLinksType {
  EXPERIENCE_INVITE = "ExperienceInvite",
  FRIEND_INVITE = "FriendInvite",
  NOTIFICATION_EXPERIENCE_INVITE = "NotificationExperienceInvite",
  PROFILE = "Profile",
}

type ExperienceInviteData = {
  status: ExperienceInviteStatus;
  inviterId: number;
  placeId: number;
  instanceId: string;
  launchData?: string;
};

type FriendInviteData = {
  status: FriendInviteStatus;
  senderUserId: number;
  friendingToken: string;
};

type ProfileData = {
  status: ProfileShareStatus;
  userId: number;
};

export { ExperienceInviteData, FriendInviteData, ProfileData, ShareLinksType };
