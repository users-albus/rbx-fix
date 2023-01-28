import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

function TabNav({ isActive, className, children, ...otherProps }) {
  const tabClass = classNames(className, "rbx-tab", { active: isActive });
  return (
    <li {...otherProps} role="tab" className={tabClass}>
      {children}
    </li>
  );
}

TabNav.defaultProps = {
  isActive: false,
  className: null,
  children: null,
};

TabNav.propTypes = {
  isActive: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
};

export default TabNav;
