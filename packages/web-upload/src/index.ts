import { ProtocolEnum, UploadManager, UploadResult } from "@spheron/core";
import { createPayloads } from "./file-payload-creator";
import jwt_decode from "jwt-decode";

export { ProtocolEnum };

const upload = async (
  files: File[],
  configuration: {
    uploadId: string;
    token: string;
    onChunkUploaded?: (uploadedSize: number, totalSize: number) => void;
  }
): Promise<UploadResult> => {
  if (!files || files.length === 0) {
    throw new Error("No files to upload.");
  }

  if (!configuration.uploadId) {
    throw new Error("No deploymentId provided.");
  }

  if (!configuration.token) {
    throw new Error("No token provided.");
  }

  const jwtPayload: { payloadSize: number; parallelUploadCount: number } =
    jwt_decode(configuration.token);
  const payloadSize = jwtPayload?.payloadSize ?? 5 * 5 * 1024;
  const parallelUploadCount = jwtPayload?.parallelUploadCount ?? 3;

  const { payloads, totalSize } = await createPayloads(files, payloadSize);

  const uploadManager = new UploadManager();
  const uploadPayloadsResult = await uploadManager.uploadPayloads(payloads, {
    deploymentId: configuration.uploadId,
    token: configuration.token,
    parallelUploadCount,
    onChunkUploaded: (uploadedSize: number) =>
      configuration.onChunkUploaded &&
      configuration.onChunkUploaded(uploadedSize, totalSize),
  });

  const result = await uploadManager.finalizeUploadDeployment(
    configuration.uploadId,
    uploadPayloadsResult.success,
    configuration.token
  );

  if (!result.success) {
    throw new Error(`Upload failed. ${result.message}`);
  }

  return {
    uploadId: result.deploymentId,
    bucketId: result.projectId,
    protocolLink: result.sitePreview,
    dynamicLinks: result.affectedDomains,
  };
};

export { upload };
