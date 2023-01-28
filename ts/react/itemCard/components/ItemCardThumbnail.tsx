import React from "react";
import { TranslateFunction } from "react-utilities";
import ItemCardStatus from "./ItemCardStatus";
import ItemCardRestrictions from "./ItemCardRestrictions";

export type TItemCardThumbnailProps = {
  type: string;
  itemStatus: Array<string> | undefined;
  itemRestrictions: Array<string> | undefined;
  thumbnail2d: React.ReactNode;
  translate: TranslateFunction;
};

export function ItemCardThumbnail({
  type,
  itemStatus,
  itemRestrictions,
  thumbnail2d,
  translate,
}: TItemCardThumbnailProps): JSX.Element {
  return (
    <div className="item-card-link">
      <div className="item-card-thumb-container">
        {thumbnail2d}
        <ItemCardStatus itemStatus={itemStatus} translate={translate} />
        <ItemCardRestrictions type={type} itemRestrictions={itemRestrictions} />
      </div>
    </div>
  );
}
export default ItemCardThumbnail;
