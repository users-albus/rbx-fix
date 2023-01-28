import React from "react";
import classNames from "classnames";

export type TBannerProps = {
  bannerTitle: string;
  bannerContent: string;
  className: string;
  icon: string;
};

export function Banner({
  bannerTitle,
  bannerContent,
  className,
  icon,
}: TBannerProps): JSX.Element {
  const bannerClass = classNames("common-banner", "border", className);
  return (
    <div className={bannerClass}>
      {icon && <div className={`icon-${icon} banner-icon`} />}
      <div className="banner-info">
        <h5 className="banner-title">{bannerTitle}</h5>
        <p className="banner-content font-small">{bannerContent}</p>
      </div>
    </div>
  );
}

export default Banner;
