import React from "react";
import { ready } from "core-utilities";
import { render } from "react-dom";
import Roblox from "Roblox";
import LeftNavigation from "./containers/LeftNavigation";
import NavigationRightHeader from "./containers/NavigationRightHeader";
import navigationUtil from "./util/navigationUtil";
import MenuIcon from "./containers/MenuIcon";

import "../../../css/navigation/navigation.scss";
import "../../../html/navigation.html";

const { logoutAndRedirect } = navigationUtil;
const rightNavigationHeaderContainerId = "right-navigation-header";
const leftNavigationContainerId = "left-navigation-container";
const menuIconContainerId = "header-menu-icon";

// expose navigation service to external apps
// if adding new values, be careful previous ones aren't overridden
Roblox.NavigationService = { ...Roblox.NavigationService, logoutAndRedirect };

// The anchor html elements lives in navigation.html
// Mounting components seperatly to avoid hydrating
// components that do not need to be server rendered.
ready(() => {
  if (document.getElementById(menuIconContainerId)) {
    render(<MenuIcon />, document.getElementById(menuIconContainerId));
  }

  if (document.getElementById(rightNavigationHeaderContainerId)) {
    render(
      <NavigationRightHeader />,
      document.getElementById(rightNavigationHeaderContainerId)
    );
  }

  if (document.getElementById(leftNavigationContainerId)) {
    render(
      <LeftNavigation />,
      document.getElementById(leftNavigationContainerId)
    );
  }
});
