import UploadManager, { UploadResult } from "./upload-manager";
import { ProtocolEnum } from "./enums";
import SpheronApi from "./spheron-api";

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
    configuration: { name: string; protocol: ProtocolEnum }
  ): Promise<UploadResult> {
    const uploadManager = new UploadManager(this.configuration);
    return await uploadManager.upload({
      path,
      name: configuration.name,
      protocol: configuration.protocol,
    });
  }
}
