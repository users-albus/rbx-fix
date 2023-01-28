/**
 * A util lib for indexed DB
 * Exposed via Roblox Core Utility DataStore
 */
let databaseName: string;
let databaseObjectStoreName: string;

export const getOrCreateCryptoDB = (
  dbName: string,
  objStoreName: string
): Promise<IDBDatabase> => {
  try {
    databaseName = dbName;
    databaseObjectStoreName = objStoreName;
    const databaseOpenRequest = indexedDB.open(databaseName, 1);
    return new Promise((resolve, reject) => {
      databaseOpenRequest.onerror = () => reject(databaseOpenRequest.error);
      databaseOpenRequest.onupgradeneeded = () => {
        const databaseToCreate = databaseOpenRequest.result;
        databaseToCreate.createObjectStore(databaseObjectStoreName);
        resolve(databaseToCreate);
      };
      databaseOpenRequest.onsuccess = () => resolve(databaseOpenRequest.result);
    });
  } catch (e) {
    console.warn("get or create crypto db error: ", e);
    return <Promise<IDBDatabase>>{};
  }
};

/**
 * @param {string} key
 * @returns {Promise<CryptoKeyPair>} Value for key.
 */
export const getCryptoKeyPair = async (
  key: string,
  dbPromise: Promise<IDBDatabase>
): Promise<CryptoKeyPair> => {
  try {
    const database = await dbPromise;
    const transaction = database.transaction(
      databaseObjectStoreName,
      "readonly"
    );
    const store = transaction.objectStore(databaseObjectStoreName);
    const getRequest = store.get(key);
    return new Promise((resolve, reject) => {
      getRequest.onsuccess = () => resolve(getRequest.result);
      getRequest.onerror = () => reject(getRequest.error);
    });
  } catch (e) {
    console.warn("get crypto key pair error: ", e);
    return <Promise<CryptoKeyPair>>{};
  }
};

/**
 * @param {string} key
 * @param {CryptoKeyPair} value
 * @returns {Promise<void>} Nothing.
 */
export const putCryptoKeyPair = async (
  key: string,
  value: CryptoKeyPair,
  dbPromise: Promise<IDBDatabase>
): Promise<void> => {
  try {
    const database = await dbPromise;
    const transaction = database.transaction(
      databaseObjectStoreName,
      "readwrite"
    );
    const store = transaction.objectStore(databaseObjectStoreName);
    const setRequest = store.put(value, key);
    return new Promise((resolve, reject) => {
      setRequest.onsuccess = () => resolve();
      setRequest.onerror = () => reject(setRequest.error);
    });
  } catch (e) {
    console.warn("put crypto key pair error: ", e);
    return <Promise<void>>{};
  }
};

/**
 * @returns {Promise<void>} Nothing.
 */
export const deleteCryptoDB = async (): Promise<void> => {
  try {
    const databaseDeleteRequest = indexedDB.deleteDatabase(databaseName);
    return new Promise((resolve, reject) => {
      databaseDeleteRequest.onerror = () => reject(databaseDeleteRequest.error);
      databaseDeleteRequest.onsuccess = () => resolve();
    });
  } catch (e) {
    console.warn("delete crypto db error: ", e);
    return <Promise<void>>{};
  }
};

/**
 * @param {string} key
 * @returns {Promise<void>} Nothing.
 */
export const deleteCryptoKeyPair = async (
  key: string,
  dbPromise: Promise<IDBDatabase>
): Promise<void> => {
  try {
    const database = await dbPromise;
    const transaction = database.transaction(
      databaseObjectStoreName,
      "readwrite"
    );
    const store = transaction.objectStore(databaseObjectStoreName);
    const setRequest = store.delete(key);
    return new Promise((resolve, reject) => {
      setRequest.onsuccess = () => resolve();
      setRequest.onerror = () => reject(setRequest.error);
    });
  } catch (e) {
    console.warn("delete crypto key pair error: ", e);
    return <Promise<void>>{};
  }
};

export default {
  getOrCreateCryptoDB,
  getCryptoKeyPair,
  putCryptoKeyPair,
  deleteCryptoDB,
  deleteCryptoKeyPair,
};
