// a util function to handle hardware backed authentication upon users logout

import { getHbaMeta } from "../constants/hbaMeta";
import { deleteCryptoKeyPair, getOrCreateCryptoDB } from "../store/indexedDB";

const hbaMeta = getHbaMeta();
const { hbaIndexedDBName, hbaIndexedDBObjStoreName } = hbaMeta;
/**
 * Delete crypto key pair upon users logout
 *
 * @returns {Promise<void>}
 */
export const deleteUserCryptoKeyPairUponLogout = async (
  userId: string
): Promise<void> => {
  if (hbaIndexedDBName && hbaIndexedDBObjStoreName) {
    const db = getOrCreateCryptoDB(hbaIndexedDBName, hbaIndexedDBObjStoreName);
    return deleteCryptoKeyPair(userId, db);
  }
  return null;
};

export default {
  deleteUserCryptoKeyPairUponLogout,
};
