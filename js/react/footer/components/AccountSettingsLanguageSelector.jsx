import React from "react";
import PropTypes from "prop-types";
import { authenticatedUser } from "header-scripts";
import { withTranslations } from "react-utilities";
import LanguageSelector from "../containers/LanguageSelector";
import { translationConfig } from "../app.config";
import dispatchHybridEventForLanguageChange from "../utils/dispatchHybridEventForLanguageChange";

function AccountSettingsLanguageSelector({ translate }) {
  const isAuthenticatedUser = authenticatedUser?.isAuthenticated;

  const handleLanguageChange = (selectedLocale) => {
    const { locale } = selectedLocale;
    if (locale) {
      // trigger hybrid event to mobile apps to reload the app shell in new language
      dispatchHybridEventForLanguageChange(locale, () => {
        console.debug(`Language Change Hybrid Event: ${locale}`);
      });
    }
    window.location.reload();
  };

  return (
    <div className="col-xs-12 col-sm-6">
      <LanguageSelector
        onLanguageChange={handleLanguageChange}
        translate={translate}
        isAuthenticatedUser={isAuthenticatedUser}
        isNative
      />
    </div>
  );
}

AccountSettingsLanguageSelector.propTypes = {
  translate: PropTypes.func.isRequired,
};

export default withTranslations(
  AccountSettingsLanguageSelector,
  translationConfig
);
