import React from "react";
import { withTranslations, WithTranslationsProps } from "react-utilities";
import { signupTranslationConfig } from "../translation.config";
import { signupFormStrings } from "../constants/signupConstants";
import { FormFieldStatus } from "../../common/types/signupTypes";
import {
  sendUsernameFocusEvent,
  sendUsernameOffFocusEvent,
} from "../services/eventService";

export type usernameInputProps = {
  username: string;
  usernameStatus: FormFieldStatus;
  handleUsernameChange: (username: string) => void;
  usernameErrorMessage: string;
  disabled: boolean;
  usernameRef: React.RefObject<HTMLInputElement>;
  translate: WithTranslationsProps["translate"];
};

const UsernameInput = ({
  username,
  handleUsernameChange,
  usernameStatus,
  usernameErrorMessage,
  disabled,
  usernameRef,
  translate,
}: usernameInputProps): JSX.Element => {
  return (
    <div
      className={`${
        usernameStatus === FormFieldStatus.Valid ? "has-success" : ""
      } ${
        usernameStatus === FormFieldStatus.Invalid ? "has-error" : ""
      } form-group`}
    >
      <label htmlFor="landing-username" className="font-caption-header">
        {translate(signupFormStrings.Username)}
      </label>
      <input
        id="signup-username"
        name="signupUsername"
        className="form-control font-body text input-field"
        type="text"
        autoComplete="signup-username"
        placeholder={translate(signupFormStrings.UsernamePlaceholder)}
        value={username}
        onChange={(e) => handleUsernameChange(e.target.value)}
        onFocus={sendUsernameFocusEvent}
        onBlur={sendUsernameOffFocusEvent}
        disabled={disabled}
        ref={usernameRef}
      />
      <p
        id="signup-usernameInputValidation"
        className="form-control-label font-caption-body input-validation text-error"
        aria-live="polite"
      >
        {usernameErrorMessage ? translate(usernameErrorMessage) : ""}
      </p>
    </div>
  );
};

export default withTranslations(UsernameInput, signupTranslationConfig);
