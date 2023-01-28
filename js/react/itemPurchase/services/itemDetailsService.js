import { httpService } from "core-utilities";
import urlConstants from "../constants/urlConstants";

const {
  getItemDetailsUrl,
  postItemDetailsUrl,
  getPurchaseableDetailUrl,
  getResellerDataUrl,
  getMetaDataUrl,
  getCurrentUserBalance,
} = urlConstants;

export default {
  getItemDetails: (itemId, itemType) => {
    const urlConfig = {
      url: getItemDetailsUrl(itemId, itemType),
      retryable: true,
      withCredentials: true,
    };
    return httpService.get(urlConfig);
  },
  postItemDetails: (items) => {
    const urlConfig = {
      url: postItemDetailsUrl(),
      retryable: true,
      withCredentials: true,
    };
    const params = {
      items,
    };
    return httpService.post(urlConfig, params);
  },
  getItemPurchasableDetail: (productId) => {
    const urlConfig = {
      url: getPurchaseableDetailUrl(productId),
      retryable: true,
      withCredentials: true,
    };
    return httpService.get(urlConfig);
  },
  getResellerDetail: (assetId) => {
    const urlConfig = {
      url: getResellerDataUrl(assetId),
      retryable: true,
      withCredentials: true,
    };
    return httpService.get(urlConfig);
  },
  getEconomyMetadata: () => {
    const urlConfig = {
      url: getMetaDataUrl(),
      retryable: true,
      withCredentials: true,
    };
    return httpService.get(urlConfig);
  },
  getCurrentUserBalance: (userId) => {
    const urlConfig = {
      url: getCurrentUserBalance(userId),
      retryable: true,
      withCredentials: true,
    };
    return httpService.get(urlConfig);
  },
};
