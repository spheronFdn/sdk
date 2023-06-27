import {
  DomainTypeEnum,
  SpheronApi,
  Bucket as CoreBucket,
} from "@spheron/core";
import {
  Bucket,
  Domain,
  Upload,
  BucketStateEnum,
  UploadStatusEnum,
} from "./interfaces";
import { Deployment, Domain as ProjectDomain } from "@spheron/core";

class BucketManager {
  private readonly spheronApi: SpheronApi;

  constructor(spheronApi: SpheronApi) {
    this.spheronApi = spheronApi;
  }

  async getBucket(bucketId: string): Promise<Bucket> {
    const bucket = await this.spheronApi.getBucket(bucketId);
    return this.mapCoreBucket(bucket);
  }

  async getBucketDomains(bucketId: string): Promise<Domain[]> {
    const { domains } = await this.spheronApi.getProjectDomains(bucketId);
    return domains.map((x) => this.mapProjectDomainToBucketDomain(x));
  }

  async getBucketDomain(
    bucketId: string,
    domainIdentifier: string
  ): Promise<Domain> {
    const { domain } = await this.spheronApi.getProjectDomain(
      bucketId,
      domainIdentifier
    );
    return this.mapProjectDomainToBucketDomain(domain);
  }

  async updateBucketDomain(
    bucketId: string,
    domainIdentifier: string,
    options: {
      link: string;
      name: string;
    }
  ): Promise<Domain> {
    const { domain } = await this.spheronApi.patchProjectDomain(
      bucketId,
      domainIdentifier,
      { ...options, deploymentEnvironments: [] }
    );
    return this.mapProjectDomainToBucketDomain(domain);
  }

  async verifyBucketDomain(
    bucketId: string,
    domainIdentifier: string
  ): Promise<Domain> {
    const { domain } = await this.spheronApi.verifyProjectDomain(
      bucketId,
      domainIdentifier
    );
    return this.mapProjectDomainToBucketDomain(domain);
  }

  async deleteBucketDomain(
    bucketId: string,
    domainIdentifier: string
  ): Promise<void> {
    await this.spheronApi.deleteProjectDomain(bucketId, domainIdentifier);
  }

  async addBucketDomain(
    bucketId: string,
    options: {
      link: string;
      type: DomainTypeEnum | string;
      name: string;
    }
  ): Promise<Domain> {
    const { domain } = await this.spheronApi.addProjectDomain(bucketId, {
      ...options,
      deploymentEnvironments: [],
    });
    return this.mapProjectDomainToBucketDomain(domain);
  }

  async getBucketUploads(
    bucketId: string,
    options: {
      skip: number;
      limit: number;
    }
  ): Promise<Upload[]> {
    if (options.skip < 0 || options.limit < 0) {
      throw new Error(`Skip and Limit cannot be negative numbers.`);
    }
    const { deployments } = await this.spheronApi.getProjectDeployments(
      bucketId,
      {
        skip: options.skip && options.skip >= 0 ? options.skip : 0,
        limit: options.limit && options.limit >= 0 ? options.limit : 6,
      }
    );

    return deployments.map((x) => this.mapDeploymentToUpload(x));
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
    await this.spheronApi.updateBucketState(bucketId, BucketStateEnum.ARCHIVED);
  }

  async unarchiveBucket(bucketId: string): Promise<void> {
    await this.spheronApi.updateBucketState(
      bucketId,
      BucketStateEnum.MAINTAINED
    );
  }

  async getUpload(uploadId: string): Promise<Upload> {
    const deployment = await this.spheronApi.getDeployment(uploadId);
    return this.mapDeploymentToUpload(deployment);
  }

  private mapCoreBucket(bucket: CoreBucket): Bucket {
    return {
      id: bucket._id,
      name: bucket.name,
      organizationId: bucket.organization,
      state: bucket.state,
    };
  }

  private mapProjectDomainToBucketDomain(domain: ProjectDomain): Domain {
    return {
      id: domain._id,
      name: domain.name,
      link: domain.link,
      verified: domain.verified,
      bucketId: domain.projectId,
      type: domain.type,
    };
  }

  private mapDeploymentToUpload(deployment: Deployment): Upload {
    return {
      id: deployment._id,
      protocolLink: deployment.sitePreview,
      buildDirectory: deployment.buildDirectory,
      status: deployment.status as unknown as UploadStatusEnum,
      memoryUsed: deployment.memoryUsed,
      bucketId: deployment.project?._id ?? deployment.project,
      protocol: deployment.protocol,
    };
  }
}

export default BucketManager;
export {
  Bucket,
  Domain,
  Upload,
  BucketStateEnum,
  DomainTypeEnum,
  UploadStatusEnum,
};
