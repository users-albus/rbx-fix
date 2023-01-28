import React from "react";
import PropTypes from "prop-types";
import { withTranslations } from "react-utilities";
import { translation } from "./app.config";
import PhoneUpsellModalContainer from "./phoneUpsellModal/container/PhoneUpsellModalContainer";
import { PhoneUpsellModalStateProvider } from "./phoneUpsellModal/stores/PhoneUpsellModalStoreContext";

function PhoneUpsellApp({ translate, onClose, origin }) {
  return (
    <PhoneUpsellModalStateProvider>
      <PhoneUpsellModalContainer
        translate={translate}
        onClose={onClose}
        origin={origin}
      />
    </PhoneUpsellModalStateProvider>
  );
}

PhoneUpsellApp.propTypes = {
  translate: PropTypes.func.isRequired,
  origin: PropTypes.string,
  onClose: PropTypes.func,
};

PhoneUpsellApp.defaultProps = {
  origin: undefined,
  onClose: () => null,
};

export default withTranslations(PhoneUpsellApp, translation);
