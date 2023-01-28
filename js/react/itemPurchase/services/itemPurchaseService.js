import { httpService } from "core-utilities";
import urlConstants from "../constants/urlConstants";

const { getPurchaseItemUrl } = urlConstants;

export default {
  purchaseItem: (productId, params) => {
    const urlConfig = {
      url: getPurchaseItemUrl(productId),
      retryable: true,
      withCredentials: true,
    };
    return httpService.post(urlConfig, params);
  },
};
