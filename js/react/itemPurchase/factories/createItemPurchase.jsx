import React, { useState } from "react";
import PropTypes from "prop-types";
import { withTranslations } from "react-utilities";
import { createSystemFeedback } from "react-style-guide";
import { paymentFlowAnalyticsService } from "core-roblox-utilities";
import { ItemPurchaseUpsellService } from "Roblox";
import translationConfig from "../translation.config";
import { getMetaData } from "../util/itemPurchaseUtil";
import itemPurchaseConstants from "../constants/itemPurchaseConstants";
import itemPurchaseService from "../services/itemPurchaseService";
import createPurchaseConfirmationModal from "./createPurchaseConfirmationModal";
import createPurchaseVerificationModal from "./createPurchaseVerificationModal";
import createInsufficientFundsModal from "./createInsufficientFundsModal";
import createTransactionFailureModal from "./createTransactionFailureModal";
import createPriceChangedModal from "./createPriceChangedModal";

const { resources, errorTypeIds, errorStatusText, events } =
  itemPurchaseConstants;

export default function createItemPurchase({
  customPurchaseVerificationModal,
  customPurchaseVerificationModalService,
} = {}) {
  const { userRobuxBalance } = getMetaData();
  const [SystemFeedback, systemFeedbackService] = createSystemFeedback();
  const [PurchaseVerificationModal, purchaseVerificationModalService] =
    createPurchaseVerificationModal();
  const [InsufficientFundsModal, insufficientFundsModalService] =
    createInsufficientFundsModal();
  const [PurchaseConfirmationModal, purchaseConfirmationModalService] =
    createPurchaseConfirmationModal();

  const [PriceChangedModal, priceChangedModalService] =
    createPriceChangedModal();

  const [TransactionFailureModal, transactionFailureModalService] =
    createTransactionFailureModal();

  let itemUpsellProcessParams = {
    errorObject: {},
    itemDetail: {},
    startOriginalFlowCallback: () => {},
  };
  const startOriginalFlowWhenNewFlowFailed = () => {
    paymentFlowAnalyticsService.startRobuxUpsellFlow(
      itemUpsellProcessParams.itemDetail.buyButtonElementDataset.assetType,
      !!itemUpsellProcessParams.itemDetail.buyButtonElementDataset.userassetId,
      itemUpsellProcessParams.itemDetail.buyButtonElementDataset
        .isPrivateServer,
      itemUpsellProcessParams.itemDetail.buyButtonElementDataset.isPlace
    );
    insufficientFundsModalService.open();
  };
  const insufficientFundsModalServiceWrapper =
    (shortfallPrice, targetData) => () => {
      if (
        ItemPurchaseUpsellService &&
        ItemPurchaseUpsellService.showExceedLargestInsufficientRobuxModal
      ) {
        ItemPurchaseUpsellService.showExceedLargestInsufficientRobuxModal(
          shortfallPrice,
          targetData,
          startOriginalFlowWhenNewFlowFailed
        );
      } else {
        startOriginalFlowWhenNewFlowFailed();
      }
    };
  const openInsufficientRobuxModal = () => {
    if (ItemPurchaseUpsellService) {
      try {
        ItemPurchaseUpsellService.startItemUpsellProcess(
          itemUpsellProcessParams.errorObject,
          itemUpsellProcessParams.itemDetail,
          itemUpsellProcessParams.startOriginalFlowCallback
        );
        window.EventTracker.fireEvent(events.NEW_UPSELL_FROM_REACT_BUY_BUTTON);
      } catch (e) {
        window.EventTracker.fireEvent(events.NEW_UPSELL_FAILED_DUE_TO_ERROR);
        startOriginalFlowWhenNewFlowFailed();
      }
    } else {
      window.EventTracker.fireEvent(events.NEW_UPSELL_FAILED_DUE_TO_LOADING);
      startOriginalFlowWhenNewFlowFailed();
    }
  };

  function ItemPurchase({
    translate,
    assetName,
    assetType,
    assetTypeDisplayName,
    productId,
    expectedCurrency,
    expectedPrice,
    expectedSellerId,
    expectedPromoId,
    userAssetId,
    thumbnail,
    sellerName,
    showSuccessBanner,
    // for place purchase
    isPlace,
    isPrivateServer,
    handlePurchase,
    onPurchaseSuccess,
    customProps,
  }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [newPrice, setNewPrice] = useState(null);
    const [robuxNeeded, setRobuxNeeded] = useState(
      expectedPrice - userRobuxBalance
    );
    const [confirmData, setConfirmData] = useState(null);

    const closeAll = () => {
      if (customPurchaseVerificationModalService) {
        customPurchaseVerificationModalService.close();
      } else {
        purchaseVerificationModalService.close();
      }
      priceChangedModalService.close();
    };

    const handleError = ({
      showDivId,
      title,
      errorMsg: message,
      price: currentPrice,
      shortfallPrice,
    }) => {
      if (showDivId === errorTypeIds.transactionFailure) {
        setError({ title, message });
        transactionFailureModalService.open();
      } else if (showDivId === errorTypeIds.insufficientFunds) {
        setRobuxNeeded(shortfallPrice);
        generateNewItemUpsellProcessParams(shortfallPrice, currentPrice);
        openInsufficientRobuxModal();
      } else if (showDivId === errorTypeIds.priceChanged) {
        setNewPrice(currentPrice);
        priceChangedModalService.open();
      }
    };

    const openConfirmation = (data) => {
      setConfirmData(data);
      purchaseConfirmationModalService.open();
    };

    const purchaseItem = (price) => {
      const params = {
        expectedCurrency,
        expectedPrice: price,
        expectedSellerId,
      };
      if (expectedPromoId > 0) {
        params.expectedPromoId = expectedPromoId;
      }
      if (userAssetId > 0) {
        params.userAssetId = userAssetId;
      }

      if (handlePurchase) {
        handlePurchase({
          params,
          handleError,
          setLoading,
          openConfirmation,
          closeAll,
        });
        return;
      }

      setLoading(true);
      itemPurchaseService
        .purchaseItem(productId, params)
        .then(({ data }) => {
          console.debug(data);
          const { statusCode, assetIsWearable, transactionVerb } = data;
          setLoading(false);
          closeAll();
          if (statusCode === 500) {
            handleError(data);
          } else {
            onPurchaseSuccess();
            if (showSuccessBanner) {
              systemFeedbackService.success(
                translate(resources.purchaseCompleteHeading)
              );
              return;
            }
            openConfirmation({ assetIsWearable, transactionVerb });
          }
        })
        .catch((errorRes) => {
          console.debug(errorRes);
          setLoading(false);
          closeAll();
          if (
            !errorRes ||
            errorRes?.statusText === errorStatusText.badRequest
          ) {
            handleError({
              title: translate(resources.errorOccuredHeading),
              errorMsg: translate(resources.purchasingUnavailableMessage),
              showDivId: errorTypeIds.transactionFailure,
            });
          } else {
            handleError(JSON.parse(errorRes?.statusText));
          }
        });
    };
    const purchaseVerificationModal = customPurchaseVerificationModal ? (
      React.createElement(customPurchaseVerificationModal, {
        ...{
          assetName,
          assetType,
          expectedPrice,
          thumbnail,
          sellerName,
          loading,
          onAction: () => purchaseItem(expectedPrice),
          ...customProps,
        },
      })
    ) : (
      <PurchaseVerificationModal
        {...{
          expectedPrice,
          thumbnail,
          assetName,
          assetType,
          assetTypeDisplayName,
          sellerName,
          isPlace,
          loading,
          onAction: () => {
            purchaseItem(expectedPrice);
            return false;
          },
        }}
      />
    );

    const generateNewItemUpsellProcessParams = (shortfallPrice, price) => {
      const targetData = {
        assetType,
        assetTypeDisplayName,
        expectedCurrency,
        expectedPrice: price,
        expectedSellerId,
        itemName: assetName,
        itemType: assetType,
        productId,
        userassetId: userAssetId,
        placeproductpromotionId: expectedPromoId,
        isPrivateServer,
        isPlace,
      };
      itemUpsellProcessParams = {
        errorObject: {
          shortfallPrice,
          currentCurrency: expectedCurrency,
          isPlace,
        },
        itemDetail: {
          expectedItemPrice: price,
          assetName,
          buyButtonElementDataset: targetData,
        },
        startOriginalFlowCallback: insufficientFundsModalServiceWrapper(
          shortfallPrice,
          targetData
        ),
      };
    };

    if (robuxNeeded > 0 && ItemPurchaseUpsellService) {
      generateNewItemUpsellProcessParams(
        robuxNeeded,
        newPrice ?? expectedPrice
      );
    }

    return (
      <React.Fragment>
        {robuxNeeded > 0 ? (
          <InsufficientFundsModal robuxNeeded={robuxNeeded} />
        ) : (
          purchaseVerificationModal
        )}
        {error && (
          <TransactionFailureModal
            title={error.title}
            message={error.message}
          />
        )}
        {newPrice != null && (
          <PriceChangedModal
            {...{
              expectedPrice,
              currentPrice: newPrice,
              loading,
              onAction: () => {
                purchaseItem(newPrice);
                return false;
              },
            }}
          />
        )}
        {confirmData && (
          <PurchaseConfirmationModal
            {...{
              thumbnail,
              assetName,
              assetType,
              assetTypeDisplayName,
              sellerName,
              isPlace,
              isPrivateServer,
              expectedPrice: newPrice || expectedPrice,
              ...confirmData,
            }}
          />
        )}
        {showSuccessBanner && <SystemFeedback />}
      </React.Fragment>
    );
  }

  ItemPurchase.defaultProps = {
    isPlace: false,
    isPrivateServer: false,
    assetTypeDisplayName: "",
    expectedPromoId: 0,
    userAssetId: 0,
    showSuccessBanner: false,
    handlePurchase: null,
    onPurchaseSuccess: () => {},
    customProps: {},
  };

  ItemPurchase.propTypes = {
    translate: PropTypes.func.isRequired,
    productId: PropTypes.number.isRequired,
    expectedCurrency: PropTypes.number.isRequired,
    expectedPrice: PropTypes.number.isRequired,
    thumbnail: PropTypes.node.isRequired,
    assetName: PropTypes.string.isRequired,
    assetType: PropTypes.string.isRequired,
    assetTypeDisplayName: PropTypes.string,
    expectedSellerId: PropTypes.number.isRequired,
    sellerName: PropTypes.string.isRequired,
    isPlace: PropTypes.bool,
    isPrivateServer: PropTypes.bool,
    expectedPromoId: PropTypes.number,
    userAssetId: PropTypes.number,
    showSuccessBanner: PropTypes.bool,
    handlePurchase: PropTypes.func,
    onPurchaseSuccess: PropTypes.func,
    customProps: PropTypes.func,
  };
  return [
    withTranslations(ItemPurchase, translationConfig.purchasingResources),
    {
      start: () => {
        // try open verification view or insufficient funds
        // modal depending if user has enough robux
        if (customPurchaseVerificationModalService) {
          customPurchaseVerificationModalService.open();
        } else {
          purchaseVerificationModalService.open();
        }
        openInsufficientRobuxModal();
      },
    },
  ];
}
