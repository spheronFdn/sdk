import UploadManager, { UploadResult } from "./upload-manager";
import { ProtocolEnum } from "./enums";
import SpheronApi from "./spheron-api";
import { Bucket, Domain, Upload } from "./bucket-manager/interfaces";
import BucketManager from "./bucket-manager";

export { ProtocolEnum, SpheronApi };

export interface SpheronClientConfiguration {
  token: string;
}

export default class SpheronClient {
  private readonly configuration: SpheronClientConfiguration;
  private readonly spheronApi: SpheronApi;
  private readonly bucketManager: BucketManager;
  private readonly uploadManager: UploadManager;

  constructor(configuration: SpheronClientConfiguration) {
    this.configuration = configuration;
    this.spheronApi = new SpheronApi(this.configuration.token);
    this.bucketManager = new BucketManager(this.spheronApi);
    this.uploadManager = new UploadManager(this.configuration);
  }

  async upload(
    path: string,
    configuration: {
      name: string;
      protocol: ProtocolEnum;
      onUploadInitiated?: (uploadId: string) => void;
      onChunkUploaded?: (uploadedSize: number, totalSize: number) => void;
    }
  ): Promise<UploadResult> {
    return await this.uploadManager.upload({
      path,
      name: configuration.name,
      protocol: configuration.protocol,
      onChunkUploaded: configuration.onChunkUploaded,
      onUploadInitiated: configuration.onUploadInitiated,
    });
  }

  async getBucket(bucketId: string): Promise<Bucket> {
    return await this.bucketManager.getBucket(bucketId);
  }

  async getBucketUploadCount(bucketId: string): Promise<{
    total: number;
    successful: number;
    failed: number;
    pending: number;
  }> {
    return await this.bucketManager.getBucketUploadCount(bucketId);
  }

  async getBucketUploads(
    bucketId: string,
    options: {
      skip: number;
      limit: number;
    }
  ): Promise<{ uploads: Upload[] }> {
    return await this.bucketManager.getBucketUploads(bucketId, options);
  }

  async getBucketDomains(bucketId: string): Promise<{ domains: Domain[] }> {
    return await this.bucketManager.getBucketDomains(bucketId);
  }

  async addBucketDomain(
    bucketId: string,
    options: {
      link: string;
      type:
        | "domain"
        | "subdomain"
        | "handshake-domain"
        | "handshake-subdomain"
        | "ens-domain";
      name: string;
    }
  ): Promise<{ domain: Domain }> {
    return await this.bucketManager.addBucketDomain(bucketId, options);
  }

  async getBucketDomain(
    bucketId: string,
    domainIdentifier: string
  ): Promise<{ domain: Domain }> {
    return await this.bucketManager.getBucketDomain(bucketId, domainIdentifier);
  }

  async patchBucketDomain(
    bucketId: string,
    domainIdentifier: string,
    options: {
      link: string;
      name: string;
    }
  ): Promise<{ domain: Domain }> {
    return await this.bucketManager.patchBucketDomain(
      bucketId,
      domainIdentifier,
      options
    );
  }

  async verifyBucketDomain(
    bucketId: string,
    domainIdentifier: string
  ): Promise<{ domain: Domain }> {
    return await this.bucketManager.verifyBucketDomain(
      bucketId,
      domainIdentifier
    );
  }

  async deleteBucketDomain(
    bucketId: string,
    domainIdentifier: string
  ): Promise<{ success: boolean }> {
    return await this.bucketManager.deleteBucketDomain(
      bucketId,
      domainIdentifier
    );
  }

  async archiveBucket(bucketId: string): Promise<void> {
    await this.bucketManager.archiveBucket(bucketId);
  }

  async unarchiveBucket(bucketId: string): Promise<void> {
    await this.bucketManager.unarchiveBucket(bucketId);
  }
}
