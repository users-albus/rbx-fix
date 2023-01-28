import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

function TabsContainer({ isScrollable, className, children, ...otherProps }) {
  const tabsClass = classNames(className, "rbx-tabs-horizontal", {
    "rbx-scrollable-tabs-horizontal": isScrollable,
  });

  return (
    <div {...otherProps} className={tabsClass}>
      {children}
    </div>
  );
}

TabsContainer.defaultProps = {
  children: null,
  className: null,
  isScrollable: false,
};

TabsContainer.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  isScrollable: PropTypes.bool,
};

export default TabsContainer;
