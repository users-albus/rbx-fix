import React from "react";
import PropTypes from "prop-types";

function TabNavs({ children }) {
  return (
    <ul className="nav nav-tabs" role="tablist">
      {children}
    </ul>
  );
}

TabNavs.defaultProps = {
  children: null,
};

TabNavs.propTypes = {
  children: PropTypes.node,
};

export default TabNavs;
