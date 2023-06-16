import { ProtocolEnum, UploadManager, UploadResult } from "@spheron/core";
import { createPayloads } from "./file-payload-creator";
import jwt_decode from "jwt-decode";
import {
  convertJsonToFile,
  uint8arrayToString,
  encryptData,
  uint8arrayFromString,
  decryptData,
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
  if (!string && !file)
    throw new Error(`Either string or file must be provided`);

  if (!configuration?.token) {
    throw new Error(`Token must be provided`);
  }

  let dataToEncrypt: Uint8Array | null = null;
  if (string && file) {
    throw new Error(`Provide only either a string or file to encrypt`);
  } else if (string) {
    dataToEncrypt = uint8arrayFromString(string, "utf8");
  } else if (file) {
    dataToEncrypt = new Uint8Array(await file.arrayBuffer());
  }

  if (dataToEncrypt === null) throw new Error(`Failed to encrypt data`);

  const { symmetricKey, encryptedData } = await encryptData(dataToEncrypt);

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

  const encryptedSymmetricKeyString = uint8arrayToString(
    encryptedSymmetricKey,
    "base16"
  );

  const encryptedDataJson = Buffer.from(await encryptedData).toJSON();
  const uploadJson = JSON.stringify({
    encryptedData: encryptedDataJson,
    encryptedSymmetricKeyString,
    accessControlConditions,
    evmContractConditions,
    solRpcConditions,
    unifiedAccessControlConditions,
    chain,
  });
  const uploadFile = convertJsonToFile(uploadJson, "data.json");
  return await upload([uploadFile], configuration);
}

async function decryptUpload({
  authSig,
  sessionSigs,
  ipfsCid,
  litNodeClient,
}: DecryptFromIpfsProps): Promise<Uint8Array> {
  const metadataRes = await (
    await fetch(`https://${ipfsCid}.ipfs.sphn.link/data.json`).catch(() => {
      throw new Error("Error finding metadata from IPFS CID");
    })
  ).json();

  const metadata = JSON.parse(metadataRes);

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

  const encrypted = new Uint8Array(Buffer.from(metadata.encryptedData));

  return decryptData(encrypted, symmetricKey);
}

export { upload, encryptUpload, decryptUpload };
