import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Popover } from "react-style-guide";
import SettingsIcon from "./SettingsIcon";
import SettingsMenu from "./SettingsMenu";
import navigationUtil from "../util/navigationUtil";
// disabling the metadata call since this is fully released.
// this will also reduce the traffic. ticket to remove comments: WEBGROW-10026
// import navigationService from '../services/navigationService';

function SettingsPopover({ translate, accountNotificationCount }) {
  const [
    isCrossDeviceLoginCodeValidationDisplayed,
    setCrossDeviceLoginCodeValidationDisplayed,
  ] = useState(false);
  const ref = useRef();

  useEffect(() => {
    setCrossDeviceLoginCodeValidationDisplayed(true);
    // navigationService.getAuthTokenMetadata().then(
    //   data => {
    //     if (data?.IsCodeValidationDisplayed) {
    //       setCrossDeviceLoginCodeValidationDisplayed(true);
    //     }
    //   },
    //   e => {
    //     console.debug('e: ', e);
    //   }
    // );
  }, []);

  return (
    <li id="navbar-settings" ref={ref} className="navbar-icon-item">
      <Popover
        id="settings-popover"
        trigger="click"
        placement="bottom"
        className={navigationUtil.getThemeClass()}
        containerPadding={20}
        button={
          <button type="button" className="btn-navigation-nav-settings-md">
            <SettingsIcon accountNotificationCount={accountNotificationCount} />
          </button>
        }
        container={ref.current}
        role="menu"
      >
        <div className={navigationUtil.getThemeClass()}>
          <ul id="settings-popover-menu" className="dropdown-menu">
            <SettingsMenu
              isCrossDeviceLoginCodeValidationDisplayed={
                isCrossDeviceLoginCodeValidationDisplayed
              }
              translate={translate}
              accountNotificationCount={accountNotificationCount}
            />
          </ul>
        </div>
      </Popover>
    </li>
  );
}

SettingsPopover.defaultProps = {
  accountNotificationCount: 0,
};

SettingsPopover.propTypes = {
  translate: PropTypes.func.isRequired,
  accountNotificationCount: PropTypes.number,
};

export default SettingsPopover;
