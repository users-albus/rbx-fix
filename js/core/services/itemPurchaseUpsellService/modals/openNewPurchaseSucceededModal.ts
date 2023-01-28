import { Dialog, RobloxTranslationResource } from "Roblox";
import { paymentFlowAnalyticsService } from "core-roblox-utilities";
import {
  ASSET_TYPE_ENUM,
  GAMES_PAGE_PREFIX,
  LANG_KEYS,
  UPSELL_COUNTER_NAMES,
} from "../constants/upsellConstants";
import formattingRobux from "../utils/common/formattingRobux";
import {
  redirectToCustomizeAvatar,
  redirectToItemPath,
} from "../utils/common/redirectionHelpers";
import LoadingOverlay from "../components/LoadingOverlay";
import { ItemPurchaseObject } from "../constants/serviceTypeDefinitions";
import reportCounter from "../utils/common/reportCounter";

export default function openNewPurchaseSucceededModal(
  itemPurchaseObj: ItemPurchaseObject,
  robuxLeft: number,
  translationResource: RobloxTranslationResource,
  loadingOverlay: LoadingOverlay
) {
  const bodyUserBalanceNow = `<span>${translationResource.get(
    LANG_KEYS.purchaseSucceededRobuxBalanceMessage,
    { userRobuxBalance: formattingRobux(robuxLeft) }
  )}</span>`;

  const dialogBody = `<div class='item-content'>
        <div class='item-card-container item-preview'>
          <div class='item-card-thumb'>
            <img alt='item preview' src='${itemPurchaseObj.itemThumbnailUrl}'/>
          </div>
        </div>
        <div class='text-center'>
          ${translationResource.get(LANG_KEYS.purchaseSucceededMessage, {
            assetName: itemPurchaseObj.assetName,
          })}
          ${bodyUserBalanceNow}
        </div>
      </div>`;
  const acceptText =
    itemPurchaseObj.assetType !== ASSET_TYPE_ENUM.GAME_PASS
      ? translationResource.get(LANG_KEYS.equipMyAvatarAction, {})
      : translationResource.get(LANG_KEYS.okAction, {});
  Dialog.open({
    titleText: translationResource.get(LANG_KEYS.purchaseSucceededHeading, {}),
    bodyContent: dialogBody,
    declineText: translationResource.get(LANG_KEYS.backToShopAction, {}),
    acceptText,
    acceptColor: "btn-primary-md",
    onAccept: () => {
      paymentFlowAnalyticsService.sendUserPurchaseFlowEvent(
        paymentFlowAnalyticsService.ENUM_TRIGGERING_CONTEXT
          .WEB_CATALOG_ROBUX_UPSELL,
        true,
        paymentFlowAnalyticsService.ENUM_VIEW_NAME.PURCHASE_WARNING,
        paymentFlowAnalyticsService.ENUM_PURCHASE_EVENT_TYPE.USER_INPUT,
        paymentFlowAnalyticsService.ENUM_VIEW_MESSAGE.OK
      );
      reportCounter(
        UPSELL_COUNTER_NAMES.AutoPurchaseSucceedEquipMyAvatar,
        itemPurchaseObj.assetType
      );
      if (itemPurchaseObj.assetType !== ASSET_TYPE_ENUM.GAME_PASS) {
        redirectToCustomizeAvatar();
      } else if (itemPurchaseObj.itemPath.startsWith(GAMES_PAGE_PREFIX)) {
        redirectToItemPath(`${itemPurchaseObj.itemPath}?#!/store`); // ? mark to avoid same url no redirection
      } else {
        redirectToItemPath(itemPurchaseObj.itemPath);
      }
      return false;
    },
    onDecline: () => {
      // Show the overlay to avoid go back to the page with the Buy Button still showing ups
      loadingOverlay.show();
      paymentFlowAnalyticsService.sendUserPurchaseFlowEvent(
        paymentFlowAnalyticsService.ENUM_TRIGGERING_CONTEXT
          .WEB_CATALOG_ROBUX_UPSELL,
        true,
        paymentFlowAnalyticsService.ENUM_VIEW_NAME.PURCHASE_WARNING,
        paymentFlowAnalyticsService.ENUM_PURCHASE_EVENT_TYPE.USER_INPUT,
        paymentFlowAnalyticsService.ENUM_VIEW_MESSAGE.CANCEL
      );
      reportCounter(
        UPSELL_COUNTER_NAMES.AutoPurchaseSucceedBackToShop,
        itemPurchaseObj.assetType
      );
      redirectToItemPath(itemPurchaseObj.itemPath);
      return false;
    },
    onCancel: () => {
      loadingOverlay.show();
      paymentFlowAnalyticsService.sendUserPurchaseFlowEvent(
        paymentFlowAnalyticsService.ENUM_TRIGGERING_CONTEXT
          .WEB_CATALOG_ROBUX_UPSELL,
        true,
        paymentFlowAnalyticsService.ENUM_VIEW_NAME.PURCHASE_WARNING,
        paymentFlowAnalyticsService.ENUM_PURCHASE_EVENT_TYPE.USER_INPUT,
        paymentFlowAnalyticsService.ENUM_VIEW_MESSAGE.CANCEL
      );
      reportCounter(
        UPSELL_COUNTER_NAMES.AutoPurchaseSucceedClose,
        itemPurchaseObj.assetType
      );
      redirectToItemPath(itemPurchaseObj.itemPath);
      return false;
    },
    allowHtmlContentInBody: true,
    allowHtmlContentInFooter: false,
    fieldValidationRequired: true,
    showDecline: itemPurchaseObj.assetType !== ASSET_TYPE_ENUM.GAME_PASS,
    dismissable: false,
    xToCancel: true,
  });
}
