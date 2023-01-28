import flatpickr from "flatpickr";
import React from "react";
import Flatpickr from "react-flatpickr";
import PluginType from "../enums/PluginType";
import { pluginMap } from "../constants/datePickerConstants";
import { getDatePickerLocale } from "../utils/datePickerUtils";

export type RobloxDatePickerProps = {
  options: flatpickr.Options.Options;
  languageCode: string;
  plugin?: PluginType;
};

export function DatePicker({
  options,
  languageCode,
  plugin,
}: RobloxDatePickerProps): JSX.Element {
  const locale = getDatePickerLocale(languageCode);
  // Note: You can add multiple plugins to flatpickr, but for the time being we
  // only support adding monthSelect or weekSelect separately
  return (
    <Flatpickr
      options={{
        ...options,
        locale,
        plugins: plugin ? [pluginMap[plugin]] : [],
      }}
    >
      <input type="text" data-input className="form-control input-field" />
    </Flatpickr>
  );
}

DatePicker.pluginType = PluginType;

export default DatePicker;
