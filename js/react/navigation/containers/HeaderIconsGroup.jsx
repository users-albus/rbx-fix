import React, { useState, useEffect } from "react";
import angular from "angular";
import PropTypes from "prop-types";
import { authenticatedUser } from "header-scripts";
import navigationService from "../services/navigationService";
import NotificationStreamPopover from "../components/NotificationStreamPopover";
import SettingsPopover from "../components/SettingsPopover";
import BuyRobuxPopover from "../components/BuyRobuxPopover";
import UniverseSearchIcon from "../components/UniverseSearchIcon";
import navigationUtil from "../util/navigationUtil";
import AgeBracketDisplay from "../components/AgeBracketDisplay";

const { getAccountNotificationCount } = navigationUtil;

function HeaderIconsGroup({ translate, toggleUniverseSearch }) {
  const { isAuthenticated, id: userId } = authenticatedUser;
  const [accountNotificationCount, setAccountNotificationCount] = useState(0);
  const [isGetCurrencyCallDone, setGetCurrencyCallDone] = useState(false);
  const [robuxAmount, setRobuxAmount] = useState(0);
  const [robuxError, setRobuxError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      getAccountNotificationCount().then(setAccountNotificationCount);
      navigationService
        .getUserCurrency(userId)
        .then(
          ({ data: usercurrencyData }) => {
            setRobuxAmount(usercurrencyData.robux);
          },
          () => {
            setRobuxError("Currency service unavailable");
          }
        )
        .finally(() => {
          setGetCurrencyCallDone(true);
        });
    }
  }, [isAuthenticated, userId]);

  let notificationStream = (
    <li id="navbar-stream" className="navbar-icon-item navbar-stream">
      <span className="nav-robux-icon rbx-menu-item">
        <span
          id="notification-stream-icon-container"
          notification-stream-indicator="true"
        />
      </span>
    </li>
  );
  try {
    angular.module("notificationStreamIcon");
    angular.module("notificationStream");
    notificationStream = <NotificationStreamPopover />;
  } catch (err) {
    console.log(err);
  }

  return (
    <ul className="nav navbar-right rbx-navbar-icon-group">
      <AgeBracketDisplay />
      <UniverseSearchIcon {...{ translate, toggleUniverseSearch }} />
      {notificationStream}
      <BuyRobuxPopover
        {...{ translate, robuxAmount, isGetCurrencyCallDone, robuxError }}
      />
      <SettingsPopover {...{ translate, accountNotificationCount }} />
    </ul>
  );
}

HeaderIconsGroup.defaultProps = {
  accountNotificationCount: 0,
};

HeaderIconsGroup.propTypes = {
  translate: PropTypes.func.isRequired,
  accountNotificationCount: PropTypes.number,
  toggleUniverseSearch: PropTypes.func.isRequired,
};

export default HeaderIconsGroup;
