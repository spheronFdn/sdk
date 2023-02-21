import UploadManager, { UploadResult } from "./upload-manager";
import { ProtocolEnum } from "./enums";
import SpheronApi from "./spheron-api";
import { Bucket } from "./bucket-manager/interfaces";
import BucketManager from "./bucket-manager";

export { ProtocolEnum, SpheronApi };

export interface SpheronClientConfiguration {
  token: string;
}

export default class SpheronClient {
  private readonly configuration: SpheronClientConfiguration;

  constructor(configuration: SpheronClientConfiguration) {
    this.configuration = configuration;
  }

  async upload(
    path: string,
    configuration: {
      name: string;
      protocol: ProtocolEnum;
      onUploadInitiated?: (uploadId: string) => void;
      onChunkUploaded?: (uploadedSize: number, totalSize: number) => void;
    }
  ): Promise<UploadResult> {
    const uploadManager = new UploadManager(this.configuration);
    return await uploadManager.upload({
      path,
      name: configuration.name,
      protocol: configuration.protocol,
      onChunkUploaded: configuration.onChunkUploaded,
      onUploadInitiated: configuration.onUploadInitiated,
    });
  }

  async getBucket(bucketId: string): Promise<Bucket> {
    const spheronApi = new SpheronApi(this.configuration.token);
    const bucketManager = new BucketManager(spheronApi);
    return await bucketManager.getBucket(bucketId);
  }
}
