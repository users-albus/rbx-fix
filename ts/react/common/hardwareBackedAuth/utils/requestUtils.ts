import { cryptoUtil } from "core-roblox-utilities";

import { ExperimentationService } from "Roblox";
import { TLoginParams } from "../../types/loginTypes";

import { TSignupParams } from "../../types/signupTypes";

import { getServerNonce } from "../services/hbaService";

import {
  hbaExperimentLayer,
  experimentVariables,
} from "../../constants/ixpConstants";

const { getHbaMeta } = cryptoUtil;
const SEPARATOR = "|";

type TAuthParamsCryptoKeyPairComposite = {
  authParams: TLoginParams | TSignupParams;
  clientKeyPair?: CryptoKeyPair;
};
/**
 * Build signup & login request with SecureAuthIntent
 *
 * @returns an auth request parameter
 */
export const buildAuthParamsWithSecureAuthIntentAndClientKeyPair = async (
  params: TLoginParams | TSignupParams
): Promise<TAuthParamsCryptoKeyPairComposite> => {
  const hbaMeta = getHbaMeta();
  if (!hbaMeta.isSecureAuthenticationIntentEnabled) {
    return {
      authParams: params,
    };
  }

  // get ixp variable from hba layer
  const ixpResult = await ExperimentationService?.getAllValuesForLayer(
    hbaExperimentLayer
  );
  const isHBADarkLaunchEnabledOnIXP = ixpResult[
    experimentVariables.isHBADarkLaunchEnabled
  ] as boolean;

  if (!isHBADarkLaunchEnabledOnIXP) {
    return {
      authParams: params,
    };
  }

  try {
    // prerequisite: get serverNonce
    const serverNonce = await getServerNonce();
    if (!serverNonce) {
      // eslint-disable-next-line no-console
      console.warn("No hba server nonce available.");
      return {
        authParams: params,
      };
    }
    // step 1 generate client side key pair.
    const clientKeyPair =
      await cryptoUtil.generateSigningKeyPairUnextractable();
    // step 2 sign the payload with client priviate key.
    const clientPublicKey = await cryptoUtil.exportPublicKeyAsSpki(
      clientKeyPair.publicKey
    );
    const clientEpochTimestamp = Math.floor(Date.now() / 1000);
    const payload = [clientPublicKey, clientEpochTimestamp, serverNonce].join(
      SEPARATOR
    );

    const saiSignature = await cryptoUtil.sign(
      clientKeyPair.privateKey,
      payload
    );
    const secureAuthIntent = {
      clientPublicKey,
      clientEpochTimestamp,
      serverNonce,
      saiSignature,
    };
    // step 3 attach it to a login params
    const authParams = params;
    authParams.secureAuthenticationIntent = secureAuthIntent;
    return {
      authParams: params,
      clientKeyPair,
    };
  } catch {
    return {
      authParams: params,
    };
  }
};

export default {
  buildAuthParamsWithSecureAuthIntentAndClientKeyPair,
};
