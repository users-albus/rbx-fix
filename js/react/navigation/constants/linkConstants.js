import { Endpoints, EnvironmentUrls } from "Roblox";
import { authenticatedUser } from "header-scripts";

const { getAbsoluteUrl } = Endpoints;
const { authApi } = EnvironmentUrls;

const gameSearchLink = {
  url: getAbsoluteUrl("/discover/?Keyword="),
  label: "Label.Experience",
  pageSort: ["home", "games", "discover"],
  icon: "icon-menu-games-off",
};
const avatarSearchLink = {
  url: getAbsoluteUrl("/catalog?CatalogContext=1&Keyword="),
  label: "Label.AvatarShop",
  pageSort: ["catalog", "inventory", "bundles", "my/avatar", "trades"],
  icon: "icon-menu-shop",
};

const miscSearchLink = [
  {
    url: getAbsoluteUrl("/search/users?keyword="),
    label: "Label.Players",
    pageSort: ["users"],
    icon: "icon-menu-profile",
  },
  avatarSearchLink,
  {
    url: getAbsoluteUrl("/search/groups?keyword="),
    label: "Label.sGroups",
    pageSort: ["groups"],
    icon: "icon-menu-groups",
  },
  {
    url: getAbsoluteUrl(
      "/develop/library?CatalogContext=2&Category=6&Keyword="
    ),
    label: "Label.CreatorMarketplace",
    pageSort: ["develop"],
    icon: "icon-menu-library",
  },
];

export default {
  creatorMarketplaceUrl: `https://create.${EnvironmentUrls.domain}/marketplace/models?keyword=`,
  scrollListItems: {
    home: {
      url: getAbsoluteUrl("/"),
      idSelector: "nav-home",
      iconClass: "icon-nav-home",
      name: "home",
      labelTranslationKey: "Label.sHome",
    },
    profile: {
      url: getAbsoluteUrl(`/users/${authenticatedUser.id}/profile`),
      idSelector: "nav-profile",
      iconClass: "icon-nav-profile",
      name: "profile",
      labelTranslationKey: "Label.sProfile",
    },
    messages: {
      url: getAbsoluteUrl("/my/messages/#!/inbox"),
      urlForNotification: getAbsoluteUrl("/my/messages/#!/inbox"),
      idSelector: "nav-message",
      iconClass: "icon-nav-message",
      name: "messages",
      labelTranslationKey: "Label.sMessages",
    },
    friends: {
      url: getAbsoluteUrl("/users/friends"),
      urlForNotification: getAbsoluteUrl("/users/friends#!/friend-requests"),
      idSelector: "nav-friends",
      iconClass: "icon-nav-friends",
      name: "friends",
      labelTranslationKey: "Label.sFriends",
    },
    avatar: {
      url: getAbsoluteUrl("/my/avatar"),
      idSelector: "nav-character",
      iconClass: "icon-nav-charactercustomizer",
      name: "avatar",
      labelTranslationKey: "Label.sAvatar",
    },
    inventory: {
      url: getAbsoluteUrl(`/users/${authenticatedUser.id}/inventory`),
      idSelector: "nav-inventory",
      iconClass: "icon-nav-inventory",
      name: "inventory",
      labelTranslationKey: "Label.sInventory",
    },
    trade: {
      url: getAbsoluteUrl("/trades"),
      urlForNotification: getAbsoluteUrl("/trades"),
      idSelector: "nav-trade",
      iconClass: "icon-nav-trade",
      name: "trade",
      labelTranslationKey: "Label.sTrade",
    },
    groups: {
      url: getAbsoluteUrl("/my/groups"),
      idSelector: "nav-group",
      iconClass: "icon-nav-group",
      name: "groups",
      labelTranslationKey: "Label.sGroups",
    },
    blog: {
      url: getAbsoluteUrl("https://blog.roblox.com"),
      idSelector: "nav-blog",
      iconClass: "icon-nav-blog",
      name: "blog",
      labelTranslationKey: "Label.sBlog",
    },
    shop: {
      isModal: true,
      idSelector: "nav-shop",
      iconClass: "icon-nav-shop",
      name: "shop",
      labelTranslationKey: "Label.OfficialStore",
    },
    giftcards: {
      url: getAbsoluteUrl("/giftcards-us"),
      idSelector: "nav-giftcards",
      iconClass: "icon-nav-giftcards",
      name: "giftcards",
      labelTranslationKey: "Label.GiftCards",
    },
  },
  upgradeButton: {
    url: getAbsoluteUrl("/premium/membership?ctx=leftnav"),
    labelTranslationKey: authenticatedUser.isPremiumUser
      ? "ActionsPremium"
      : "ActionsGetPremium",
  },
  sponsorEvents: {
    label: {
      labelTranslationKey: "Label.sEvents",
    },
    events: {
      // TODO: dynamical generate from ads.roblox.com/v1/sponsored-page
    },
  },
  gameSearchLink,
  avatarSearchLink,
  miscSearchLink,
  universalSearchUrls: [
    {
      url: getAbsoluteUrl("/search/users?keyword="),
      label: "Label.Players",
      pageSort: [],
    },
    {
      url: getAbsoluteUrl("/discover/?Keyword="),
      label: "Label.Experience",
      pageSort: ["home", "games", "discover"],
    },
    {
      url: getAbsoluteUrl("/catalog/browse.aspx?CatalogContext=1&Keyword="),
      label: "Label.sCatalog",
      pageSort: ["catalog", "inventory", "bundles"],
    },
    {
      url: getAbsoluteUrl("/search/groups?keyword="),
      label: "Label.sGroups",
      pageSort: ["groups"],
    },
    {
      url: getAbsoluteUrl(
        "/develop/library?CatalogContext=2&Category=6&Keyword="
      ),
      label: "Label.CreatorMarketplace",
      pageSort: ["develop"],
    },
  ],
  newUniversalSearchUrls: [gameSearchLink, ...miscSearchLink],
  settingsUrl: {
    settings: {
      url: getAbsoluteUrl("/my/account"),
      label: "Label.sSettings",
    },
    quickLogin: {
      url: getAbsoluteUrl("/home"),
      label: "Label.sQuickLogin",
    },
    help: {
      url: getAbsoluteUrl("/info/help?locale="),
      label: "Label.sHelp",
    },
    logout: {
      url: `${authApi}/v2/logout`,
      label: "Label.sLogout",
    },
  },
  buyRobuxUrl: {
    robuxBalance: {
      url: getAbsoluteUrl("/transactions"),
      label: "Label.sRobuxMessage",
    },
    buyRobux: {
      url: getAbsoluteUrl("/upgrades/robux?ctx=navpopover"),
      label: "Label.sBuyRobux",
    },
  },
  userDataUrl: getAbsoluteUrl("/navigation/userData"),
  quickLoginUrl: getAbsoluteUrl("/crossdevicelogin/ConfirmCode"),
};
