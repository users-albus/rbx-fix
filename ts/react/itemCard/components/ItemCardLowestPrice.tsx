import React from "react";
import { TranslateFunction } from "react-utilities";
import { getNumberFormat } from "../utils/parsingUtils";

export type TItemCardLowestPriceProps = {
  price: number | undefined;
  lowestPrice: number | undefined;
  translate: TranslateFunction;
};

export function ItemCardLowestPrice({
  price,
  lowestPrice,
  translate,
}: TItemCardLowestPriceProps): JSX.Element {
  return (
    <React.Fragment>
      {lowestPrice !== undefined && lowestPrice >= 0 && price !== undefined && (
        <div className="text-overflow item-card-label">
          <span>{translate("Label.Card.PriceWas")}</span>
          <span className="icon-robux-gray-16x16" />
          <span className="strike-through">{getNumberFormat(price)}</span>
        </div>
      )}
    </React.Fragment>
  );
}
export default ItemCardLowestPrice;
