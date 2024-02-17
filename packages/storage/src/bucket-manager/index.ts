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
  IpnsRecord,
} from "./interfaces";
import {
  BucketDomain as CoreBucketDomain,
  BucketIpnsRecord as CoreBucketIpnsRecord,
} from "@spheron/core";

class BucketManager {
  private readonly spheronApi: SpheronApi;

  constructor(spheronApi: SpheronApi) {
    this.spheronApi = spheronApi;
  }

  async getOrganizationBuckets(
    organizationId: string,
    options: {
      name?: string;
      state?: BucketStateEnum;
      skip: number;
      limit: number;
    }
  ): Promise<Bucket[]> {
    const { buckets } = await this.spheronApi.getOrganizationBuckets({
      organizationId,
      ...options,
    });
    return buckets.map((x) => this.mapCoreBucket(x));
  }

  // async getOrganizationBucketsWithDomains(
  //   organizationId: string,
  //   options: {
  //     name?: string;
  //     state?: BucketStateEnum;
  //     skip: number;
  //     limit: number;
  //   }
  // ): Promise<BucketWithDomains[]> {
  //   const { buckets } = await this.spheronApi.getOrganizationBucketsWithDomains(
  //     {
  //       organizationId,
  //       ...options,
  //     }
  //   );
  //   return buckets.map((x) => {
  //     const bucket = this.mapCoreBucket(x.bucket);
  //     const domains = this.mapCoreBucketDomains(x.domains);
  //     return { bucket, domains };
  //   });
  // }

  async getOrganizationBucketCount(
    organizationId: string,
    options?: {
      name?: string;
      state?: BucketStateEnum;
    }
  ): Promise<number> {
    const { count } = await this.spheronApi.getOrganizationBucketCount({
      organizationId,
      ...options,
    });
    return count;
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

  async getBucketUploadCount(bucketId: string): Promise<number> {
    const { count } = await this.spheronApi.getBucketUploadCount(bucketId);
    return count;
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

  async pinUpload(uploadId: string): Promise<Upload> {
    const upload = await this.spheronApi.pinUpload(uploadId);
    return this.mapCoreUpload(upload);
  }

  async unpinUpload(uploadId: string): Promise<Upload> {
    const upload = await this.spheronApi.unpinUpload(uploadId);
    return this.mapCoreUpload(upload);
  }

  async getBucketIpnsRecords(bucketId: string): Promise<IpnsRecord[]> {
    const { ipnsRecords } = await this.spheronApi.getBucketIpnsRecords(
      bucketId
    );
    return ipnsRecords.map((x) => this.mapCoreIpnsRecord(x));
  }

  async getBucketIpnsRecord(
    bucketId: string,
    ipnsRecordId: string
  ): Promise<IpnsRecord> {
    const { ipnsRecord } = await this.spheronApi.getBucketIpnsRecord(
      bucketId,
      ipnsRecordId
    );
    return this.mapCoreIpnsRecord(ipnsRecord);
  }

  async addBucketIpnsRecord(
    bucketId: string,
    uploadId: string
  ): Promise<IpnsRecord> {
    const { ipnsRecord } = await this.spheronApi.addBucketIpnsRecord(
      bucketId,
      uploadId
    );
    return this.mapCoreIpnsRecord(ipnsRecord);
  }

  async updateBucketIpnsRecord(
    bucketId: string,
    ipnsRecordId: string,
    uploadId: string
  ): Promise<IpnsRecord> {
    const { ipnsRecord } = await this.spheronApi.patchBucketIpnsRecord(
      bucketId,
      ipnsRecordId,
      uploadId
    );
    return this.mapCoreIpnsRecord(ipnsRecord);
  }

  async deleteBucketIpnsRecord(
    bucketId: string,
    ipnsRecordId: string
  ): Promise<void> {
    await this.spheronApi.deleteBucketIpnsRecord(bucketId, ipnsRecordId);
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

  private mapCoreIpnsRecord(ipnsRecord: CoreBucketIpnsRecord): IpnsRecord {
    return {
      id: ipnsRecord._id,
      ipnsHash: ipnsRecord.keyId,
      ipnsLink: ipnsRecord.ipnsLink,
      bucketId: ipnsRecord.bucket,
      createdAt: ipnsRecord.createdAt,
      updatedAt: ipnsRecord.updatedAt,
      memoryUsed: ipnsRecord.memoryUsed,
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
