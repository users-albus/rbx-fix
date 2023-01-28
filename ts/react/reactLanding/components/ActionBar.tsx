import React from "react";
import { withTranslations, WithTranslationsProps } from "react-utilities";
import { signupTranslationConfig } from "../translation.config";
import {
  urlConstants,
  landingPageStrings,
} from "../constants/landingConstants";

const ActionBar = ({ translate }: WithTranslationsProps): JSX.Element => {
  return (
    <div id="action-bar-container">
      <div id="action-bar">
        <a
          id="main-login-button"
          className="btn-cta-md"
          href={urlConstants.loginLink}
          // TODO: hide if from korea id verification flow
        >
          {translate(landingPageStrings.logIn)}
        </a>
      </div>
    </div>
  );
};

export default withTranslations(ActionBar, signupTranslationConfig);
