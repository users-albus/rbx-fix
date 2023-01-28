import React from "react";
import PropTypes from "prop-types";
import { withTranslations } from "react-utilities";
import { verificationTranslationConfig } from "./app.config";
import IdVerificationContainer from "./container/IdVerificationContainer";
import { IdVerificationStateProvider } from "./stores/IdVerificationStoreContext";
import { ModalEntry, IdVerificationVendor } from "./constants/viewConstants";

function App({ translate, entry, vendor }) {
  return (
    <IdVerificationStateProvider>
      <IdVerificationContainer
        translate={translate}
        entry={entry}
        vendor={vendor}
      />
    </IdVerificationStateProvider>
  );
}

App.defaultProps = {
  entry: ModalEntry.WebApp,
  vendor: IdVerificationVendor.Veriff,
};

App.propTypes = {
  translate: PropTypes.func.isRequired,
  entry: PropTypes.string,
  vendor: PropTypes.string,
};

export default withTranslations(App, verificationTranslationConfig);
