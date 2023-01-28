import { EnvironmentUrls } from "Roblox";

const {
  accountSettingsApi,
  authApi,
  apiGatewayUrl,
  apiProxyUrl,
  accountInformationApi,
} = EnvironmentUrls;

const getPhonePrefixesConfig = () => ({
  retryable: true,
  withCredentials: true,
  url: `${apiProxyUrl}/v1/countries/phone-prefix-list`,
});

const getEmailUrlConfig = () => ({
  retryable: true,
  withCredentials: true,
  url: `${accountSettingsApi}/v1/email`,
});

const getEmailVerificationUrlConfig = () => ({
  retryable: true,
  withCredentials: true,
  url: `${accountSettingsApi}/v1/email/verify`,
});

const getMetadataV2UrlConfig = () => ({
  retryable: true,
  withCredentials: true,
  url: `${authApi}/v2/metadata`,
});

const setPhoneNumberConfig = () => ({
  retryable: true,
  withCredentials: true,
  url: `${accountInformationApi}/v1/phone`,
});

const verifyPhoneNumberConfig = () => ({
  retryable: true,
  withCredentials: true,
  url: `${accountInformationApi}/v1/phone/verify`,
});

const resendCodeToPhoneNumberConfig = () => ({
  retryable: true,
  withCredentials: true,
  url: `${accountInformationApi}/v1/phone/resend`,
});

const getLogoutContactMethodModalExperimentConfig = () => ({
  retryable: true,
  withCredentials: true,
  url: `${apiGatewayUrl}/product-experimentation-platform/v1/projects/1/layers/Website.Logout.ContactMethodModal/values`,
});

const getPhoneDiscoverabilityPageMetadataConfig = () => ({
  retryable: true,
  withCredentials: true,
  url: `${apiGatewayUrl}/user-settings-api/v1/user-settings/metadata`,
});

const setPhoneDiscoverabilityConsentConfig = () => ({
  retryable: true,
  withCredentials: true,
  url: `${apiGatewayUrl}/user-settings-api/v1/user-settings`,
});

const verificationUpsellModalLogoutExperimentParameters = {
  header: "alt_title",
  body: "alt_body",
  primaryButton: "alt_primary_button_text",
  secondaryButton: "alt_secondary_button_text",
};

const supportPageUrl = "https://en.help.roblox.com/hc/articles/203313350";

export {
  getPhonePrefixesConfig,
  getEmailUrlConfig,
  getEmailVerificationUrlConfig,
  getMetadataV2UrlConfig,
  setPhoneNumberConfig,
  verifyPhoneNumberConfig,
  resendCodeToPhoneNumberConfig,
  getLogoutContactMethodModalExperimentConfig,
  getPhoneDiscoverabilityPageMetadataConfig,
  setPhoneDiscoverabilityConsentConfig,
  verificationUpsellModalLogoutExperimentParameters,
  supportPageUrl,
};
