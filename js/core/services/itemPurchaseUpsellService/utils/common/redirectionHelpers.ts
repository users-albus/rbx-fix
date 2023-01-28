import { Endpoints } from "Roblox";
import { upsellUtil } from "core-roblox-utilities";

export function redirectToCustomizeAvatar() {
  const customizeAvatarUrl = Endpoints.getAbsoluteUrl("/my/avatar");
  if (customizeAvatarUrl !== undefined && customizeAvatarUrl !== "") {
    upsellUtil.expireUpsellCookie();
    window.location.href = customizeAvatarUrl;
  }
}

export function redirectToCatalogShop() {
  upsellUtil.expireUpsellCookie();
  window.location.href = Endpoints.getAbsoluteUrl("/catalog");
}

export function redirectToItemPath(itemPath: string) {
  upsellUtil.expireUpsellCookie();
  window.location.href = Endpoints.getAbsoluteUrl(itemPath);
}

export function redirectToRobuxStore() {
  window.location.href = Endpoints.getAbsoluteUrl("/upgrades/robux?ctx=upsell");
}
