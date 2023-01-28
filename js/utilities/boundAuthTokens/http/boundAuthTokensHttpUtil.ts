import { CurrentUser } from "Roblox";
import UrlConfig from "../../../core/http/interfaces/UrlConfig";
import { getOrCreateCryptoDB, getCryptoKeyPair } from "../store/indexedDB";
import cryptoUtil from "../crypto/cryptoUtil";

const SEPARATOR = "|";
let clientCryptoKeyPair: CryptoKeyPair;

type TbatWhiteListedApiObj = {
  apiSite: string;
  sampleRate: string;
};

type TbatWhiteListObj = {
  Whitelist: TbatWhiteListedApiObj[];
};
const hbaMeta = cryptoUtil.getHbaMeta();

const {
  isBoundAuthTokenEnabled,
  boundAuthTokenWhitelist: batWhiteListStr,
  hbaIndexedDBName,
  hbaIndexedDBObjStoreName,
} = hbaMeta;

const userId = CurrentUser?.userId?.toString();

let batWhiteListArr: TbatWhiteListedApiObj[];
try {
  const batWhiteListObj = JSON.parse(batWhiteListStr) as TbatWhiteListObj;
  batWhiteListArr = batWhiteListObj.Whitelist;
} catch {
  batWhiteListArr = [];
}
/**
 * Check if a request should attach bound auth token
 *
 * @param {String} url
 * @returns a boolean
 */
export function shouldRequestWithBoundAuthToken(url: string): boolean {
  try {
    // Allow BAT header for the request when all the following are met
    // 1. the user is authenticated
    // 2. indexedDB is enabled
    // 3. bat is enabled for all or url is in the whitelisted url for BAT
    const hit =
      CurrentUser.isAuthenticated &&
      hbaIndexedDBName &&
      hbaIndexedDBObjStoreName &&
      (isBoundAuthTokenEnabled ||
        (batWhiteListArr.length > 0 &&
          batWhiteListArr.some((ele) => {
            return (
              url.includes(ele.apiSite) &&
              Math.floor(Math.random() * 100) < Number(ele.sampleRate)
            );
          })));
    return hit;
  } catch {
    return false;
  }
}

/**
 * Generate a bound auth token
 *
 * @param {UrlConfig} urlConfig
 * @returns a bound auth token
 */
export async function generateBoundAuthToken(
  urlConfig: UrlConfig
): Promise<string> {
  try {
    // step 1 get the key pair from indexedDB with userId
    if (!clientCryptoKeyPair) {
      const db = getOrCreateCryptoDB(
        hbaIndexedDBName,
        hbaIndexedDBObjStoreName
      );
      clientCryptoKeyPair = await getCryptoKeyPair(userId, db);
    }

    // if no key is found, return empty.
    // NOTE: this could be caused by IXP returning false from login/signup upstream
    // while the feature setting is on. BAT will only be available after SAI is enabled and key pairs are generated.
    if (!clientCryptoKeyPair) {
      return "";
    }

    // step 2 get the timeStamp
    const clientEpochTimestamp = Math.floor(Date.now() / 1000).toString();

    // step 3 hash request body
    let strToHash;
    if (typeof urlConfig.data === "object") {
      strToHash = JSON.stringify(urlConfig.data);
    } else if (typeof urlConfig.data === "string") {
      strToHash = urlConfig.data;
    }

    const hashedRequestBody = await cryptoUtil.hashStringWithSha256(strToHash);

    // step 4 payload to sign
    const payloadToSign = [hashedRequestBody, clientEpochTimestamp].join(
      SEPARATOR
    );

    // step 5 generate BAT signature
    const batSignature = await cryptoUtil.sign(
      clientCryptoKeyPair.privateKey,
      payloadToSign
    );

    return [hashedRequestBody, clientEpochTimestamp, batSignature].join(
      SEPARATOR
    );
  } catch (e) {
    console.warn("bat generation error: ", e);
    return "";
  }
}

/**
 * Build a urlconfig with Bound Auth Token
 *
 * @param {UrlConfig} urlConfig
 * @returns a urlConfig with bound auth token attached in the header
 */
export async function buildConfigBoundAuthToken(
  urlConfig: UrlConfig
): Promise<UrlConfig> {
  if (!shouldRequestWithBoundAuthToken(urlConfig.url)) {
    return urlConfig;
  }
  // step 1 call generateBoundAuthToken
  const batString = await generateBoundAuthToken(urlConfig);

  // step 2 attach it to the header of the request
  const config = { ...urlConfig };
  if (batString) {
    config.headers = {
      ...config.headers,
      "x-bound-auth-token": batString,
    };
  }

  return config;
}

export default {
  shouldRequestWithBoundAuthToken,
  generateBoundAuthToken,
  buildConfigBoundAuthToken,
};
