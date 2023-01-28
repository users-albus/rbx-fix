/**
 * Re-authentication
 */

import { EnvironmentUrls } from "Roblox";
import UrlConfig from "../../../../../../Roblox.CoreScripts.WebApp/Roblox.CoreScripts.WebApp/js/core/http/interfaces/UrlConfig";

const URL_NOT_FOUND = "URL_NOT_FOUND";
const apiGatewayUrl = EnvironmentUrls.apiGatewayUrl ?? URL_NOT_FOUND;

const reauthenticationServiceUrl = `${apiGatewayUrl}/reauthentication-service`;

export enum ReauthenticationError {
  UNKNOWN = 1,
  REQUEST_TYPE_WAS_INVALID = 2,
  PASSWORD_INCORRECT = 3,
}

/**
 * Request Type: `POST`.
 */
export const GENERATE_TOKEN_CONFIG: UrlConfig = {
  withCredentials: true,
  url: `${reauthenticationServiceUrl}/v1/token/generate`,
  timeout: 10000,
};

export type GenerateTokenReturnType = {
  token: string;
};
