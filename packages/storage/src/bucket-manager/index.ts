import {
  DomainTypeEnum,
  SpheronApi,
  Upload as CoreUpload,
  Bucket as CoreBucket,
} from "@spheron/core";
import {
  Bucket,
  Domain,
  Upload,
  BucketStateEnum,
  UploadStatusEnum,
} from "./interfaces";
import { BucketDomain as CoreBucketDomain } from "@spheron/core";

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
    const { domains } = await this.spheronApi.getBucketDomains(bucketId);
    return domains.map((x) => this.mapCoreBucketDomains(x));
  }

  async getBucketDomain(
    bucketId: string,
    domainIdentifier: string
  ): Promise<Domain> {
    const { domain } = await this.spheronApi.getBucketDomain(
      bucketId,
      domainIdentifier
    );
    return this.mapCoreBucketDomains(domain);
  }

  async updateBucketDomain(
    bucketId: string,
    domainIdentifier: string,
    options: {
      link: string;
      name: string;
    }
  ): Promise<Domain> {
    const { domain } = await this.spheronApi.patchBucketDomain(
      bucketId,
      domainIdentifier,
      { ...options }
    );
    return this.mapCoreBucketDomains(domain);
  }

  async verifyBucketDomain(
    bucketId: string,
    domainIdentifier: string
  ): Promise<Domain> {
    const { domain } = await this.spheronApi.verifyBucketDomain(
      bucketId,
      domainIdentifier
    );
    return this.mapCoreBucketDomains(domain);
  }

  async deleteBucketDomain(
    bucketId: string,
    domainIdentifier: string
  ): Promise<void> {
    await this.spheronApi.deleteBucketDomain(bucketId, domainIdentifier);
  }

  async addBucketDomain(
    bucketId: string,
    options: {
      link: string;
      type: DomainTypeEnum | string;
      name: string;
    }
  ): Promise<Domain> {
    const { domain } = await this.spheronApi.addBucketDomain(bucketId, {
      ...options,
    });
    return this.mapCoreBucketDomains(domain);
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
    const { uploads } = await this.spheronApi.getBucketUploads(bucketId, {
      skip: options.skip && options.skip >= 0 ? options.skip : 0,
      limit: options.limit && options.limit >= 0 ? options.limit : 6,
    });

    return uploads.map((x) => this.mapCoreUpload(x));
  }

  async getBucketUploadCount(bucketId: string): Promise<{
    count: number;
  }> {
    return await this.spheronApi.getBucketUploadCount(bucketId);
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
    const upload = await this.spheronApi.getUpload(uploadId);
    return this.mapCoreUpload(upload);
  }

  private mapCoreBucket(bucket: CoreBucket): Bucket {
    return {
      id: bucket._id,
      name: bucket.name,
      organizationId: bucket.organization,
      state: bucket.state,
    };
  }

  private mapCoreBucketDomains(domain: CoreBucketDomain): Domain {
    return {
      id: domain._id,
      name: domain.name,
      link: domain.link,
      verified: domain.verified,
      bucketId: domain.bucketId,
      type: domain.type,
    };
  }

  private mapCoreUpload(upload: CoreUpload): Upload {
    return {
      id: upload._id,
      protocolLink: upload.protocolLink,
      uploadDirectory: upload.uploadDirectory,
      status: upload.status,
      memoryUsed: upload.memoryUsed,
      bucketId: upload.bucket,
      protocol: upload.protocol,
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
