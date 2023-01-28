import { EnvironmentUrls } from "Roblox";
import { paymentFlowAnalyticsService } from "core-roblox-utilities";
import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { SimpleModal } from "react-style-guide";
import { authenticatedUser } from "header-scripts";
import links from "../constants/linkConstants";
import layoutConstants from "../constants/layoutConstants";
import LeftNavItem from "./LeftNavItem";
import SponsoredEventsContainer from "../containers/SponsoredEventsContainer";
import navigationUtil from "../util/navigationUtil";

const { shopEvents } = layoutConstants;

function ScrollList({ translate, ...props }) {
  const [isShopModalOpen, setShopModalOpen] = useState(false);

  const onClickShopLink = useCallback(() => {
    setShopModalOpen((isOpen) => !isOpen);
    navigationUtil.sendClickEvent(shopEvents.clickMerchandise);
  }, []);

  const closeShopModel = () => {
    setShopModalOpen(false);
  };

  const goToAmazonStop = () => {
    const decodedUrl = decodeURIComponent(EnvironmentUrls.amazonWebStoreLink);
    window.open(decodedUrl, "_blank");
    navigationUtil.sendClickEvent(shopEvents.goToAmazonStore);
  };

  const listNavItems = Object.values(links.scrollListItems).map((item) => (
    <LeftNavItem
      key={item.name}
      {...{ translate, onClickShopLink, ...item, ...props }}
    />
  ));

  const onUpgradeBtnClick = () => {
    paymentFlowAnalyticsService.sendUserPurchaseFlowEvent(
      paymentFlowAnalyticsService.ENUM_TRIGGERING_CONTEXT.WEB_PREMIUM_PURCHASE,
      false,
      paymentFlowAnalyticsService.ENUM_VIEW_NAME.LEFT_NAVIGATION_BAR,
      paymentFlowAnalyticsService.ENUM_PURCHASE_EVENT_TYPE.USER_INPUT,
      authenticatedUser.isPremiumUser
        ? paymentFlowAnalyticsService.ENUM_VIEW_MESSAGE.PREMIUM
        : paymentFlowAnalyticsService.ENUM_VIEW_MESSAGE.GET_PREMIUM
    );
  };

  const upgradeBtn = (
    <li className="rbx-upgrade-now">
      <a
        href={links.upgradeButton.url}
        className="btn-growth-md btn-secondary-md"
        onClick={onUpgradeBtnClick}
        id="upgrade-now-button"
      >
        {translate(links.upgradeButton.labelTranslationKey)}
      </a>
    </li>
  );

  const modalBody = (
    <React.Fragment>
      <p className="shop-description">
        {translate("Description.RetailWebsiteRedirect")}
      </p>
      <p className="shop-warning">
        {translate("Description.PurchaseAgeWarning")}
      </p>
    </React.Fragment>
  );
  const shopModal = (
    <SimpleModal
      title={translate("Heading.LeavingRoblox")}
      body={modalBody}
      show={isShopModalOpen}
      actionButtonShow
      actionButtonText={translate("Action.Continue")}
      neutralButtonText={translate("Action.Cancel")}
      onAction={goToAmazonStop}
      onNeutral={closeShopModel}
      onClose={closeShopModel}
    />
  );

  return (
    <ul className="left-col-list">
      {listNavItems}
      {upgradeBtn}
      <SponsoredEventsContainer translate={translate} />
      {shopModal}
    </ul>
  );
}

ScrollList.defaultProps = {
  sponsoredPagesData: [],
};

ScrollList.propTypes = {
  sponsoredPagesData: PropTypes.instanceOf(Array),
  translate: PropTypes.func.isRequired,
};

export default ScrollList;
