import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

function NativeDropdown({
  selectionItems,
  selectedItemvalue,
  className,
  ...otherProps
}) {
  const wrapperClasses = classNames("rbx-select-group select-group", className);

  return (
    <div className={wrapperClasses}>
      <select
        value={selectedItemvalue}
        className="input-field rbx-select select-option"
        {...otherProps}
      >
        {selectionItems.map((selectionItem) => (
          <option key={selectionItem.value} value={selectionItem.value}>
            {selectionItem.label}
          </option>
        ))}
      </select>
      <span className="icon-arrow icon-down-16x16" />
    </div>
  );
}

NativeDropdown.defaultProps = {
  selectionItems: [],
  selectedItemvalue: null,
  className: null,
};

NativeDropdown.propTypes = {
  selectionItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })
  ),
  selectedItemvalue: PropTypes.string,
  className: PropTypes.string,
};

export default NativeDropdown;
