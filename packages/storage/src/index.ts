import BucketManager, {
  Bucket,
  Upload,
  BucketStateEnum,
  Domain,
  DomainTypeEnum,
  UploadStatusEnum,
} from "./bucket-manager";
import {
  ProtocolEnum,
  SpheronApi,
  TokenScope,
  UploadManager,
  UploadResult,
  PinStatus,
  ScopeExtractor,
  AppTypeEnum,
} from "@spheron/core";
import { createPayloads } from "./fs-payload-creator";
import { ipfs } from "./ipfs.utils";
import { IpnsRecord, UsageWithLimits } from "./bucket-manager/interfaces";
import { DecryptFromIpfsProps, EncryptToIpfsProps } from "./interface";
import {
  uint8arrayFromString,
  encryptData,
  uint8arrayToString,
  decryptData,
} from "@spheron/encryption";
import { readFileContent } from "./utils";
import FormData from "form-data";
import {
  encryptString,
  encryptFile,
  decryptToString,
  decryptToFile,
} from "@lit-protocol/lit-node-client";

export {
  ipfs,
  ProtocolEnum,
  Bucket,
  Upload,
  BucketStateEnum,
  Domain,
  DomainTypeEnum,
  UploadStatusEnum,
  UsageWithLimits,
  TokenScope,
  uint8arrayToString,
  IpnsRecord,
};

export interface SpheronClientConfiguration {
  token: string;
  apiUrl?: string;
}

export class SpheronClient extends ScopeExtractor {
  private readonly configuration: SpheronClientConfiguration;
  private readonly spheronApi: SpheronApi;
  private readonly bucketManager: BucketManager;
  private readonly uploadManager: UploadManager;

  constructor(configuration: SpheronClientConfiguration) {
    const spheronApi = new SpheronApi(
      configuration.token,
      configuration?.apiUrl
    );
    super(spheronApi);
    this.spheronApi = spheronApi;
    this.configuration = configuration;
    this.bucketManager = new BucketManager(this.spheronApi);
    this.uploadManager = new UploadManager(configuration?.apiUrl);
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
    await this.validateStorageOrganizationType();

    const { uploadId, payloadSize, parallelUploadCount } =
      await this.uploadManager.initiateUpload({
        protocol: configuration.protocol,
        name: configuration.name,
        organizationId: configuration.organizationId,
        token: this.configuration.token,
      });

    let success = true;
    let caughtError: Error | undefined = undefined;
    try {
      const { payloads, totalSize } = await createPayloads(path, payloadSize);

      configuration.onUploadInitiated &&
        configuration.onUploadInitiated(uploadId);

      const uploadPayloadsResult = await this.uploadManager.uploadPayloads(
        payloads,
        {
          uploadId,
          token: this.configuration.token,
          parallelUploadCount,
          onChunkUploaded: (uploadedSize: number) =>
            configuration.onChunkUploaded &&
            configuration.onChunkUploaded(uploadedSize, totalSize),
        }
      );
      if (!uploadPayloadsResult.success) {
        throw new Error(uploadPayloadsResult.errorMessage);
      }
    } catch (error) {
      success = false;
      caughtError = error;
    }

    const result = await this.uploadManager.finalizeUpload(
      uploadId,
      success,
      this.configuration.token
    );

    if (caughtError) {
      throw caughtError;
    }

    if (!result.success) {
      throw new Error(`Upload failed. ${result.message}`);
    }

    return {
      uploadId: result.uploadId,
      bucketId: result.bucketId,
      protocolLink: result.protocolLink,
      dynamicLinks: result.dynamicLinks,
      cid: result.cid,
    };
  }

  async encryptUpload({
    authSig,
    sessionSigs,
    accessControlConditions,
    evmContractConditions,
    solRpcConditions,
    unifiedAccessControlConditions,
    chain,
    string,
    filePath,
    litNodeClient,
    configuration,
  }: any): Promise<UploadResult> {
    await this.validateStorageOrganizationType();

    if (!string && !filePath) {
      throw new Error(`Either string or filePath must be provided`);
    }

    if (!configuration.name) {
      throw new Error(`Name must be provided`);
    }

    let dataToEncrypt: any;
    let ciphertext: string;
    let dataToEncryptHash: string;
    if (string && filePath) {
      throw new Error(`Provide only either a string or filePath to encrypt`);
    } else if (string !== undefined) {
      dataToEncrypt = string;
      const response = await encryptString(
        {
          accessControlConditions,
          authSig,
          chain,
          dataToEncrypt,
          sessionSigs,
          evmContractConditions,
          solRpcConditions,
          unifiedAccessControlConditions,
        },
        litNodeClient
      );
      ciphertext = response.ciphertext;
      dataToEncryptHash = response.dataToEncryptHash;
    } else if (filePath !== undefined) {
      const { content } = await readFileContent(filePath);
      dataToEncrypt = content;
      const response = await encryptFile(
        {
          accessControlConditions,
          authSig,
          chain,
          file: dataToEncrypt,
          sessionSigs,
          evmContractConditions,
          solRpcConditions,
          unifiedAccessControlConditions,
        },
        litNodeClient
      );
      ciphertext = response.ciphertext;
      dataToEncryptHash = response.dataToEncryptHash;
    } else {
      throw new Error(`Either string or file must be provided`);
    }

    if (!dataToEncrypt) {
      throw new Error(`No data to encrypt`);
    }

    try {
      const uploadJson = JSON.stringify({
        dataToEncryptHash,
        ciphertext,
        accessControlConditions,
        evmContractConditions,
        solRpcConditions,
        unifiedAccessControlConditions,
        chain,
        file: filePath ? true : false,
      });

      const { uploadId, parallelUploadCount } =
        await this.uploadManager.initiateUpload({
          protocol: ProtocolEnum.IPFS,
          name: configuration.name,
          token: this.configuration.token,
        });

      configuration.onUploadInitiated &&
        configuration.onUploadInitiated(uploadId);

      let success = true;
      let caughtError: Error | undefined = undefined;
      const totalSize = Buffer.byteLength(uploadJson, "utf8");
      try {
        const form = new FormData();
        form.append("files", uploadJson, "data.json");
        const uploadPayloadsResult = await this.uploadManager.uploadPayloads(
          [form],
          {
            uploadId,
            token: this.configuration.token,
            parallelUploadCount,
            onChunkUploaded: (uploadedSize: number) =>
              configuration.onChunkUploaded &&
              configuration.onChunkUploaded(uploadedSize, totalSize),
          }
        );
        if (!uploadPayloadsResult.success) {
          throw new Error(uploadPayloadsResult.errorMessage);
        }
      } catch (error) {
        success = false;
        caughtError = error;
      }

      const result = await this.uploadManager.finalizeUpload(
        uploadId,
        success,
        this.configuration.token
      );

      if (caughtError) {
        throw caughtError;
      }

      if (!result.success) {
        throw new Error(`Upload failed. ${result.message}`);
      }

      return {
        uploadId: result.uploadId,
        bucketId: result.bucketId,
        protocolLink: result.protocolLink,
        dynamicLinks: result.dynamicLinks,
        cid: result.cid,
      };
    } catch (e) {
      throw new Error(`Upload failed: ${e.message}`);
    }
  }

  async decryptUpload({
    authSig,
    // sessionSigs,
    ipfsCid,
    litNodeClient,
  }: any): Promise<any> {
    await this.validateStorageOrganizationType();

    const metadata = await (
      await fetch(`https://${ipfsCid}.ipfs.sphn.link/data.json`).catch(() => {
        throw new Error("Error finding metadata from IPFS CID");
      })
    ).json();

    if (metadata.file) {
      const decryptedFile = await decryptToFile(
        {
          accessControlConditions: metadata.accessControlConditions,
          ciphertext: metadata.ciphertext,
          dataToEncryptHash: metadata.dataToEncryptHash,
          authSig,
          chain: metadata.chain,
        },
        litNodeClient
      );

      return decryptedFile;
    } else {
      const decryptedString = await decryptToString(
        {
          accessControlConditions: metadata.accessControlConditions,
          ciphertext: metadata.ciphertext,
          dataToEncryptHash: metadata.dataToEncryptHash,
          authSig,
          chain: metadata.chain,
        },
        litNodeClient
      );

      return decryptedString;
    }
  }

  async createSingleUploadToken(configuration: {
    name: string;
    protocol: ProtocolEnum;
    maxSize?: number;
  }): Promise<{ uploadToken: string }> {
    await this.validateStorageOrganizationType();

    const { singleUseToken } = await this.uploadManager.initiateUpload({
      protocol: configuration.protocol,
      name: configuration.name,
      token: this.configuration.token,
      createSingleUseToken: true,
      maxSize: configuration.maxSize,
    });

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return { uploadToken: singleUseToken! };
  }

  async pinCID(configuration: {
    name: string;
    cid: string;
    inBackground?: boolean;
  }): Promise<{
    uploadId: string;
    bucketId: string;
    protocolLink: string;
    dynamicLinks: string[];
  }> {
    await this.validateStorageOrganizationType();

    return await this.uploadManager.pinCID({
      name: configuration.name,
      token: this.configuration.token,
      cid: configuration.cid,
      inBackground: configuration.inBackground,
    });
  }

  async pinCIDs(configuration: { name: string; cids: string[] }): Promise<
    {
      uploadId: string;
      cid: string;
    }[]
  > {
    await this.validateStorageOrganizationType();

    return await this.uploadManager.pinCIDs({
      name: configuration.name,
      cids: configuration.cids,
      token: this.configuration.token,
    });
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
    await this.validateStorageOrganizationType();

    return await this.bucketManager.getOrganizationBuckets(
      organizationId,
      options
    );
  }

  async getOrganizationBucketCount(
    organizationId: string,
    options?: {
      name?: string;
      state?: BucketStateEnum;
    }
  ): Promise<number> {
    await this.validateStorageOrganizationType();

    return await this.bucketManager.getOrganizationBucketCount(
      organizationId,
      options
    );
  }

  async getBucket(bucketId: string): Promise<Bucket> {
    await this.validateStorageOrganizationType();

    return await this.bucketManager.getBucket(bucketId);
  }

  async getCIDStatus(CID: string): Promise<{ pinStatus: PinStatus }> {
    await this.validateStorageOrganizationType();

    return await this.uploadManager.getCIDStatus(CID);
  }

  async getBucketDomains(bucketId: string): Promise<Domain[]> {
    await this.validateStorageOrganizationType();

    return await this.bucketManager.getBucketDomains(bucketId);
  }

  async getBucketDomain(
    bucketId: string,
    domainIdentifier: string
  ): Promise<Domain> {
    await this.validateStorageOrganizationType();

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
    await this.validateStorageOrganizationType();

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
    await this.validateStorageOrganizationType();

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
    await this.validateStorageOrganizationType();

    return await this.bucketManager.verifyBucketDomain(
      bucketId,
      domainIdentifier
    );
  }

  async getCdnDnsRecords(): Promise<{
    cdnARecords: string;
    cdnCnameRecords: string;
  }> {
    await this.validateStorageOrganizationType();

    const { recordIpv4V2, recordCnameV2 } =
      await this.spheronApi.getCdnRecords();
    return {
      cdnARecords: recordIpv4V2,
      cdnCnameRecords: recordCnameV2,
    };
  }

  async deleteBucketDomain(
    bucketId: string,
    domainIdentifier: string
  ): Promise<void> {
    await this.validateStorageOrganizationType();

    return await this.bucketManager.deleteBucketDomain(
      bucketId,
      domainIdentifier
    );
  }

  async archiveBucket(bucketId: string): Promise<void> {
    await this.validateStorageOrganizationType();

    await this.bucketManager.archiveBucket(bucketId);
  }

  async unarchiveBucket(bucketId: string): Promise<void> {
    await this.validateStorageOrganizationType();

    await this.bucketManager.unarchiveBucket(bucketId);
  }

  async getBucketUploadCount(bucketId: string): Promise<number> {
    await this.validateStorageOrganizationType();

    return await this.bucketManager.getBucketUploadCount(bucketId);
  }

  async getBucketUploads(
    bucketId: string,
    options: {
      skip: number;
      limit: number;
    }
  ): Promise<Upload[]> {
    await this.validateStorageOrganizationType();

    return await this.bucketManager.getBucketUploads(bucketId, options);
  }

  async getUpload(uploadId: string): Promise<Upload> {
    await this.validateStorageOrganizationType();

    return await this.bucketManager.getUpload(uploadId);
  }

  async pinUpload(uploadId: string): Promise<Upload> {
    await this.validateStorageOrganizationType();

    return await this.bucketManager.pinUpload(uploadId);
  }

  async unpinUpload(uploadId: string): Promise<Upload> {
    await this.validateStorageOrganizationType();

    return await this.bucketManager.unpinUpload(uploadId);
  }

  async getOrganizationUsage(organizationId: string): Promise<UsageWithLimits> {
    await this.validateStorageOrganizationType();

    const usage = await this.spheronApi.getOrganizationUsage(
      organizationId,
      "storage"
    );

    return {
      used: {
        bandwidth: usage.usedBandwidth ?? 0,
        storageArweave: usage.usedStorageArweave ?? 0,
        storageIPFS: usage.usedStorageIPFS ?? 0,
        storageFilecoin: usage.usedStorageFilecoin ?? 0,
        domains: usage.usedDomains ?? 0,
        hnsDomains: usage.usedHnsDomains ?? 0,
        ensDomains: usage.usedEnsDomains ?? 0,
        numberOfRequests: usage.usedNumberOfRequests ?? 0,
        parallelUploads: usage.usedParallelUploads ?? 0,
        imageOptimization: usage.usedImageOptimizations ?? 0,
        ipfsBandwidth: usage.usedIpfsBandwidth ?? 0,
        ipfsNumberOfRequests: usage.usedIpfsNumberOfRequests ?? 0,
      },
      limit: {
        bandwidth: usage.bandwidthLimit ?? 0,
        storageArweave: usage.storageArweaveLimit ?? 0,
        storageIPFS: usage.storageIPFSLimit ?? 0,
        domains: usage.domainsLimit ?? 0,
        hnsDomains: usage.usedHnsDomains ?? 0,
        ensDomains: usage.usedEnsDomains ?? 0,
        parallelUploads: usage.parallelUploadsLimit ?? 0,
        imageOptimization: usage.imageOptimizationsLimit ?? 0,
        ipfsBandwidth: usage.ipfsBandwidthLimit ?? 0,
      },
    };
  }

  async getTokenScope(): Promise<TokenScope> {
    await this.validateStorageOrganizationType();

    return await this.getScopeFromToken();
  }

  async getBucketIpnsRecords(bucketId: string): Promise<IpnsRecord[]> {
    await this.validateStorageOrganizationType();

    return await this.bucketManager.getBucketIpnsRecords(bucketId);
  }

  async getBucketIpnsRecord(
    bucketId: string,
    ipnsRecordId: string
  ): Promise<IpnsRecord> {
    await this.validateStorageOrganizationType();

    return await this.bucketManager.getBucketIpnsRecord(bucketId, ipnsRecordId);
  }

  async addBucketIpnsRecord(
    bucketId: string,
    uploadId: string
  ): Promise<IpnsRecord> {
    await this.validateStorageOrganizationType();

    return await this.bucketManager.addBucketIpnsRecord(bucketId, uploadId);
  }

  async updateBucketIpnsRecord(
    bucketId: string,
    ipnsRecordId: string,
    uploadId: string
  ): Promise<IpnsRecord> {
    await this.validateStorageOrganizationType();

    return await this.bucketManager.updateBucketIpnsRecord(
      bucketId,
      ipnsRecordId,
      uploadId
    );
  }

  async deleteBucketIpnsRecord(
    bucketId: string,
    ipnsRecordId: string
  ): Promise<void> {
    await this.validateStorageOrganizationType();

    await this.spheronApi.deleteBucketIpnsRecord(bucketId, ipnsRecordId);
  }

  async migrateStaticSiteOrgToStorage(
    staticSiteOrganizationId: string,
    storageOrganizationId: string
  ): Promise<{
    numberOfBuckets: number;
    numberOfUploads: number;
  }> {
    await this.validateStorageOrganizationType();

    return await this.spheronApi.migrateStaticSiteOrgToStorage(
      staticSiteOrganizationId,
      storageOrganizationId
    );
  }

  private async validateStorageOrganizationType(): Promise<void> {
    const type = await this.getOrganizationTypeFromToken();
    if (type != AppTypeEnum.STORAGE) {
      throw new Error(
        "The token used won't work with version >2.0.0 of SDK, please create a new token from your storage organisation."
      );
    }
  }
}

export default SpheronClient;
