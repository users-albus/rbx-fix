import React from "react";
import ControlledFormField from "./ControlledFormField";

function TextFormField(props) {
  return (
    <ControlledFormField {...props}>
      {({ id, className, name, value, onChange, ...otherProps }) => (
        <input
          {...otherProps}
          type="text"
          id={id}
          className={className}
          name={name}
          value={value}
          onChange={onChange}
        />
      )}
    </ControlledFormField>
  );
}

export default TextFormField;
