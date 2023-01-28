import { dataStores, cryptoUtil } from "core-roblox-utilities";

const { getHbaMeta } = cryptoUtil;

const hbaMeta = getHbaMeta();

const { hbaIndexedDBName, hbaIndexedDBObjStoreName } = hbaMeta;
const { hbacIndexedDB } = dataStores;

/**
 * Put CryptoKeyPairs to indexedDB
 *
 * @returns Promise<void>
 */
export const storeClientKeyPair = async (
  userId: string,
  clientKeyPair: CryptoKeyPair
): Promise<void> => {
  if (hbaIndexedDBName && hbaIndexedDBObjStoreName) {
    const dbPromise = hbacIndexedDB.getOrCreateCryptoDB(
      hbaIndexedDBName,
      hbaIndexedDBObjStoreName
    );
    await hbacIndexedDB.putCryptoKeyPair(userId, clientKeyPair, dbPromise);
  }
};

/**
 * Get CryptoKeyPairs from indexedDB
 *
 * @returns Promise<CryptoKeyPair>
 */
export const getClientKeyPair = async (
  userId: string
): Promise<CryptoKeyPair> => {
  if (hbaIndexedDBName && hbaIndexedDBObjStoreName) {
    const dbPromise = hbacIndexedDB.getOrCreateCryptoDB(
      hbaIndexedDBName,
      hbaIndexedDBObjStoreName
    );
    return hbacIndexedDB.getCryptoKeyPair(userId, dbPromise);
  }
  return <CryptoKeyPair>{};
};

export default {
  storeClientKeyPair,
  getClientKeyPair,
};
