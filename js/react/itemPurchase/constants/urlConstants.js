import { EnvironmentUrls } from "Roblox";
import { urlService } from "core-utilities";

const { economyApi, catalogApi } = EnvironmentUrls;

export default {
  getRobuxUpgradesUrl: (source) =>
    urlService.getUrlWithQueries("/Upgrades/Robux.aspx", {
      ctx: source,
    }),
  getAvatarPageUrl: () => urlService.getAbsoluteUrl("/my/avatar"),
  getPurchaseItemUrl: (productId) =>
    `${economyApi}/v1/purchases/products/${productId}`,
  getItemDetailsUrl: (itemId, itemType) =>
    `${catalogApi}/v1/catalog/items/${itemId}/details?itemType=${itemType}`,
  postItemDetailsUrl: () => `${catalogApi}/v1/catalog/items/details`,
  getPurchaseableDetailUrl: (productId) =>
    `${economyApi}/v1/products/${productId}?showPurchasable=true`,
  getPremiumConversionUrl: (itemId, itemType) =>
    `/premium/membership?ctx=WebItemDetail&upsellTargetType=${itemType}&upsellTargetId=${itemId}`,
  getResellerDataUrl: (assetId) =>
    `${economyApi}/v1/assets/${assetId}/resellers?limit=10`,
  getInventoryUrl: (authenticatedUserId) =>
    `/users/${authenticatedUserId}/inventory`,
  getMetaDataUrl: () => `${economyApi}/v2/metadata`,
  getCurrentUserBalance: (userId) =>
    `${economyApi}/v1/users/${userId}/currency`,
};
