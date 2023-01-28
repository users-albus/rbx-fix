import React from "react";
import PropTypes from "prop-types";
import { numberFormat } from "core-utilities";
import { paymentFlowAnalyticsService } from "core-roblox-utilities";
import { Link } from "react-style-guide";
import links from "../constants/linkConstants";
import layoutConstant from "../constants/layoutConstants";

const { buyRobuxUrl } = links;

function RobuxMenu({
  translate,
  robuxAmount,
  isGetCurrencyCallDone,
  robuxError,
}) {
  const robuxAmountValue = robuxError
    ? layoutConstant.robuxOnEconomySystemOutage
    : numberFormat.getNumberFormat(robuxAmount);

  const onBuyRobuxClicked = (event) => {
    paymentFlowAnalyticsService.sendUserPurchaseFlowEvent(
      paymentFlowAnalyticsService.ENUM_TRIGGERING_CONTEXT.WEB_ROBUX_PURCHASE,
      false,
      paymentFlowAnalyticsService.ENUM_VIEW_NAME.NAVIGATION_DROPDOWN_MENU,
      paymentFlowAnalyticsService.ENUM_PURCHASE_EVENT_TYPE.USER_INPUT,
      paymentFlowAnalyticsService.ENUM_VIEW_MESSAGE.BUY_ROBUX
    );
  };

  return (
    <React.Fragment>
      <li>
        <Link
          cssClasses="rbx-menu-item"
          id="nav-robux-balance"
          url={buyRobuxUrl.robuxBalance.url}
        >
          {isGetCurrencyCallDone &&
            translate("Label.sRobuxMessage", {
              robuxValue: robuxAmountValue,
            })}
        </Link>
      </li>
      <li>
        <Link
          cssClasses="rbx-menu-item"
          url={buyRobuxUrl.buyRobux.url}
          onClick={onBuyRobuxClicked}
        >
          {translate(buyRobuxUrl.buyRobux.label)}
        </Link>
      </li>
    </React.Fragment>
  );
}

RobuxMenu.defaultProps = {
  robuxAmount: 0,
  robuxError: "",
};

RobuxMenu.propTypes = {
  translate: PropTypes.func.isRequired,
  robuxAmount: PropTypes.number,
  robuxError: PropTypes.string,
  isGetCurrencyCallDone: PropTypes.bool.isRequired,
};

export default RobuxMenu;
