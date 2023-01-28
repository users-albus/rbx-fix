import {
  TPlayabilityStatus,
  TPlayabilityStatuses,
} from "../types/playButtonTypes";

export const PlayabilityStatus = {
  UnplayableOtherReason: "UnplayableOtherReason",
  Playable: "Playable",
  GuestProhibited: "GuestProhibited",
  GameUnapproved: "GameUnapproved",
  IncorrectConfiguration: "IncorrectConfiguration",
  UniverseRootPlaceIsPrivate: "UniverseRootPlaceIsPrivate",
  InsufficientPermissionFriendsOnly: "InsufficientPermissionFriendsOnly",
  InsufficientPermissionGroupOnly: "InsufficientPermissionGroupOnly",
  DeviceRestricted: "DeviceRestricted",
  UnderReview: "UnderReview",
  PurchaseRequired: "PurchaseRequired",
  AccountRestricted: "AccountRestricted",
  TemporarilyUnavailable: "TemporarilyUnavailable",
  ComplianceBlocked: "ComplianceBlocked",
  ContextualPlayabilityRegionalAvailability:
    "ContextualPlayabilityRegionalAvailability",
  ContextualPlayabilityRegionalCompliance:
    "ContextualPlayabilityRegionalCompliance",
  ContextualPlayabilityAgeRecommendationParentalControls:
    "ContextualPlayabilityAgeRecommendationParentalControls",
  ContextualPlayabilityAgeGated: "ContextualPlayabilityAgeGated",
  PlaceHasNoPublishedVersion: "PlaceHasNoPublishedVersion",
} as const;

// NOTE: This does not override the true event name since it is set in:
// Roblox.CoreScripts.WebApp/Roblox.CoreScripts.WebApp/js/core/services/playGames/playGameService.js
// Roblox.GameLaunch.WebApp/Roblox.GameLaunch.WebApp/js/gamePlayEvents.js
const eventStreamProperties = (
  placeId: string,
  eventProperties: Record<string, string | number | undefined>
): {
  eventName: string;
  ctx: string;
  properties: Record<string, any> & { placeId: string };
  gamePlayIntentEventCtx: string;
} => ({
  eventName: "playGameClicked",
  ctx: "click",
  properties: {
    ...eventProperties,
    placeId,
  },
  gamePlayIntentEventCtx: "PlayButton",
});

const playButtonTranslationMap: Record<
  Exclude<
    TPlayabilityStatus,
    | TPlayabilityStatuses["Playable"]
    | TPlayabilityStatuses["GuestProhibited"]
    | TPlayabilityStatuses["PurchaseRequired"]
  >,
  string
> = {
  [PlayabilityStatus.UnplayableOtherReason]:
    "Response.GameTemporarilyUnavailable",
  [PlayabilityStatus.TemporarilyUnavailable]:
    "Response.GameTemporarilyUnavailable",
  [PlayabilityStatus.GameUnapproved]: "Label.GameUnavailablePlaceUnderReview",
  [PlayabilityStatus.IncorrectConfiguration]:
    "Response.GameTemporarilyUnavailable",
  [PlayabilityStatus.UniverseRootPlaceIsPrivate]:
    "Label.GameUnavailableCurrentlyIsPrivateVisitor",
  [PlayabilityStatus.InsufficientPermissionFriendsOnly]:
    "Label.GameUnavailablePermissionLevels",
  [PlayabilityStatus.InsufficientPermissionGroupOnly]:
    "Label.GameUnavailablePermissionLevels",
  [PlayabilityStatus.DeviceRestricted]: "Response.GameTemporarilyUnavailable",
  [PlayabilityStatus.UnderReview]: "Label.GameUnavailablePlaceUnderReview",
  [PlayabilityStatus.AccountRestricted]:
    "Label.GameUnavailableAccountResrictions",
  [PlayabilityStatus.ComplianceBlocked]: "Label.ComplianceBlocked",
  [PlayabilityStatus.ContextualPlayabilityRegionalAvailability]:
    "Label.ContextualPlayabilityRegionalAvailability",
  [PlayabilityStatus.ContextualPlayabilityRegionalCompliance]:
    "Label.ContextualPlayabilityRegionalCompliance",
  [PlayabilityStatus.ContextualPlayabilityAgeRecommendationParentalControls]:
    "Label.ContextualPlayabilityAgeRecommendationParentalControls",
  [PlayabilityStatus.ContextualPlayabilityAgeGated]:
    "Label.ContextualPlayabilityAgeGated",
  [PlayabilityStatus.PlaceHasNoPublishedVersion]:
    "Label.GameUnavailableRootPlaceIsUnpublished",
};

export default {
  playButtonTranslationMap,
  eventStreamProperties,
  PlayabilityStatus,
};
