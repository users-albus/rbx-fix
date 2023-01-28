import React from "react";
import PropTypes from "prop-types";
import ClassNames from "classnames";
import { Link } from "react-style-guide";
import links from "../constants/linkConstants";
import navigationUtil from "../util/navigationUtil";
import layoutConstants from "../constants/layoutConstants";

const { settingsUrl, quickLoginUrl } = links;
const { logoutUser } = navigationUtil;
const { quickLogin, settings, logout } = layoutConstants.menuKeys;
function SettingsMenu({
  translate,
  accountNotificationCount,
  isCrossDeviceLoginCodeValidationDisplayed,
}) {
  const notificationClasses = ClassNames(
    "notification-blue notification nav-setting-highlight",
    {
      hidden: accountNotificationCount === 0,
    }
  );

  return Object.entries(settingsUrl).map(([urlKey, { url, label }]) => (
    <li>
      {urlKey === logout && (
        <Link
          className="rbx-menu-item logout-menu-item"
          key={urlKey}
          onClick={logoutUser}
          url="#"
        >
          {translate(label)}
        </Link>
      )}
      {urlKey === quickLogin && isCrossDeviceLoginCodeValidationDisplayed && (
        <Link className="rbx-menu-item" key={urlKey} url={quickLoginUrl}>
          {translate(label)}
        </Link>
      )}
      {urlKey !== logout && urlKey !== quickLogin && (
        <Link cssClasses="rbx-menu-item" key={urlKey} url={url}>
          {translate(label)}
          {urlKey === settings && (
            <span className={notificationClasses}>
              {accountNotificationCount}
            </span>
          )}
        </Link>
      )}
    </li>
  ));
}
SettingsMenu.defaultProps = {
  accountNotificationCount: 0,
  isCrossDeviceLoginCodeValidationDisplayed: false,
};
SettingsMenu.propTypes = {
  translate: PropTypes.func.isRequired,
  accountNotificationCount: PropTypes.number,
  isCrossDeviceLoginCodeValidationDisplayed: PropTypes.bool,
};

export default SettingsMenu;
