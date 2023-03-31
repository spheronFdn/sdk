import { ProtocolEnum, UploadManager, UploadResult } from "@spheron/core";
import { createPayloads } from "./file-payload-creator";

export { ProtocolEnum };

export interface SpheronClientConfiguration {
  token: string;
}

export class SpheronClient {
  private readonly configuration: SpheronClientConfiguration;
  private readonly uploadManager: UploadManager;

  constructor(configuration: SpheronClientConfiguration) {
    this.configuration = configuration;
    this.uploadManager = new UploadManager();
  }

  // async upload(
  //   filePath: string,
  //   configuration: {
  //     name: string;
  //     protocol: ProtocolEnum;
  //     organizationId?: string;
  //     onChunkUploaded?: (uploadedSize: number, totalSize: number) => void;
  //   }
  // ): Promise<UploadResult> {

  //   const { payloads, totalSize } = await createPayloads(filePath, payloadSize);

  //   return this.uploadManager.uploadPayloadsForDeployment(payloads, {
  //     deploymentId: deploymentId,
  //     singleDeploymentToken: this.configuration.token,
  //     parallelUploadCount,
  //     onChunkUploaded: (uploadedSize: number) =>
  //       configuration.onChunkUploaded &&
  //       configuration.onChunkUploaded(uploadedSize, totalSize),
  //   });
  // }
}

export default SpheronClient;
