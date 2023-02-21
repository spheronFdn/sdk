import SpheronApi from "../spheron-api";
import { ProjectTypeEnum } from "../spheron-api/enums";
import { Bucket } from "./interfaces";

class BucketManager {
  private readonly spheronApi: SpheronApi;

  constructor(spheronApi: SpheronApi) {
    this.spheronApi = spheronApi;
  }

  async getBucket(bucketId: string): Promise<Bucket> {
    const project = await this.spheronApi.getProject(bucketId);
    if (project.type !== ProjectTypeEnum.UPLOAD) {
      throw new Error(`Bucket not found.`);
    }
    return {
      _id: project._id,
      name: project.name,
      organizationId: project.organization,
      state: project.state,
      domains: project.domains?.map(
        ({ _id, name, link, verified, projectId }) => ({
          _id,
          name,
          link,
          verified,
          bucketId: projectId,
        })
      ),
    };
  }
}

export default BucketManager;
