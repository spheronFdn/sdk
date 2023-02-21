import SpheronApi from "../spheron-api";
import {
  DeploymentStatusEnum,
  ProjectStateEnum,
  ProjectTypeEnum,
} from "../spheron-api/enums";
import { Bucket, Upload } from "./interfaces";

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

  async getBucketUploads(
    bucketId: string,
    options: {
      skip: number;
      limit: number;
    }
  ): Promise<{ uploads: Upload[] }> {
    if (options.skip < 0 || options.limit < 0) {
      throw new Error(`Skip and Limit cannot be negative numbers.`);
    }
    const { deployments } = await this.spheronApi.getProjectDeployments(
      bucketId,
      options
    );

    return {
      uploads: deployments.map((x) => ({
        _id: x._id,
        sitePreview: x.sitePreview,
        buildDirectory: x.buildDirectory,
        status: x.status,
        memoryUsed: x.memoryUsed,
        bucketId: x.project._id,
        protocol: x.protocol,
      })),
    };
  }

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
