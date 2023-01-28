import cryptoUtil from "../utilities/boundAuthTokens/crypto/cryptoUtil";
import dataStores from "./dataStoreManagement/stores/dataStores";
import deepLinkService from "./services/deepLinkService/deepLinkService";
import eventStreamService from "./services/eventStreamService/eventStreamService";
import hybridService from "./services/hybridService";
import hybridResponseService from "./services/hybridResponseService";
import localStorageNames from "./services/localStorageService/localStorageNames";
import localStorageService from "./services/localStorageService/localStorageService";
import sessionStorageService from "./services/sessionStorageService/sessionStorageService";
import metricsService from "./services/metricsService/metricsService";
import paymentFlowAnalyticsService from "./services/paymentFlowAnalyticsService/paymentFlowAnalyticsService";
import playGameService from "./services/playGames/playGameService";
import userInfoService from "./services/userInfoService/userInfoService";
import elementVisibilityService from "./services/elementVisibilityService/elementVisibilityService";
import entityUrl from "./utils/entityUrl/entityUrl";
import initializeGenericChallengeInterceptor from "./utils/jquery/genericChallengeInterceptor";
import upsellUtil from "./utils/upsellUtil";

window.CoreRobloxUtilities = {
  cryptoUtil,
  dataStores,
  entityUrl,
  eventStreamService,
  initializeGenericChallengeInterceptor,
  paymentFlowAnalyticsService,
  hybridService,
  hybridResponseService,
  localStorageService,
  localStorageNames,
  sessionStorageService,
  playGameService,
  userInfoService,
  metricsService,
  deepLinkService,
  elementVisibilityService,
  upsellUtil,
};
