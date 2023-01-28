import React, { useRef } from "react";
import PropTypes from "prop-types";
import { Popover } from "react-style-guide";
import BuyRobuxIcon from "./BuyRobuxIcon";
import RobuxMenu from "./RobuxMenu";
import navigationUtil from "../util/navigationUtil";

function BuyRobuxPopover({
  translate,
  robuxAmount,
  isGetCurrencyCallDone,
  robuxError,
}) {
  const ref = useRef();

  return (
    <li id="navbar-robux" ref={ref} className="navbar-icon-item">
      <Popover
        id="buy-robux-popover"
        trigger="click"
        placement="bottom"
        button={
          <button type="button" className="btn-navigation-nav-robux-md">
            <BuyRobuxIcon
              {...{ robuxAmount, isGetCurrencyCallDone, robuxError }}
            />
          </button>
        }
        role="menu"
        container={ref.current}
      >
        <div className={navigationUtil.getThemeClass()}>
          <ul id="buy-robux-popover-menu" className="dropdown-menu">
            <RobuxMenu
              {...{ translate, robuxAmount, isGetCurrencyCallDone, robuxError }}
            />
          </ul>
        </div>
      </Popover>
    </li>
  );
}

BuyRobuxPopover.defaultProps = {
  robuxAmount: 0,
  robuxError: "",
};

BuyRobuxPopover.propTypes = {
  translate: PropTypes.func.isRequired,
  robuxAmount: PropTypes.number,
  robuxError: PropTypes.string,
  isGetCurrencyCallDone: PropTypes.bool.isRequired,
};

export default BuyRobuxPopover;
