import React from "react";
import { TranslateFunction } from "react-utilities";
import { getNumberFormat } from "../utils/parsingUtils";

export type TItemCardUnitsRemainingProps = {
  unitsAvailableForConsumption: number | undefined;
  translate: TranslateFunction;
};

export function ItemCardUnitsRemaining({
  unitsAvailableForConsumption,
  translate,
}: TItemCardUnitsRemainingProps): JSX.Element {
  return (
    <React.Fragment>
      {unitsAvailableForConsumption !== undefined &&
        unitsAvailableForConsumption > 0 && (
          <div className="text-overflow item-card-label">
            <span>{translate("Label.Card.Remaining")}</span>
            <span>{getNumberFormat(unitsAvailableForConsumption)}</span>
          </div>
        )}
    </React.Fragment>
  );
}
export default ItemCardUnitsRemaining;
