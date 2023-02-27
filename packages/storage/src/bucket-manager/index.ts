import SpheronApi from "../spheron-api";
import {
  DomainTypeEnum,
  ProjectStateEnum,
  ProjectTypeEnum,
} from "../spheron-api/enums";
import { Bucket, Domain, Upload, BucketStateEnum } from "./interfaces";
import { Domain as ProjectDomain } from "../spheron-api/interfaces";

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
      domains: project.domains?.map((x) =>
        this.mapProjectDomainToBucketDomain(x)
      ),
    };
  }

  async getBucketDomains(bucketId: string): Promise<{ domains: Domain[] }> {
    const { domains } = await this.spheronApi.getProjectDomains(bucketId);
    return {
      domains: domains.map((x) => this.mapProjectDomainToBucketDomain(x)),
    };
  }

  async getBucketDomain(
    bucketId: string,
    domainIdentifier: string
  ): Promise<{ domain: Domain }> {
    const { domain } = await this.spheronApi.getProjectDomain(
      bucketId,
      domainIdentifier
    );
    return {
      domain: this.mapProjectDomainToBucketDomain(domain),
    };
  }

  async updateBucketDomain(
    bucketId: string,
    domainIdentifier: string,
    options: {
      link: string;
      name: string;
    }
  ): Promise<{ domain: Domain }> {
    const { domain } = await this.spheronApi.patchProjectDomain(
      bucketId,
      domainIdentifier,
      { ...options, deploymentEnvironments: [] }
    );
    return {
      domain: this.mapProjectDomainToBucketDomain(domain),
    };
  }

  async verifyBucketDomain(
    bucketId: string,
    domainIdentifier: string
  ): Promise<{ domain: Domain }> {
    const { domain } = await this.spheronApi.verifyProjectDomain(
      bucketId,
      domainIdentifier
    );
    return {
      domain: this.mapProjectDomainToBucketDomain(domain),
    };
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
  ): Promise<{ domain: Domain }> {
    const { domain } = await this.spheronApi.addProjectDomain(bucketId, {
      ...options,
      deploymentEnvironments: [],
    });
    return {
      domain: this.mapProjectDomainToBucketDomain(domain),
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
        protocolLink: x.sitePreview,
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

  private mapProjectDomainToBucketDomain(domain: ProjectDomain): Domain {
    return {
      _id: domain._id,
      name: domain.name,
      link: domain.link,
      verified: domain.verified,
      bucketId: domain.projectId,
      type: domain.type,
    };
  }
}

export default BucketManager;
export { Bucket, Domain, Upload, BucketStateEnum, DomainTypeEnum };
