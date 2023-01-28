/* eslint-disable react/jsx-no-literals */
// Just for line 49 using '+' for thumbnails representing more than the 3 item thumbnail limit
import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { renderToString } from "react-dom/server";
import { withTranslations } from "react-utilities";
import { createModal } from "react-style-guide";
import {
  Thumbnail2d,
  ThumbnailTypes,
  ThumbnailFormat,
  DefaultThumbnailSize,
} from "roblox-thumbnails";
import { authenticatedUser } from "header-scripts";
import translationConfig from "../translation.config";
import itemPurchaseConstants from "../constants/itemPurchaseConstants";
import PriceLabel from "../components/PriceLabel";
import BalanceAfterSaleText from "../components/BalanceAfterSaleText";
import itemPurchaseService from "../services/itemPurchaseService";
import ItemType from "../../../../ts/react/enums/ItemType";
import BatchBuyPurchaseResults from "../../../../ts/react/enums/BatchBuyPurchaseResults";

const {
  resources,
  batchBuyMaxThumbnails,
  batchBuyPurchaseResults,
  floodcheckTime,
} = itemPurchaseConstants;

function ItemThumbnail({ itemsCount, item, index }) {
  const itemName = item.name;

  const hasMoreItems = itemsCount > batchBuyMaxThumbnails;
  const moreItemsCount = itemsCount - batchBuyMaxThumbnails;
  const shouldShowOverlay = hasMoreItems && index === batchBuyMaxThumbnails - 1;

  return (
    <div className="modal-multi-item-image-container">
      <Thumbnail2d
        type={
          item.itemType === ItemType.Bundle
            ? ThumbnailTypes.bundleThumbnail
            : ThumbnailTypes.assetThumbnail
        }
        size={DefaultThumbnailSize}
        targetId={item.id}
        containerClass="batch-buy-thumbnail"
        format={ThumbnailFormat.png}
        altName={itemName}
      />

      {shouldShowOverlay && (
        <div className="thumb-overlay">
          <div className="font-header-1">＋{moreItemsCount}</div>
        </div>
      )}
    </div>
  );
}

export function handleResultFromPurchases(result) {
  // Error handling using systemFeedbackService returns the errors for handling within the feature itself
  let successCount = 0;
  const errorResults = [];
  result.forEach((itemResult) => {
    if (itemResult.data.reason === BatchBuyPurchaseResults.Success) {
      successCount += 1;
    } else {
      const error = errorResults.find((err) => {
        return err.error === itemResult.data.reason;
      });
      if (error) {
        error.count += 1;
      } else {
        errorResults.push({ error: itemResult.data.reason, count: 1 });
      }
    }
  });

  if (successCount === result.length) {
    return { success: true, message: resources.purchaseCompleteHeading };
  }
  let predominantError = { error: "", count: 0 };
  errorResults.forEach((err) => {
    if (err.count > predominantError.count) {
      predominantError = err;
    }
  });
  // Partial success, partial failure error messages
  if (successCount > 0) {
    switch (predominantError.error) {
      case BatchBuyPurchaseResults.AlreadyOwned:
        return {
          success: false,
          message: resources.batchBuyPartialSuccessItemsOwnedFailureMessage,
          params: {
            itemCountSuccess: successCount,
            itemCountFailure: predominantError.count,
          },
        };
      case BatchBuyPurchaseResults.InsufficientFunds:
        return {
          success: false,
          message:
            resources.batchBuyPartialSuccessInsufficientFundsFailureMessage,
          params: {
            itemCountSuccess: successCount,
            itemCountFailure: predominantError.count,
          },
        };
      case BatchBuyPurchaseResults.ExceptionOccured:
        return {
          success: false,
          message: resources.batchBuyPartialSuccessNetworkErrorFailureMessage,
          params: {
            itemCountSuccess: successCount,
            itemCountFailure: predominantError.count,
          },
        };
      case BatchBuyPurchaseResults.TooManyPurchases:
        return {
          success: false,
          message: resources.batchBuyPartialSuccessFloodcheckFailureMessage,
          params: {
            itemCountSuccess: successCount,
            itemCountFailure: predominantError.count,
          },
        };
      case BatchBuyPurchaseResults.PremiumNeeded:
        return {
          success: false,
          message: resources.batchBuyPartialSuccessPremiumNeededFailureMessage,
          params: {
            itemCountSuccess: successCount,
            itemCountFailure: predominantError.count,
          },
        };
      case BatchBuyPurchaseResults.NoSellers:
        return {
          success: false,
          message: resources.batchBuyPartialSuccessNoSellersFailureMessage,
          params: {
            itemCountSuccess: successCount,
            itemCountFailure: predominantError.count,
          },
        };
      default:
        return {
          success: false,
          message: resources.batchBuyPartialSuccessGeneralFailureMessage,
          params: {
            itemCountSuccess: successCount,
            itemCountFailure: predominantError.count,
          },
        };
    }
  } else {
    // All purchases failed
    switch (predominantError.error) {
      case BatchBuyPurchaseResults.AlreadyOwned:
        return {
          success: false,
          message: resources.batchBuyItemsOwnedFailureMessage,
        };
      case BatchBuyPurchaseResults.InsufficientFunds:
        return {
          success: false,
          message: resources.insufficientFundsFailureMessage,
        };
      case BatchBuyPurchaseResults.ExceptionOccured:
        return {
          success: false,
          message: resources.networkErrroFailureMessage,
        };
      case BatchBuyPurchaseResults.TooManyPurchases:
        return {
          success: false,
          message: resources.floodcheckFailureMessage,
          params: { throttleTime: floodcheckTime },
        };
      case BatchBuyPurchaseResults.PremiumNeeded:
        return {
          success: false,
          message: resources.premiumNeededFailureMessage,
        };
      case BatchBuyPurchaseResults.NoSellers:
        return { success: false, message: resources.noSellersFailureMessage };
      default:
        return {
          success: false,
          message: resources.purchaseErrorFailureMessage,
        };
    }
  }
}

export default function createMultiItemPurchaseModal() {
  const [Modal, modalService] = createModal();
  function MultiItemPurchaseModal({
    translate,
    title,
    expectedTotalPrice,
    itemDetails,
    currentRobuxBalance,
    onCancel,
    onTransactionComplete,
    onAction,
    loading,
    systemFeedbackService,
  }) {
    let defaultTitle;
    let actionButtonText;

    const assetInfo = {
      itemCount: itemDetails.length,
      robux: renderToString(
        <span className="robux-price">
          <PriceLabel {...{ price: expectedTotalPrice }} />
        </span>
      ),
    };
    const bodyMessageResource = resources.batchBuyPromptMessage;

    if (expectedTotalPrice === 0) {
      defaultTitle = translate(resources.getItemHeading);
      actionButtonText = translate(resources.getNowAction);
    } else {
      defaultTitle = translate(resources.buyItemHeading);
      actionButtonText = translate(resources.buyNowAction);
    }

    const itemsSlice = itemDetails?.slice(0, batchBuyMaxThumbnails);

    async function purchaseItem(item) {
      const params = {
        expectedPrice:
          item.premiumPriceInRobux && authenticatedUser.isPremiumUser
            ? item.premiumPriceInRobux
            : item.price,
        expectedSellerId: item.firstReseller
          ? item.firstReseller.seller.id
          : undefined,
        // For resellers
        userAssetId: item.firstReseller
          ? item.firstReseller.userAssetId
          : undefined,
      };
      let result;
      try {
        result = await itemPurchaseService.purchaseItem(item.productId, params);
      } catch (e) {
        result = {
          data: {
            assetId: item.itemType === ItemType.Asset ? item.id : undefined,
            bundleId: item.itemType === ItemType.Bundle ? item.id : undefined,
            reason: BatchBuyPurchaseResults.CaughtError,
          },
        };
      }
      return result;
    }

    function handleResult(result) {
      const resultFeedback = handleResultFromPurchases(result);
      let resultMessage;
      if (resultFeedback.params) {
        resultMessage = translate(
          resultFeedback.message,
          resultFeedback.params
        );
      } else {
        resultMessage = translate(resultFeedback.message);
      }

      if (resultFeedback.success) {
        systemFeedbackService.success(resultMessage);
      } else {
        systemFeedbackService.warning(resultMessage);
      }
    }

    async function purchaseItems() {
      // We want to have a batch purchase endpoint, until then we need to make purchase calls sequentially
      const result = await Promise.all(
        itemDetails.map((item) => purchaseItem(item))
      );
      handleResult(result);
      onTransactionComplete(result);
    }

    const onModalNeutral = () => {
      onCancel();
    };

    const onModalConfirm = () => {
      purchaseItems();
      onAction();
    };

    const body = (
      <Fragment>
        <div
          className="modal-message multi-item"
          // Used for formatting purchase text, hardcoded string value from translation service
          dangerouslySetInnerHTML={{
            __html: translate(bodyMessageResource, assetInfo),
          }}
        />
        {itemDetails !== undefined && itemDetails.length > 0 && (
          <div className="modal-multi-item-images-container">
            {itemsSlice.map((item, i) => (
              <ItemThumbnail
                key={item.itemId}
                itemsCount={itemDetails.length}
                item={item}
                index={i}
              />
            ))}
          </div>
        )}
      </Fragment>
    );

    return (
      <Modal
        title={title || defaultTitle}
        body={body}
        neutralButtonText={translate(resources.cancelAction)}
        actionButtonText={actionButtonText}
        onAction={onModalConfirm}
        onNeutral={onModalNeutral}
        footerText={
          <BalanceAfterSaleText
            expectedPrice={expectedTotalPrice}
            currentRobuxBalance={currentRobuxBalance}
          />
        }
        loading={loading}
        actionButtonShow={itemDetails}
      />
    );
  }

  MultiItemPurchaseModal.defaultProps = {
    title: "",
    loading: false,
  };

  MultiItemPurchaseModal.propTypes = {
    translate: PropTypes.func.isRequired,
    title: PropTypes.string,
    expectedTotalPrice: PropTypes.number.isRequired,
    currentRobuxBalance: PropTypes.number.isRequired,
    itemDetails: PropTypes.arrayOf(
      PropTypes.shape({
        productId: PropTypes.number.isRequired,
        price: PropTypes.number.isRequired,
        itemName: PropTypes.string.isRequired,
        itemType: PropTypes.string.isRequired,
        assetTypeDisplayName: PropTypes.string.isRequired,
        sellerName: PropTypes.string.isRequired,
        expectedSellerId: PropTypes.number.isRequired,
        isPurchasable: PropTypes.bool.isRequired,
        isOwned: PropTypes.bool.isRequired,
        isPlugin: PropTypes.bool.isRequired,
        itemDetailItemId: PropTypes.number.isRequired,
        loading: PropTypes.bool.isRequired,
        userQualifiesForPremiumPrices: PropTypes.bool.isRequired,
        premiumPriceInRobux: PropTypes.number.isRequired,
        isAuthenticated: PropTypes.bool.isRequired,
        resellerAvailable: PropTypes.bool.isRequired,
        firstReseller: PropTypes.shape({
          seller: {
            name: PropTypes.string.isRequired,
            id: PropTypes.number.isRequired,
          },
          userAssetId: PropTypes.number.isRequired,
        }).isRequired,
        isMarketPlaceEnabled: PropTypes.bool.isRequired,
      })
    ).isRequired,
    onCancel: PropTypes.func.isRequired,
    onTransactionComplete: PropTypes.func.isRequired,
    onAction: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    systemFeedbackService: PropTypes.func.isRequired,
  };
  return [
    withTranslations(
      MultiItemPurchaseModal,
      translationConfig.purchasingResources
    ),
    modalService,
  ];
}
