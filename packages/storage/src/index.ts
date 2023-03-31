import {
  SpheronApi,
  ProtocolEnum,
  UploadManager,
  UploadResult,
} from "@spheron/core";
import BucketManager, {
  Bucket,
  Upload,
  BucketStateEnum,
  Domain,
  DomainTypeEnum,
  UploadStatusEnum,
} from "./bucket-manager";
import { createPayloads } from "./fs-payload-creator";

export {
  ProtocolEnum,
  Bucket,
  Upload,
  BucketStateEnum,
  Domain,
  DomainTypeEnum,
  UploadStatusEnum,
};

export interface SpheronClientConfiguration {
  token: string;
}

export class SpheronClient {
  private readonly configuration: SpheronClientConfiguration;
  private readonly spheronApi: SpheronApi;
  private readonly bucketManager: BucketManager;
  private readonly uploadManager: UploadManager;

  constructor(configuration: SpheronClientConfiguration) {
    this.configuration = configuration;
    this.spheronApi = new SpheronApi(this.configuration.token);
    this.bucketManager = new BucketManager(this.spheronApi);
    this.uploadManager = new UploadManager();
  }

  async upload(
    filePath: string,
    configuration: {
      name: string;
      protocol: ProtocolEnum;
      organizationId?: string;
      onUploadInitiated?: (uploadId: string) => void;
      onChunkUploaded?: (uploadedSize: number, totalSize: number) => void;
    }
  ): Promise<UploadResult> {
    const { deploymentId, payloadSize, parallelUploadCount } =
      await this.uploadManager.initiateDeployment({
        protocol: configuration.protocol,
        name: configuration.name,
        organizationId: configuration.organizationId,
        token: this.configuration.token,
        createSingleDeploymentToken: true,
      });

    const { payloads, totalSize } = await createPayloads(filePath, payloadSize);

    configuration.onUploadInitiated &&
      configuration.onUploadInitiated(deploymentId);

    const uploadPayloadsResult = await this.uploadManager.uploadPayloads(
      payloads,
      {
        deploymentId,
        token: this.configuration.token,
        parallelUploadCount,
        onChunkUploaded: (uploadedSize: number) =>
          configuration.onChunkUploaded &&
          configuration.onChunkUploaded(uploadedSize, totalSize),
      }
    );

    const result = await this.uploadManager.finalizeUploadDeployment(
      deploymentId,
      uploadPayloadsResult.success,
      this.configuration.token
    );

    if (!result.success) {
      throw new Error(`Upload failed. ${result.message}`);
    }

    return {
      uploadId: result.deploymentId,
      bucketId: result.projectId,
      protocolLink: result.sitePreview,
      dynamicLinks: result.affectedDomains,
    };
  }

  async getBucket(bucketId: string): Promise<Bucket> {
    return await this.bucketManager.getBucket(bucketId);
  }

  async getBucketDomains(bucketId: string): Promise<Domain[]> {
    return await this.bucketManager.getBucketDomains(bucketId);
  }

  async getBucketDomain(
    bucketId: string,
    domainIdentifier: string
  ): Promise<Domain> {
    return await this.bucketManager.getBucketDomain(bucketId, domainIdentifier);
  }

  async addBucketDomain(
    bucketId: string,
    options: {
      link: string;
      type:
        | DomainTypeEnum
        | "domain"
        | "subdomain"
        | "handshake-domain"
        | "handshake-subdomain"
        | "ens-domain";
      name: string;
    }
  ): Promise<Domain> {
    return await this.bucketManager.addBucketDomain(bucketId, options);
  }

  async updateBucketDomain(
    bucketId: string,
    domainIdentifier: string,
    options: {
      link: string;
      name: string;
    }
  ): Promise<Domain> {
    return await this.bucketManager.updateBucketDomain(
      bucketId,
      domainIdentifier,
      options
    );
  }

  async verifyBucketDomain(
    bucketId: string,
    domainIdentifier: string
  ): Promise<Domain> {
    return await this.bucketManager.verifyBucketDomain(
      bucketId,
      domainIdentifier
    );
  }

  async deleteBucketDomain(
    bucketId: string,
    domainIdentifier: string
  ): Promise<void> {
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
  ): Promise<Upload[]> {
    return await this.bucketManager.getBucketUploads(bucketId, options);
  }

  async getUpload(uploadId: string): Promise<Upload> {
    return await this.bucketManager.getUpload(uploadId);
  }
}

export default SpheronClient;
