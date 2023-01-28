import Roblox from "Roblox";
import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import EmailVerifyCodeModalContainer, {
  emailVerifyCodeModalContainerProps,
} from "./containers/EmailVerifyCodeModalContainer";
import { EmailVerifyCodeModalStateProvider } from "./store/emailVerifyCodeModalStoreContext";
import "../../../css/emailVerifyCodeModal/emailVerifyCodeModal.scss";

export const renderEmailVerifyCodeModal = ({
  emailVerifyCodeError,
  containerId,
  codeLength,
  onEmailCodeEntered,
  onModalAbandoned,
  enterEmailTitle,
  enterEmailDescription,
  enterCodeTitle,
  enterCodeDescription,
  origin,
  translate,
}: emailVerifyCodeModalContainerProps): boolean => {
  const container = document.getElementById(containerId);
  if (container != null) {
    // Remove any existing instances of the app.
    unmountComponentAtNode(container);

    render(
      <EmailVerifyCodeModalStateProvider>
        <EmailVerifyCodeModalContainer
          emailVerifyCodeError={emailVerifyCodeError}
          containerId={containerId}
          codeLength={codeLength}
          onEmailCodeEntered={onEmailCodeEntered}
          onModalAbandoned={onModalAbandoned}
          enterEmailTitle={enterEmailTitle}
          enterEmailDescription={enterEmailDescription}
          enterCodeTitle={enterCodeTitle}
          enterCodeDescription={enterCodeDescription}
          origin={origin}
          translate={translate}
        />
      </EmailVerifyCodeModalStateProvider>,
      container
    );
    return true;
  }
  return false;
};

const EmailVerifyCodeModalService = {
  renderEmailVerifyCodeModal,
};

// EmailVerifyCodeModalService needs to be assigned to Roblox, as it will be used in other
// flows where veryfing a code from email is necessary, such as making adjustments to account
// settings, so we will need to render this modal on multiple pages
Object.assign(Roblox, {
  EmailVerifyCodeModalService,
});

export default renderEmailVerifyCodeModal;
