import React from "react";
import PropTypes from "prop-types";
import { renderToString } from "react-dom/server";
import { withTranslations } from "react-utilities";
import { createModal } from "react-style-guide";
import urlConstants from "../constants/urlConstants";
import translationConfig from "../translation.config";
import itemPurchaseConstants from "../constants/itemPurchaseConstants";
import PriceLabel from "../components/PriceLabel";
import AssetName from "../components/AssetName";
import BalanceAfterSaleText from "../components/BalanceAfterSaleText";
import TransactionVerb from "../../../../ts/react/enums/TransactionVerb";

const { getAvatarPageUrl } = urlConstants;
const { resources } = itemPurchaseConstants;

export default function createPurchaseConfirmationModal() {
  const [Modal, modalService] = createModal();
  function PurchaseConfirmationModal({
    translate,
    expectedPrice,
    thumbnail,
    assetName,
    assetType,
    assetIsWearable,
    assetTypeDisplayName,
    sellerName,
    isPlace,
    isPrivateServer,
    onAccept,
    onDecline,
    transactionVerb,
  }) {
    let actionButtonText;
    let onAction;
    let neutralButtonText = translate(resources.continueAction);
    if (isPrivateServer) {
      actionButtonText = translate(resources.configureAction);
      neutralButtonText = translate(resources.notNowAction);
    } else if (assetIsWearable) {
      actionButtonText = translate(resources.customizeAction);
      neutralButtonText = translate(resources.notNowAction);
      onAction = () => {
        window.location.href = getAvatarPageUrl();
        return false;
      };
    }

    const assetInfo = {
      assetName: renderToString(<AssetName name={assetName} />),
      assetType: assetTypeDisplayName || assetType,
      seller: sellerName,
      robux: renderToString(<PriceLabel {...{ price: expectedPrice }} />),
    };
    let messagePromptResource;
    if (transactionVerb === TransactionVerb.Bought) {
      messagePromptResource = isPlace
        ? resources.successfullyAcquiredAccessMessage
        : resources.successfullyBoughtMessage;
    } else if (transactionVerb === TransactionVerb.Renewed) {
      messagePromptResource = isPlace
        ? resources.successfullyRenewedAccessMessage
        : resources.successfullyRenewedMessage;
    } else {
      messagePromptResource = isPlace
        ? resources.successfullyAcquiredAccessMessage
        : resources.successfullyAcquiredMessage;
    }
    const body = (
      <div
        className="modal-message"
        dangerouslySetInnerHTML={{
          __html: translate(messagePromptResource, assetInfo),
        }}
      />
    );

    return (
      <Modal
        {...{
          title: translate(resources.purchaseCompleteHeading),
          body,
          thumbnail,
          neutralButtonText,
          actionButtonText,
          onAction: onAccept || onAction,
          onNeutral: onDecline,
          footerText: !isPrivateServer && (
            <BalanceAfterSaleText expectedPrice={expectedPrice} />
          ),
          actionButtonShow: !!actionButtonText,
          onClose: () => window.location.reload(),
        }}
      />
    );
  }

  PurchaseConfirmationModal.defaultProps = {
    isPlace: false,
    assetTypeDisplayName: "",
    transactionVerb: "",
    assetIsWearable: false,
    isPrivateServer: false,
    onAccept: null,
    onDecline: null,
  };

  PurchaseConfirmationModal.propTypes = {
    translate: PropTypes.func.isRequired,
    transactionVerb: PropTypes.string,
    expectedPrice: PropTypes.number.isRequired,
    thumbnail: PropTypes.node.isRequired,
    assetName: PropTypes.string.isRequired,
    assetType: PropTypes.string.isRequired,
    assetTypeDisplayName: PropTypes.string,
    assetIsWearable: PropTypes.bool,
    sellerName: PropTypes.string.isRequired,
    isPlace: PropTypes.bool,
    isPrivateServer: PropTypes.bool,
    onAccept: PropTypes.func,
    onDecline: PropTypes.func,
  };
  return [
    withTranslations(
      PurchaseConfirmationModal,
      translationConfig.purchasingResources
    ),
    modalService,
  ];
}
