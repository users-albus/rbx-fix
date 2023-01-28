/*
 * This file is implementation of ItemPurchaseForDialog's purchaseItem method
 * This method was implemented in the WebSites: https://github.rbx.com/Roblox/web-platform/blob/186bc2798a9b636ef94f884de652d9554e4518ad/Web/RobloxWebSite/js/ItemPurchaseForDialog/ItemPurchaseForDialog.js#L99
 * In order to control the auto purchase flow, we have to rewrite part of the method.
 */
import {
  ItemPurchase,
  CurrentUser,
  EventStream,
  UrlParser,
  EnvironmentUrls,
  RobloxTranslationResource,
} from "Roblox";
import { httpService } from "core-utilities";
import {
  ItemPurchaseObject,
  NextGenPurchaseStatusResponse,
  PurchaseResponse,
  PurchaseResponseError,
} from "../../constants/serviceTypeDefinitions";
import LoadingOverlay from "../../components/LoadingOverlay";
import openNewPurchaseSucceededModal from "../../modals/openNewPurchaseSucceededModal";
import {
  ASSET_TYPE_ENUM,
  NEXT_GEN_PURCHASE_API,
  NEXT_GEN_PURCHASE_STATUS_API,
  ORIGINAL_PURCHASE_API,
  UPSELL_COUNTER_NAMES,
} from "../../constants/upsellConstants";
import { invalidateCurrentAutoPurchaseFlow } from "../common/invalidationHelpers";
import openTryAgainLaterErrorModal from "../../modals/openTryAgainLaterErrorModal";
import reportCounter from "../common/reportCounter";

function getAssetAcquiredAnalyticsVariables(itemId: string | undefined) {
  const userId = CurrentUser && CurrentUser.userId;

  const urlParametersObject = UrlParser.getParametersAsObject();

  return {
    assetId: itemId,
    category: urlParametersObject.Category,
    creatorId: urlParametersObject.CreatorId,
    genre: urlParametersObject.GenreCsv,
    page: urlParametersObject.Page,
    position: urlParametersObject.Position,
    searchKeyword: urlParametersObject.SearchKeyword,
    sortAggregation: urlParametersObject.SortAggregation,
    sortType: urlParametersObject.SortType,
    userId,
    searchId: urlParametersObject.SearchId,
  };
}

async function purchaseWithUrl(
  urlString: string,
  itemPurchaseObj: ItemPurchaseObject,
  loadingOverlay: LoadingOverlay,
  translationResource: RobloxTranslationResource
): Promise<void> {
  const urlConfig = {
    url: urlString,
    withCredentials: true,
    retryable: false,
    noCache: true,
    noPragma: true,
  };
  try {
    const requestBody = {
      expectedCurrency: itemPurchaseObj.expectedCurrency,
      expectedPrice: itemPurchaseObj.expectedPrice,
      expectedSellerId: itemPurchaseObj.expectedSellerId,
      expectedPromoId: itemPurchaseObj.expectedPromoId,
      userAssetId: itemPurchaseObj.userAssetId,
    };

    const response = await httpService.post<PurchaseResponse>(
      urlConfig,
      requestBody
    );

    const purchaseResult = response.data;
    if (purchaseResult.statusCode === 500) {
      reportCounter(
        UPSELL_COUNTER_NAMES.AutoPurchaseErrorFromPurchaseApi,
        itemPurchaseObj.assetType
      );
      if (purchaseResult.showDivID === undefined) {
        purchaseResult.showDivID = purchaseResult.showDivId;
      }
      if (purchaseResult.AssetID === undefined) {
        purchaseResult.AssetID = purchaseResult.assetId;
      }
      loadingOverlay.hide();
      ItemPurchase().openErrorView(purchaseResult);
      invalidateCurrentAutoPurchaseFlow();
      return Promise.resolve(); // let the original error flow handle the error, reject will handle twice by catch
    }

    if (itemPurchaseObj.isLibrary && EventStream && UrlParser) {
      const obj = getAssetAcquiredAnalyticsVariables(purchaseResult.assetId);
      EventStream.SendEventWithTarget(
        "LibraryAssetAcquired",
        "Marketplace",
        obj,
        EventStream.TargetTypes.WWW
      );
    }

    reportCounter(
      UPSELL_COUNTER_NAMES.AutoPurchaseSucceed,
      itemPurchaseObj.assetType
    );

    loadingOverlay.hide();
    const robuxLeft =
      itemPurchaseObj.userBalance - itemPurchaseObj.expectedPrice;
    openNewPurchaseSucceededModal(
      itemPurchaseObj,
      robuxLeft,
      translationResource,
      loadingOverlay
    );
    return Promise.resolve();
  } catch (purchaseErr) {
    loadingOverlay.hide();

    reportCounter(
      UPSELL_COUNTER_NAMES.AutoPurchaseFailed,
      itemPurchaseObj.assetType
    );

    const purchaseErrData = purchaseErr as PurchaseResponseError;
    if (
      typeof purchaseErr !== "object" ||
      !("responseText" in purchaseErrData.request)
    ) {
      return Promise.reject(purchaseErrData.request);
    }

    const purchaseError = purchaseErrData.request;
    if (purchaseError.responseText === "Bad Request") {
      openTryAgainLaterErrorModal(itemPurchaseObj, translationResource);
    } else {
      try {
        const errObj = JSON.parse(purchaseError.responseText) as {
          [key: string]: unknown;
        };
        ItemPurchase().openErrorView(errObj);
        invalidateCurrentAutoPurchaseFlow();
      } catch (parseErr) {
        return Promise.reject(parseErr);
      }
    }
    return Promise.reject(purchaseErr);
  }
}

export default async function initiateAutoPurchaseItem(
  itemPurchaseObj: ItemPurchaseObject,
  purchaseCallback:
    | ((obj: { [k: string]: unknown }) => Promise<void>)
    | null
    | undefined = undefined,
  loadingOverlay: LoadingOverlay,
  translationResource: RobloxTranslationResource
): Promise<void> {
  if (
    itemPurchaseObj.itemContainerElemClassList?.contains("btn-disabled-primary")
  ) {
    return Promise.resolve();
  }
  const passProductPurchasingApiUrl = `${
    EnvironmentUrls.passProductPurchasingApi
  }${NEXT_GEN_PURCHASE_API.replace("{productId}", itemPurchaseObj.productId)}`;
  const bundlesProductPurchasingApiUrl = `${
    EnvironmentUrls.bundlesProductPurchasingApi
  }${NEXT_GEN_PURCHASE_API.replace("{productId}", itemPurchaseObj.productId)}`;
  const economyApiUrl = `${
    EnvironmentUrls.economyApi
  }${ORIGINAL_PURCHASE_API.replace("{productId}", itemPurchaseObj.productId)}`;

  if (purchaseCallback) {
    return purchaseCallback({
      productId: itemPurchaseObj.productId,
      expectedPrice: itemPurchaseObj.expectedPrice,
      expectedCurrency: itemPurchaseObj.expectedCurrency,
      expectedPromoId: itemPurchaseObj.expectedPromoId?.toString(),
      expectedSellerId: itemPurchaseObj.expectedSellerId,
      userAssetId: itemPurchaseObj.userAssetId?.toString(),
    });
  }

  reportCounter(
    UPSELL_COUNTER_NAMES.AutoPurchaseStarted,
    itemPurchaseObj.assetType
  );

  try {
    const nextgenUrlConfig = {
      url: `${EnvironmentUrls.economyApi}${NEXT_GEN_PURCHASE_STATUS_API}`,
      withCredentials: true,
    };
    const nextGenResponse =
      await httpService.get<NextGenPurchaseStatusResponse>(nextgenUrlConfig);
    if (nextGenResponse.status === 200) {
      // decision: no fail-over to economy api for next gen purchase api
      if (
        nextGenResponse.data.isNextGenPassProductPurchasingEnabled &&
        itemPurchaseObj.assetType === ASSET_TYPE_ENUM.GAME_PASS
      ) {
        return purchaseWithUrl(
          passProductPurchasingApiUrl,
          itemPurchaseObj,
          loadingOverlay,
          translationResource
        );
      }
      if (
        nextGenResponse.data.isNextGenBundlesProductPurchasingEnabled &&
        (itemPurchaseObj.assetType === ASSET_TYPE_ENUM.BUNDLE ||
          itemPurchaseObj.assetType === ASSET_TYPE_ENUM.BUNDLE_ALIAS)
      ) {
        return purchaseWithUrl(
          bundlesProductPurchasingApiUrl,
          itemPurchaseObj,
          loadingOverlay,
          translationResource
        );
      }
    }
  } catch (e) {
    // do nothing, but try economyApiUrl, this only happens when the next gen status api doesn't work
  }
  return purchaseWithUrl(
    economyApiUrl,
    itemPurchaseObj,
    loadingOverlay,
    translationResource
  );
}
