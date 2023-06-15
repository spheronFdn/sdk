import {
  decryptWithSymmetricKey,
  encryptWithSymmetricKey,
  generateSymmetricKey,
  importSymmetricKey,
} from "./crypto";
import { EncryptedData } from "./interface";

/**
 *
 * Encrypt the data. This is used to encrypt any data that is to be locked via the Spheron Protocol.
 *
 * @param { Uint8Array } data The data to encrypt
 * @returns { Promise<Object> } A promise containing the encryptedData as a Uint8Array and the symmetricKey used to encrypt it, as a Uint8Array.
 */
export const encryptData = async (data: Uint8Array): Promise<EncryptedData> => {
  const symmKey: CryptoKey = await generateSymmetricKey();

  const encryptedData: Uint8Array = await encryptWithSymmetricKey(
    symmKey,
    data
  );

  const exportedSymmKey: Uint8Array = new Uint8Array(
    await crypto.subtle.exportKey("raw", symmKey)
  );

  return {
    symmetricKey: exportedSymmKey,
    encryptedData: encryptedData,
  };
};

/**
 *
 * Decrypt data that was encrypted with the encryptData function.
 *
 * @param { Uint8Array } encryptedData The encrypted data as a Uint8Array
 * @param { Uint8Array } symmKey The symmetric key used that will be used to decrypt this.
 *
 * @returns { Promise<Uint8Array> } A promise containing the decrypted string
 */
export const decryptData = async (
  encryptedData: Uint8Array,
  symmKey: Uint8Array
): Promise<Uint8Array> => {
  // -- import the decrypted symm key
  const importedSymmKey: CryptoKey = await importSymmetricKey(symmKey);

  const decryptedData: Uint8Array = await decryptWithSymmetricKey(
    encryptedData,
    importedSymmKey
  );

  return decryptedData;
};
