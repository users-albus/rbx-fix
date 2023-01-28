import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { authenticatedUser } from "header-scripts";
import { withTranslations } from "react-utilities";
import batchLoadItemDetails from "../factories/batchLoadItemDetails";
import itemDetailsService from "../services/itemDetailsService";
import { BatchBuyItemsButton } from "./BatchBuyItems";
import translationConfig from "../translation.config";

function PriceContainer({
  items,
  onBuyButtonClick,
  systemFeedbackService,
  onConfirm,
  onCancel,
  onTransactionComplete,
  translate,
}) {
  const [currentUserBalance, setCurrentUserBalance] = useState(undefined);

  const getCurrentUserBalance = () => {
    itemDetailsService
      .getCurrentUserBalance(authenticatedUser.id)
      .then(function handleResult(result) {
        setCurrentUserBalance(result.data.robux);
      })
      .catch(() => {
        setCurrentUserBalance(undefined);
      });
  };
  useEffect(() => {
    if (authenticatedUser.isAuthenticated) {
      getCurrentUserBalance();
    }
  }, []);

  const { itemDetails } = batchLoadItemDetails(items);

  return (
    <BatchBuyItemsButton
      currentUserBalance={currentUserBalance}
      items={items}
      itemDetails={itemDetails}
      systemFeedbackService={systemFeedbackService}
      onBuyButtonClick={onBuyButtonClick}
      onConfirm={onConfirm}
      onCancel={onCancel}
      onTransactionComplete={onTransactionComplete}
      translate={translate}
    />
  );
}

PriceContainer.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  onBuyButtonClick: PropTypes.func,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  onTransactionComplete: PropTypes.func,
  systemFeedbackService: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
};

PriceContainer.defaultProps = {
  onBuyButtonClick: () => {},
  onConfirm: () => {},
  onCancel: () => {},
  onTransactionComplete: (result) => {},
};

export default withTranslations(
  PriceContainer,
  translationConfig.purchasingResources
);
