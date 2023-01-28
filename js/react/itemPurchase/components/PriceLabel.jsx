import React from "react";
import { withTranslations } from "react-utilities";
import PropTypes from "prop-types";
import { numberFormat } from "core-utilities";
import itemPurchaseConstants from "../constants/itemPurchaseConstants";
import translationConfig from "../translation.config";

const { resources } = itemPurchaseConstants;

function PriceLabel({ translate, price, color }) {
  if (price === 0) {
    return (
      <span className="text-robux text-free">
        {translate(resources.freeLabel)}
      </span>
    );
  }
  return (
    <React.Fragment>
      <span className={`icon-robux${color ? `-${color}` : ""}-16x16`} />
      <span className="text-robux">{numberFormat.getNumberFormat(price)}</span>
    </React.Fragment>
  );
}
PriceLabel.defaultProps = {
  color: "",
};
PriceLabel.propTypes = {
  price: PropTypes.number.isRequired,
  translate: PropTypes.func.isRequired,
  color: PropTypes.string,
};

export default withTranslations(
  PriceLabel,
  translationConfig.purchasingResources
);
