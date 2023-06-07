import {
  decryptWithSymmetricKey,
  encryptWithSymmetricKey,
  generateSymmetricKey,
  importSymmetricKey,
} from "./crypto";
import { DecryptFileProps, EncryptedFile, EncryptedString } from "./interface";
import { AcceptedFileType } from "./types";
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

  const encryptedString: Blob = await encryptWithSymmetricKey(
    symmKey,
    encodedString.buffer
  );

  const exportedSymmKey: Uint8Array = new Uint8Array(
    await crypto.subtle.exportKey("raw", symmKey)
  );

  return {
    symmetricKey: exportedSymmKey,
    encryptedString,
    encryptedData: encryptedString,
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
  encryptedStringBlob: Blob,
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

/**
 *
 * Encrypt a file without doing any zipping or packing.  This is useful for large files.  A 1gb file can be encrypted in only 2 seconds, for example.  A new random symmetric key will be created and returned along with the encrypted file.
 *
 * @param { Object } params
 * @param { AcceptedFileType } params.file The file you wish to encrypt
 *
 * @returns { Promise<Object> } A promise containing an object with keys encryptedFile and symmetricKey.  encryptedFile is a Blob, and symmetricKey is a Uint8Array that can be used to decrypt the file.
 */
export const encryptFile = async ({
  file,
}: {
  file: AcceptedFileType;
}): Promise<EncryptedFile> => {
  // generate a random symmetric key
  const symmetricKey = await generateSymmetricKey();
  const exportedSymmKey = new Uint8Array(
    await crypto.subtle.exportKey("raw", symmetricKey)
  );

  // encrypt the file
  const fileAsArrayBuffer =
    file instanceof Buffer ? file : await file.arrayBuffer();
  const encryptedFile = await encryptWithSymmetricKey(
    symmetricKey,
    fileAsArrayBuffer
  );

  const _encryptedFile: EncryptedFile = {
    encryptedFile,
    symmetricKey: exportedSymmKey,
  };

  return _encryptedFile;
};

/**
 *
 * Decrypt a file that was encrypted with the encryptFile function, without doing any unzipping or unpacking.  This is useful for large files.  A 1gb file can be decrypted in only 1 second, for example.
 *
 * @property { Object } params
 * @property { AcceptedFileType } params.file The file you wish to decrypt
 * @property { Uint8Array } params.symmetricKey The symmetric key used that will be used to decrypt this.
 *
 * @returns { Promise<Object> } A promise containing the decrypted file.  The file is an ArrayBuffer.
 */
export const decryptFile = async ({
  file,
  symmetricKey,
}: DecryptFileProps): Promise<Uint8Array> => {
  // -- execute
  const importedSymmKey = await importSymmetricKey(symmetricKey);

  // decrypt the file
  const decryptedFile = await decryptWithSymmetricKey(file, importedSymmKey);

  return decryptedFile;
};
