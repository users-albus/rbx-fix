import { Endpoints, EnvironmentUrls } from "Roblox";

const { getAbsoluteUrl } = Endpoints;
const {
  authApi,
  accountSettingsApi,
  websiteUrl,
  adsApi,
  economyApi,
  privateMessagesApi,
  tradesApi,
  friendsApi,
  apiGatewayUrl,
} = EnvironmentUrls;
export default {
  getEmailStatusUrl: () => `${accountSettingsApi}/v1/email`,
  getSignupRedirUrl: () => getAbsoluteUrl("/account/signupredir"),
  getWebsiteUrl: () => websiteUrl,
  getLogoutUrl: () => `${authApi}/v2/logout`,
  getRootUrl: () => getAbsoluteUrl("/"),
  getSponsoredPageUrl: () => `${adsApi}/v1/sponsored-pages`,
  getSponsoredEventUrl: (pageType, name) =>
    getAbsoluteUrl(`/${pageType.toLowerCase()}/${name}`),
  getUnreadPrivateMessagesCountUrl: () =>
    `${privateMessagesApi}/v1/messages/unread/count`,
  getUserCurrencyUrl: (userId) => `${economyApi}/v1/users/${userId}/currency`,
  getTradeStatusCountUrl: () => `${tradesApi}/v1/trades/inbound/count`,
  getFriendsRequestCountUrl: () =>
    `${friendsApi}/v1/user/friend-requests/count`,
  getAuthTokenMetaUrl: () =>
    `${apiGatewayUrl}/auth-token-service/v1/login/metadata`,
  getLoginUrl: () => getAbsoluteUrl("/login"),
};
