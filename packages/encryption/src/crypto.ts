/**
 * Symmetric key algorithm parameters
 */
export const SYMM_KEY_ALGO_PARAMS = {
  name: "AES-CBC",
  length: 256,
};

/**
 *
 * Import a symmetric key from a Uint8Array to a webcrypto key.  You should only use this if you're handling your own key generation and management with Lit.  Typically, Lit handles this internally for you.
 *
 * @param { Uint8Array } symmKey The symmetric key to import
 *
 * @returns { Promise<CryptoKey> } A promise that resolves to the imported key
 */
export const importSymmetricKey = async (
  symmKey: Uint8Array
): Promise<CryptoKey> => {
  const importedSymmKey = await crypto.subtle.importKey(
    "raw",
    symmKey,
    SYMM_KEY_ALGO_PARAMS,
    true,
    ["encrypt", "decrypt"]
  );

  return importedSymmKey;
};

/**
 *
 * Decrypt encrypted data with a symmetric key.  Uses AES-CBC via SubtleCrypto
 *
 * @param { Uint8Array } encryptedData The encrypted data that should be decrypted
 * @param { CryptoKey } symmKey The symmetric key
 *
 * @returns { Uint8Array } The decrypted blob
 */
export const decryptWithSymmetricKey = async (
  encryptedData: Uint8Array,
  symmKey: CryptoKey
): Promise<Uint8Array> => {
  const recoveredIv = await encryptedData.slice(0, 16);
  const encryptedZipArrayBuffer = await encryptedData.slice(16);
  const decryptedZip = await crypto.subtle.decrypt(
    {
      name: "AES-CBC",
      iv: recoveredIv,
    },
    symmKey,
    encryptedZipArrayBuffer
  );

  return decryptedZip as Uint8Array;
};

/** ---------- Exports ---------- */

/**
 *
 * Generate a new random symmetric key using WebCrypto subtle API.  You should only use this if you're handling your own key generation and management with Lit.  Typically, Lit handles this internally for you.
 *
 * @returns { Promise<CryptoKey> } A promise that resolves to the generated key
 */
export const generateSymmetricKey = async (): Promise<CryptoKey> => {
  const symmKey = await crypto.subtle.generateKey(SYMM_KEY_ALGO_PARAMS, true, [
    "encrypt",
    "decrypt",
  ]);

  return symmKey;
};

/**
 *
 * Encrypt data with a symmetric key
 *
 * @param { CryptoKey } symmKey The symmetric key
 * @param { Uint8Array } data The data to encrypt
 *
 * @returns { Promise<Uint8Array> } The encrypted blob
 */
export const encryptWithSymmetricKey = async (
  symmKey: CryptoKey,
  data: Uint8Array
): Promise<Uint8Array> => {
  // encrypt the zip with symmetric key
  const iv = crypto.getRandomValues(new Uint8Array(16));

  const encryptedZipData = await crypto.subtle.encrypt(
    {
      name: "AES-CBC",
      iv,
    },
    symmKey,
    data
  );

  return new Uint8Array([...iv, ...new Uint8Array(encryptedZipData)]);
};
