import SpheronApi from "../spheron-api";
import { ProjectStateEnum, ProjectTypeEnum } from "../spheron-api/enums";
import { Bucket } from "./interfaces";

class BucketManager {
  private readonly spheronApi: SpheronApi;

  constructor(spheronApi: SpheronApi) {
    this.spheronApi = spheronApi;
  }

  async getBucket(bucketId: string): Promise<Bucket> {
    const project = await this.spheronApi.getProject(bucketId);
    if (project.type !== ProjectTypeEnum.UPLOAD) {
      throw new Error(`Project with id '${bucketId}' is not a bucket.`);
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

  // async getProjectDeployments(
  //   projectId: string,
  //   options: {
  //     skip: number;
  //     limit: number;
  //     status?: DeploymentStatusEnum;
  //   }
  // ): Promise<{ deployments: Deployment[] }> {
  //   if (options.skip < 0 || options.limit < 0) {
  //     throw new Error(`Skip and Limit cannot be negative numbers.`);
  //   }
  //   const { data } = await axios.get<Deployment[]>(
  //     `${this.spheronApiUrl}/v1/project/${projectId}/deployments?skip=${
  //       options.skip
  //     }&limit=${options.limit}${
  //       options.status ? `&status=${options.status}` : ""
  //     }`,
  //     this.getAxiosRequestConfig()
  //   );
  //   return { deployments: data };
  // }

  async getBucketUploadCount(bucketId: string): Promise<{
    total: number;
    successful: number;
    failed: number;
    pending: number;
  }> {
    return await this.spheronApi.getProjectDeploymentCount(bucketId);
  }

  async archiveBucket(bucketId: string): Promise<void> {
    await this.spheronApi.updateProjectState(
      bucketId,
      ProjectStateEnum.ARCHIVED
    );
  }

  async unarchiveBucket(bucketId: string): Promise<void> {
    await this.spheronApi.updateProjectState(
      bucketId,
      ProjectStateEnum.MAINTAINED
    );
  }
}

export default BucketManager;
