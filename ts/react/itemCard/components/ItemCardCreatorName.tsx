import React from "react";
import { TranslateFunction } from "react-utilities";
import { escapeHtml } from "core-utilities";
import itemCardUtils from "../utils/itemCardUtils";

export type TItemCardCreatorNameProps = {
  creatorName: string;
  creatorType: string;
  creatorTargetId: number;
  translate: TranslateFunction;
};

export function ItemCardCreatorName({
  creatorName,
  creatorType,
  creatorTargetId,
  translate,
}: TItemCardCreatorNameProps): JSX.Element {
  return (
    <React.Fragment>
      {creatorName !== undefined &&
        creatorTargetId !== undefined &&
        creatorType !== undefined &&
        !(creatorTargetId === 1 && creatorType === "User") && (
          <div className="text-overflow item-card-creator">
            <span
              dangerouslySetInnerHTML={{
                __html: translate("Label.ByCreatorLink", {
                  linkStart: `<a target=_self class='creator-name text-link' href='${itemCardUtils.getProfileLink(
                    creatorTargetId,
                    creatorType,
                    escapeHtml()(creatorName)
                  )}'>`,
                  linkEnd: "</a>",
                  creator: escapeHtml()(creatorName),
                }),
              }}
            />
          </div>
        )}
    </React.Fragment>
  );
}
export default ItemCardCreatorName;
