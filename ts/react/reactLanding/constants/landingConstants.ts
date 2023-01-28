import { EnvironmentUrls } from "Roblox";

export const experimentLayer = "Website.LandingPage";

export const urlConstants = {
  contentRatingLogoPolicy: `${EnvironmentUrls.universalAppConfigurationApi}/v1/behaviors/content-rating-logo/content`,
  loginLink: `${EnvironmentUrls.websiteUrl}/login`,
  brazilContentRatingGuide:
    "https://www.justica.gov.br/seus-direitos/classificacao/guia-pratico",
  italyContentRatingGuide: "https://pegi.info/",
};

export const landingPageStrings = {
  amazonStore: "Label.RobloxAmazonStore",
  appStore: "Label.RobloxAppStore",
  brazilContentRatingTitle: "Label.BrazilContentRatingLogoTitle",
  brazilContentRatingSubtitle: "Label.BrazilContentRatingLogoSubtitle",
  continue: "Action.Continue",
  cancel: "Action.Cancel",
  externalWebsiteRedirect: "Description.ExternalWebsiteRedirect",
  googlePlay: "Label.GetOnGooglePlay",
  italyContentRatingTitle: "Label.ItalyContentRatingLogoTitle",
  leavingRoblox: "Heading.LeavingRoblox",
  logIn: "Action.LogInCapitalized",
  robloxOnDevice: "Heading.RobloxOnDevice",
  windowsStore: "Label.RobloxWindowsStore",
  xbox: "Label.RobloxOnXbox",
};

type appStoreLinkStrings = {
  href: string;
  className: string;
  name: string;
  title: string;
};

export const appStoreLinkConstants: appStoreLinkStrings[] = [
  {
    href: EnvironmentUrls.appStoreLink,
    className: "apple-badge",
    name: "apple",
    title: landingPageStrings.appStore,
  },
  {
    href: EnvironmentUrls.googlePlayStoreLink,
    className: "google-badge",
    name: "google",
    title: landingPageStrings.googlePlay,
  },
  {
    href: EnvironmentUrls.amazonStoreLink,
    className: "amazon-badge",
    name: "amazon",
    title: landingPageStrings.amazonStore,
  },
  {
    href: EnvironmentUrls.xboxStoreLink,
    className: "xbox-badge",
    name: "xbox",
    title: landingPageStrings.xbox,
  },
  {
    href: EnvironmentUrls.windowsStoreLink,
    className: "microsoft-badge",
    name: "microsoft",
    title: landingPageStrings.windowsStore,
  },
];
