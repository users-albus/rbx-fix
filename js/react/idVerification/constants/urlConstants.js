import { EnvironmentUrls } from "Roblox";

const { apiGatewayUrl, accountSettingsApi, accountInformationApi, voiceApi } =
  EnvironmentUrls;

const startVeriffIdVerificationUrlConfig = () => ({
  retryable: true,
  withCredentials: true,
  url: `${apiGatewayUrl}/age-verification-service/v1/veriff-id-verification/start-verification`,
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

const getVerifiedAgeUrlConfig = () => ({
  retryable: true,
  withCredentials: true,
  url: `${apiGatewayUrl}/age-verification-service/v1/age-verification/verified-age`,
});

const getVerificationStatusUrlConfig = () => ({
  retryable: true,
  withCredentials: true,
  url: `${apiGatewayUrl}/age-verification-service/v1/veriff-id-verification/verified-status`,
});

const getAccountInfoMetadataUrlConfig = () => ({
  retryable: true,
  withCredentials: true,
  url: `${accountInformationApi}/v1/metadata`,
});

const getShowOverlayUrlConfig = () => ({
  retryable: true,
  withCredentials: true,
  url: `${voiceApi}/v1/settings/verify/show-overlay`,
});

const getPostOptUserInToVoiceChatUrlConfig = () => ({
  withCredentials: true,
  url: `${voiceApi}/v1/settings/user-opt-in`,
});

const getRecordUserSeenUpsellModalUrlConfig = () => ({
  withCredentials: true,
  url: `${voiceApi}/v1/settings/record-user-seen-upsell-modal`,
});

export {
  startVeriffIdVerificationUrlConfig,
  getEmailUrlConfig,
  getEmailVerificationUrlConfig,
  getVerifiedAgeUrlConfig,
  getVerificationStatusUrlConfig,
  getAccountInfoMetadataUrlConfig,
  getShowOverlayUrlConfig,
  getPostOptUserInToVoiceChatUrlConfig,
  getRecordUserSeenUpsellModalUrlConfig,
};
