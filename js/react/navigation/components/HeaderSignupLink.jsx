import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-style-guide";
import navigationUtil from "../util/navigationUtil";

const { getSignupUrl } = navigationUtil;
const handleSignupClick = () => {
  window.location.href = getSignupUrl();
};

function HeaderSignupLink({ translate }) {
  return (
    <li className="signup-button-container">
      <Link
        onClick={handleSignupClick}
        url={getSignupUrl()}
        id="sign-up-button"
        className="rbx-navbar-signup btn-growth-sm nav-menu-title signup-button"
      >
        {translate("Label.sSignUp")}
      </Link>
    </li>
  );
}
HeaderSignupLink.propTypes = {
  translate: PropTypes.func.isRequired,
};

export default HeaderSignupLink;
