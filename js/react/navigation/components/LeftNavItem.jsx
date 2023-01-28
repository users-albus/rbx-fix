import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-style-guide";
import { abbreviateNumber, numberFormat } from "core-utilities";
import { dataStores } from "core-roblox-utilities";
import links from "../constants/linkConstants";

const { maxFriendRequestNotificationCount } = dataStores.userDataStore;

function LeftNavItem({
  translate,
  idSelector,
  isModal,
  name,
  iconClass,
  labelTranslationKey,
  url,
  urlForNotification,
  onClickShopLink,
  friendsData,
  messagesData,
  tradeData,
}) {
  const notificationItems = {
    [links.scrollListItems.friends.name]: friendsData,
    [links.scrollListItems.messages.name]: messagesData,
    [links.scrollListItems.trade.name]: tradeData,
  };

  const notificationItem = notificationItems[name];

  const hrefUrl = notificationItem?.count ? urlForNotification : url;

  if (isModal)
    return (
      <li key={name}>
        <button
          id={idSelector}
          type="button"
          onClick={onClickShopLink}
          className="dynamic-overflow-container text-nav"
        >
          <div>
            <span className={iconClass} />
          </div>
          <span className="font-header-2 dynamic-ellipsis-item">
            {translate(labelTranslationKey)}
          </span>
        </button>
      </li>
    );
  return (
    <li key={name}>
      <Link
        url={hrefUrl}
        id={idSelector}
        className="dynamic-overflow-container text-nav"
      >
        <div>
          <span className={iconClass} />
        </div>
        <span className="font-header-2 dynamic-ellipsis-item">
          {translate(labelTranslationKey)}
        </span>
        {notificationItem && notificationItem.count > 0 && (
          <div className="dynamic-width-item align-right">
            <span
              className="notification-blue notification"
              title={numberFormat.getNumberFormat(notificationItem.count)}
            >
              {formatNotification(name, notificationItem.count)}
            </span>
          </div>
        )}
      </Link>
    </li>
  );
}

function formatNotification(name, count) {
  if (
    name === links.scrollListItems.friends.name &&
    count >= maxFriendRequestNotificationCount
  ) {
    return `${maxFriendRequestNotificationCount}+`;
  }
  return abbreviateNumber.getTruncValue(count, 1000);
}

LeftNavItem.defaultProps = {
  idSelector: "",
  url: "",
  urlForNotification: "",
  isModal: false,
  friendsData: {
    count: 0,
  },
  messagesData: {
    count: 0,
  },
  tradeData: {
    count: 0,
  },
};

LeftNavItem.propTypes = {
  idSelector: PropTypes.string,
  translate: PropTypes.func.isRequired,
  isModal: PropTypes.bool,
  name: PropTypes.string.isRequired,
  iconClass: PropTypes.string.isRequired,
  labelTranslationKey: PropTypes.string.isRequired,
  url: PropTypes.string,
  urlForNotification: PropTypes.string,
  onClickShopLink: PropTypes.func.isRequired,
  friendsData: PropTypes.shape({
    count: PropTypes.number,
  }),
  messagesData: PropTypes.shape({
    count: PropTypes.number,
  }),
  tradeData: PropTypes.shape({
    count: PropTypes.number,
  }),
};

export default LeftNavItem;
