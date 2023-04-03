import { ProtocolEnum, UploadManager, UploadResult } from "@spheron/core";
import { createPayloads } from "./file-payload-creator";
import { decode } from "jsonwebtoken";

export { ProtocolEnum };

export interface SpheronClientConfiguration {
  token: string;
}

const upload = async (
  files: File[],
  configuration: {
    deploymentId: string;
    token: string;
    onChunkUploaded?: (uploadedSize: number, totalSize: number) => void;
  }
): Promise<UploadResult> => {
  console.log(decode(configuration.token));
  const { payloads, totalSize } = await createPayloads(files, 5 * 5 * 1024);

  const uploadManager = new UploadManager();

  const uploadPayloadsResult = await uploadManager.uploadPayloads(payloads, {
    deploymentId: configuration.deploymentId,
    token: configuration.token,
    parallelUploadCount: 3,
    onChunkUploaded: (uploadedSize: number) =>
      configuration.onChunkUploaded &&
      configuration.onChunkUploaded(uploadedSize, totalSize),
  });

  const result = await uploadManager.finalizeUploadDeployment(
    configuration.deploymentId,
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
