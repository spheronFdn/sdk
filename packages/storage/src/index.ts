import UploadManager, { UploadResult } from "./upload-manager";
import { ProtocolEnum } from "./enums";

export { ProtocolEnum };

export interface SpheronClientConfiguration {
  token: string;
}

export class SpheronClient {
  private readonly configuration: SpheronClientConfiguration;

  constructor(configuration: SpheronClientConfiguration) {
    this.configuration = configuration;
  }

  async upload(
    path: string,
    configuration: {
      name: string;
      protocol: ProtocolEnum;
      organizationId?: string;
      onUploadInitiated?: (uploadId: string) => void;
      onChunkUploaded?: (uploadedSize: number, totalSize: number) => void;
    }
  ): Promise<UploadResult> {
    const uploadManager = new UploadManager(this.configuration);
    return await uploadManager.upload({
      path,
      name: configuration.name,
      protocol: configuration.protocol,
      organizationId: configuration.organizationId,
      onChunkUploaded: configuration.onChunkUploaded,
      onUploadInitiated: configuration.onUploadInitiated,
    });
  }
}

export default SpheronClient;
