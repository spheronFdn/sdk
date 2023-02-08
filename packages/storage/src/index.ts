import UploadManager from "./upload-manager";
import { ProtocolEnum } from "./enums";

export { ProtocolEnum };

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
  ) {
    const uploadManager = new UploadManager(this.configuration);
    await uploadManager.upload({
      path: path,
      name: configuration.name,
      protocol: configuration.protocol,
    });
  }
}
