import React, { useRef } from "react";
import { authenticatedUser } from "header-scripts";
import { Link } from "react-style-guide";
import { Thumbnail2d, ThumbnailTypes } from "roblox-thumbnails";
import {
  BadgeSizes,
  VerifiedBadgeIconContainer,
  currentUserHasVerifiedBadge,
} from "roblox-badges";
import links from "../constants/linkConstants";
import userUtil from "../util/userUtil";

function AgeBracketDisplay() {
  const renderEl = useRef(null);

  const { isUnder13 } = authenticatedUser;

  const badgeToRender =
    currentUserHasVerifiedBadge() && VerifiedBadgeIconContainer ? (
      <section
        ref={(el) => {
          renderEl.current = el;
        }}
      >
        <VerifiedBadgeIconContainer
          overrideImgClass="verified-badge-icon-header"
          size={BadgeSizes.CAPTIONHEADER}
        />
      </section>
    ) : null;

  return (
    <div className="age-bracket-label text-header">
      <Link
        className="text-link dynamic-overflow-container"
        url={links.scrollListItems.profile.url}
      >
        <span className="avatar avatar-headshot-xs">
          <Thumbnail2d
            containerClass="avatar-card-image"
            targetId={authenticatedUser.id}
            type={ThumbnailTypes.avatarHeadshot}
            altName={authenticatedUser.name}
          />
        </span>
        <span className="text-overflow age-bracket-label-username font-caption-header">
          {userUtil.nameForHeader}
        </span>
        {badgeToRender}
      </Link>
      <span className="xsmall age-bracket-label-age text-secondary">
        {isUnder13 ? "<13" : "13+"}
      </span>
    </div>
  );
}

AgeBracketDisplay.propTypes = {};

export default AgeBracketDisplay;
