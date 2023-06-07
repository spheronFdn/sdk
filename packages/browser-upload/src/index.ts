import { ProtocolEnum, UploadManager, UploadResult } from "@spheron/core";
import { createPayloads } from "./file-payload-creator";
import jwt_decode from "jwt-decode";
import {
  convertJsonToFile,
  decryptFile,
  decryptString,
  encryptFile,
  encryptString,
  uint8arrayToString,
} from "@spheron/encryption";
import { DecryptFromIpfsProps, EncryptToIpfsProps } from "./interface";

export { ProtocolEnum, UploadResult };

async function upload(
  files: File[] | FileList,
  configuration: {
    token: string;
    onChunkUploaded?: (uploadedSize: number, totalSize: number) => void;
  }
): Promise<UploadResult> {
  let fileList: File[] = [];

  if (files instanceof FileList) {
    fileList = Array.from(files);
  } else if (Array.isArray(files)) {
    fileList = files;
  }

  if (!fileList || fileList.length === 0) {
    throw new Error("No files to upload.");
  }

  if (!configuration.token) {
    throw new Error("No token provided.");
  }

  const jwtPayload: {
    payloadSize: number;
    parallelUploadCount: number;
    deploymentId: string;
  } = jwt_decode(configuration.token);
  const uploadId = jwtPayload?.deploymentId ?? "";
  if (!uploadId) {
    throw new Error("The provided token is invalid.");
  }

  const payloadSize = jwtPayload?.payloadSize ?? 5 * 5 * 1024;
  const parallelUploadCount = jwtPayload?.parallelUploadCount ?? 3;

  const { payloads, totalSize } = await createPayloads(fileList, payloadSize);

  let success = true;
  let caughtError: Error | undefined = undefined;
  const uploadManager = new UploadManager();
  try {
    const uploadPayloadsResult = await uploadManager.uploadPayloads(payloads, {
      deploymentId: uploadId,
      token: configuration.token,
      parallelUploadCount,
      onChunkUploaded: (uploadedSize: number) =>
        configuration.onChunkUploaded &&
        configuration.onChunkUploaded(uploadedSize, totalSize),
    });
    if (!uploadPayloadsResult.success) {
      throw new Error(uploadPayloadsResult.errorMessage);
    }
  } catch (error) {
    success = false;
    caughtError = error;
  }

  const result = await uploadManager.finalizeUploadDeployment(
    uploadId,
    success,
    configuration.token
  );

  if (caughtError) {
    throw caughtError;
  }

  if (!result.success) {
    throw new Error(`Upload failed. ${result.message}`);
  }

  return {
    uploadId: result.deploymentId,
    bucketId: result.projectId,
    protocolLink: result.sitePreview,
    dynamicLinks: result.affectedDomains,
    cid: result.cid,
  };
}

async function encryptUpload({
  authSig,
  sessionSigs,
  accessControlConditions,
  evmContractConditions,
  solRpcConditions,
  unifiedAccessControlConditions,
  chain,
  string,
  file,
  litNodeClient,
  configuration,
}: EncryptToIpfsProps): Promise<UploadResult> {
  if (string === undefined && file === undefined)
    throw new Error(`Either string or file must be provided`);

  let encryptedData;
  let symmetricKey;
  if (string !== undefined && file !== undefined) {
    throw new Error(`Provide only either a string or file to encrypt`);
  } else if (string !== undefined) {
    const encryptedString = await encryptString(string);
    encryptedData = encryptedString.encryptedString;
    symmetricKey = encryptedString.symmetricKey;
  } else {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const encryptedFile = await encryptFile({ file: file! });
    encryptedData = encryptedFile.encryptedFile;
    symmetricKey = encryptedFile.symmetricKey;
  }

  const encryptedSymmetricKey = await litNodeClient.saveEncryptionKey({
    accessControlConditions,
    evmContractConditions,
    solRpcConditions,
    unifiedAccessControlConditions,
    symmetricKey,
    authSig,
    sessionSigs,
    chain,
  });

  console.log("Encrypted key saved to Lit", encryptedSymmetricKey);

  const encryptedSymmetricKeyString = uint8arrayToString(
    encryptedSymmetricKey,
    "base16"
  );

  const encryptedDataJson = Buffer.from(
    await encryptedData.arrayBuffer()
  ).toJSON();
  try {
    const uploadJson = JSON.stringify({
      [string !== undefined ? "encryptedString" : "encryptedFile"]:
        encryptedDataJson,
      encryptedSymmetricKeyString,
      accessControlConditions,
      evmContractConditions,
      solRpcConditions,
      unifiedAccessControlConditions,
      chain,
    });
    const uploadFile = convertJsonToFile(uploadJson, "data.json");
    const res = await upload([uploadFile], configuration);
    return res;
  } catch (e) {
    throw new Error(`Upload failed: ${e.message}`);
  }
}

async function decryptUpload({
  authSig,
  sessionSigs,
  ipfsCid,
  litNodeClient,
}: DecryptFromIpfsProps): Promise<string | Uint8Array> {
  try {
    const metadataRes = await (
      await fetch(
        `https://gateway.spheron.link/ipfs/${ipfsCid}/data.json`
      ).catch(() => {
        throw new Error("Error finding metadata from IPFS CID");
      })
    ).json();

    const metadata = JSON.parse(metadataRes);

    console.log("metadata", metadata.accessControlConditions);

    const symmetricKey = await litNodeClient.getEncryptionKey({
      accessControlConditions: metadata.accessControlConditions,
      evmContractConditions: metadata.evmContractConditions,
      solRpcConditions: metadata.solRpcConditions,
      unifiedAccessControlConditions: metadata.unifiedAccessControlConditions,
      toDecrypt: metadata.encryptedSymmetricKeyString,
      chain: metadata.chain,
      authSig,
      sessionSigs,
    });
    console.log("symmetricKey", symmetricKey);

    if (metadata.encryptedString !== undefined) {
      const encryptedStringBlob = new Blob(
        [Buffer.from(metadata.encryptedString)],
        { type: "application/octet-stream" }
      );
      return await decryptString(encryptedStringBlob, symmetricKey);
    }

    const encryptedFileBlob = new Blob([Buffer.from(metadata.encryptedFile)], {
      type: "application/octet-stream",
    });
    return await decryptFile({ file: encryptedFileBlob, symmetricKey });
  } catch (e: any) {
    console.log("Error on decrypt", e);
    throw new Error(e.message);
  }
}

export { upload, encryptUpload, decryptUpload };
