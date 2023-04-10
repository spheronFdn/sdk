import UploadManager, { UploadResult } from "./upload-manager";
import { ProtocolEnum } from "./enums";
import SpheronApi from "./spheron-api";
import BucketManager, {
  Bucket,
  Upload,
  BucketStateEnum,
  Domain,
  DomainTypeEnum,
  UploadStatusEnum,
} from "./bucket-manager";
import {
  IIPNSName,
  IPNSPublishResponse,
  TokenScope,
  UsageWithLimits,
} from "./spheron-api/interfaces";

export {
  ProtocolEnum,
  Bucket,
  Upload,
  BucketStateEnum,
  Domain,
  DomainTypeEnum,
  UploadStatusEnum,
  UsageWithLimits,
  TokenScope,
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
    this.uploadManager = new UploadManager(this.configuration);
  }

  async upload(
    path: string,
    configuration: {
      name: string;
      protocol: ProtocolEnum;
      organizationId?: string;
      onUploadInitiated?: (uploadId: string) => void;
      onChunkUploaded?: (uploadedSize: number, totalSize: number) => void;
    }
  ): Promise<UploadResult> {
    return await this.uploadManager.upload({
      path,
      name: configuration.name,
      protocol: configuration.protocol,
      organizationId: configuration.organizationId,
      onChunkUploaded: configuration.onChunkUploaded,
      onUploadInitiated: configuration.onUploadInitiated,
    });
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

  async publishIPNS(uploadId: string): Promise<IIPNSName> {
    return await this.spheronApi.publishIPNS(uploadId);
  }

  async updateIPNSName(
    ipnsNameId: string,
    uploadId: string
  ): Promise<IIPNSName> {
    return await this.spheronApi.updateIPNSName(ipnsNameId, uploadId);
  }

  async getIPNSName(ipnsNameId: string): Promise<IIPNSName> {
    return await this.spheronApi.getIPNSName(ipnsNameId);
  }

  async getIPNSNamesForDeployment(deploymentId: string): Promise<IIPNSName[]> {
    return await this.spheronApi.getIPNSNamesForDeployment(deploymentId);
  }

  async getIPNSNamesForOrganization(
    organizationId: string
  ): Promise<IIPNSName[]> {
    return await this.spheronApi.getIPNSNamesForOrganization(organizationId);
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

  async getOrganizationUsage(organizationId: string): Promise<UsageWithLimits> {
    const usage = await this.spheronApi.getOrganizationUsage(
      organizationId,
      "wa-global"
    );

    const { usedStorageSkynet, storageSkynetLimit, ...resultWithoutSkynet } =
      usage;
    return resultWithoutSkynet;
  }

  async getTokenScope(): Promise<TokenScope> {
    return await this.spheronApi.getTokenScope();
  }
}

(async () => {
  const spheronClient = new SpheronClient({
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlLZXkiOiJjMTQ2ZmVjY2E1NGNkNjU2YWJkZjViMzY5ZDc2MDUxY2MwMTg2OGZkMmY4YjIzMjIwNjhiYjNmYzZmZWM1Nzc3NWI0ZjFmZDM3ZmY1MDliYjY3ZTcwOTA5ODA0NmJjYTU3OGY5NjkyN2I2ZmNkOTFmYTFlNjZkYjdkZjM1NGQ5MyIsImlhdCI6MTY4MDg2OTkzNiwiaXNzIjoid3d3LnNwaGVyb24ubmV0d29yayJ9.DHbZWb9oCel05IcGcS90XPradGnLV0jC_KnBbGbZOlE",
  });

  const resp = await spheronClient.publishIPNS("642d7526dad7300012d3fb7c");
  console.log("resp: ", resp);

  const allipns = await spheronClient.getIPNSNamesForOrganization(
    "642d7331dad7300012d3fb02"
  );
  console.log("allipns: ", allipns);

  const allipnsdeployment = await spheronClient.getIPNSNamesForDeployment(
    "642d7526dad7300012d3fb7c"
  );
  console.log("allipnsdeployment: ", allipnsdeployment);

  const allipnsName = await spheronClient.getIPNSName(
    "6433a64908a7d758d04b9e10"
  );
  console.log("allipnsName: ", allipnsName);

  const updateIPNS = await spheronClient.updateIPNSName(
    "6433a64908a7d758d04b9e10",
    "642d7526dad7300012d3fb7c"
  );
  console.log("updateIPNS: ", updateIPNS);
})();

export default SpheronClient;
