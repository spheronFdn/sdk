import { ProtocolEnum, UploadManager, UploadResult } from "@spheron/core";
import { createPayloads } from "./file-payload-creator";
import jwt_decode from "jwt-decode";

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
  };
}

export { upload };
