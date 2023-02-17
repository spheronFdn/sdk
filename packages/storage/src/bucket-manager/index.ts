import SpheronApi from "../spheron-api";
import { ProjectTypeEnum } from "../spheron-api/enums";

class BucketManager {
  private readonly spheronApi: SpheronApi;

  constructor(spheronApi: SpheronApi) {
    this.spheronApi = spheronApi;
  }

  async getBucket(bucketId: string): Promise<void> {
    const project = await this.spheronApi.getProject(bucketId);
    if (project.type == ProjectTypeEnum.UPLOAD) {
    }
  }
}

export default BucketManager;
