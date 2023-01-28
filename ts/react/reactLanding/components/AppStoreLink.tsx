/* eslint-disable jsx-a11y/anchor-has-content */

import React from "react";
import { withTranslations, WithTranslationsProps } from "react-utilities";
import { landingTranslationConfig } from "../translation.config";

type appStoreLinkProps = {
  name: string;
  className: string;
  href: string;
  title: string;
  onAppClick: (appName: string) => void;
  translate: WithTranslationsProps["translate"];
};

const AppStoreLink = ({
  name,
  className,
  href,
  title,
  onAppClick,
  translate,
}: appStoreLinkProps): JSX.Element => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`${className} app-store-logo`}
      onClick={() => onAppClick(name)}
      aria-label={translate(title)}
      title={translate(title)}
    />
  );
};

export default withTranslations(AppStoreLink, landingTranslationConfig);
