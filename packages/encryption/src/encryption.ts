import {
  decryptWithSymmetricKey,
  encryptWithSymmetricKey,
  generateSymmetricKey,
  importSymmetricKey,
} from "./crypto";
import { EncryptedString } from "./interface";
import { uint8arrayFromString, uint8arrayToString } from "./utils";

/**
 *
 * Encrypt a string.  This is used to encrypt any string that is to be locked via the Spheron Protocol.
 *
 * @param { string } str The string to encrypt
 * @returns { Promise<Object> } A promise containing the encryptedString as a Blob and the symmetricKey used to encrypt it, as a Uint8Array.
 */
export const encryptString = async (str: string): Promise<EncryptedString> => {
  // -- prepare
  const encodedString: Uint8Array = uint8arrayFromString(str, "utf8");

  const symmKey: CryptoKey = await generateSymmetricKey();

  const encryptedString = await encryptWithSymmetricKey(
    symmKey,
    encodedString.buffer
  );

  const exportedSymmKey: Uint8Array = new Uint8Array(
    await crypto.subtle.exportKey("raw", symmKey)
  );

  return {
    symmetricKey: exportedSymmKey,
    encryptedString,
  };
};

/**
 *
 * Decrypt a string that was encrypted with the encryptString function.
 *
 * @param { AcceptedFileType } encryptedStringBlob The encrypted string as a Blob
 * @param { Uint8Array } symmKey The symmetric key used that will be used to decrypt this.
 *
 * @returns { Promise<string> } A promise containing the decrypted string
 */
export const decryptString = async (
  encryptedStringBlob: Uint8Array,
  symmKey: Uint8Array
): Promise<string> => {
  // -- import the decrypted symm key
  const importedSymmKey: CryptoKey = await importSymmetricKey(symmKey);

  const decryptedStringArrayBuffer: Uint8Array = await decryptWithSymmetricKey(
    encryptedStringBlob,
    importedSymmKey
  );

  return uint8arrayToString(new Uint8Array(decryptedStringArrayBuffer), "utf8");
};
