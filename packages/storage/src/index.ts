import BucketManager, {
  Bucket,
  Upload,
  BucketStateEnum,
  Domain,
  DomainTypeEnum,
  UploadStatusEnum,
} from "./bucket-manager";
import {
  IPNSName,
  ProtocolEnum,
  SpheronApi,
  TokenScope,
  UploadManager,
  UploadResult,
  PinStatus,
  DealDataResult,
} from "@spheron/core";
import { createPayloads, processCarFile } from "./fs-payload-creator";
import { ipfs } from "./ipfs.utils";
import { UsageWithLimits } from "./bucket-manager/interfaces";
import fs from 'fs';

import { DecryptFromIpfsProps, EncryptToIpfsProps } from "./interface";
import {
  uint8arrayFromString,
  encryptData,
  uint8arrayToString,
  decryptData,
} from "@spheron/encryption";
import { readFileContent } from "./utils";
import FormData from "form-data";

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
  IPNSName,
  uint8arrayToString,
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
    path: string,
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
      });

    let success = true;
    let caughtError: Error | undefined = undefined;
    try {
      const { payloads, totalSize } = await createPayloads(path, payloadSize);

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
      if (!uploadPayloadsResult.success) {
        throw new Error(uploadPayloadsResult.errorMessage);
      }
    } catch (error) {
      success = false;
      caughtError = error;
    }

    const result = await this.uploadManager.finalizeUploadDeployment(
      deploymentId,
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
      uploadId: result.deploymentId,
      bucketId: result.projectId,
      protocolLink: result.sitePreview,
      dynamicLinks: result.affectedDomains,
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
  }: EncryptToIpfsProps): Promise<UploadResult> {
    if (!string && !filePath) {
      throw new Error(`Either string or filePath must be provided`);
    }

    if (!configuration.name) {
      throw new Error(`Name must be provided`);
    }

    let dataToEncrypt: Uint8Array | null = null;
    if (string && filePath) {
      throw new Error(`Provide only either a string or filePath to encrypt`);
    } else if (string !== undefined) {
      dataToEncrypt = uint8arrayFromString(string, "utf8");
    } else if (filePath !== undefined) {
      const { content } = await readFileContent(filePath);
      dataToEncrypt = content;
    } else {
      throw new Error(`Either string or file must be provided`);
    }

    if (!dataToEncrypt) {
      throw new Error(`No data to encrypt`);
    }

    const { encryptedData, symmetricKey } = await encryptData(dataToEncrypt);

    const encryptedSymmetricKey = await litNodeClient.saveEncryptionKey({
      accessControlConditions,
      evmContractConditions,
      solRpcConditions,
      unifiedAccessControlConditions,
      symmetricKey,
      authSig,
      sessionSigs,
      chain,
    });

    const encryptedSymmetricKeyString = uint8arrayToString(
      encryptedSymmetricKey,
      "base16"
    );

    const encryptedDataJson = Buffer.from(encryptedData.buffer).toJSON();

    try {
      const uploadJson = JSON.stringify({
        encryptedData: encryptedDataJson,
        encryptedSymmetricKeyString,
        accessControlConditions,
        evmContractConditions,
        solRpcConditions,
        unifiedAccessControlConditions,
        chain,
      });

      const { deploymentId, parallelUploadCount } =
        await this.uploadManager.initiateDeployment({
          protocol: ProtocolEnum.IPFS,
          name: configuration.name,
          token: this.configuration.token,
        });

      configuration.onUploadInitiated &&
        configuration.onUploadInitiated(deploymentId);

      let success = true;
      let caughtError: Error | undefined = undefined;
      const totalSize = Buffer.byteLength(uploadJson, "utf8");
      try {
        const form = new FormData();
        form.append("files", uploadJson, "data.json");
        const uploadPayloadsResult = await this.uploadManager.uploadPayloads(
          [form],
          {
            deploymentId,
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

      const result = await this.uploadManager.finalizeUploadDeployment(
        deploymentId,
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
        uploadId: result.deploymentId,
        bucketId: result.projectId,
        protocolLink: result.sitePreview,
        dynamicLinks: result.affectedDomains,
        cid: result.cid,
      };
    } catch (e) {
      throw new Error(`Upload failed: ${e.message}`);
    }
  }

  async decryptUpload({
    authSig,
    sessionSigs,
    ipfsCid,
    litNodeClient,
  }: DecryptFromIpfsProps): Promise<Uint8Array> {
    const metadata = await (
      await fetch(`https://${ipfsCid}.ipfs.sphn.link/data.json`).catch(() => {
        throw new Error("Error finding metadata from IPFS CID");
      })
    ).json();

    const symmetricKey = await litNodeClient.getEncryptionKey({
      accessControlConditions: metadata.accessControlConditions,
      evmContractConditions: metadata.evmContractConditions,
      solRpcConditions: metadata.solRpcConditions,
      unifiedAccessControlConditions: metadata.unifiedAccessControlConditions,
      toDecrypt: metadata.encryptedSymmetricKeyString,
      chain: metadata.chain,
      authSig,
      sessionSigs,
    });

    const encrypted = new Uint8Array(Buffer.from(metadata.encryptedData));

    return decryptData(encrypted, symmetricKey);
  }

  async createSingleUploadToken(configuration: {
    name: string;
    protocol: ProtocolEnum;
  }): Promise<{ uploadToken: string }> {
    const { singleDeploymentToken } =
      await this.uploadManager.initiateDeployment({
        protocol: configuration.protocol,
        name: configuration.name,
        token: this.configuration.token,
        createSingleDeploymentToken: true,
      });

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return { uploadToken: singleDeploymentToken! };
  }

  async pinCID(configuration: { name: string; cid: string }): Promise<{
    uploadId: string;
    bucketId: string;
    protocolLink: string;
    dynamicLinks: string[];
  }> {
    const { deploymentId, projectId, sitePreview, affectedDomains } =
      await this.uploadManager.pinCID({
        name: configuration.name,
        token: this.configuration.token,
        cid: configuration.cid,
      });

    return {
      uploadId: deploymentId,
      bucketId: projectId,
      protocolLink: sitePreview,
      dynamicLinks: affectedDomains,
    };
  }

  async getBucket(bucketId: string): Promise<Bucket> {
    return await this.bucketManager.getBucket(bucketId);
  }

  async getCIDStatus(CID: string): Promise<{ pinStatus: PinStatus }> {
    return await this.uploadManager.getCIDStatus(CID);
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

  async getCdnDnsRecords(): Promise<{
    cdnARecords: string;
    cdnCnameRecords: string;
  }> {
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

  async publishIPNS(uploadId: string): Promise<IPNSName> {
    return await this.spheronApi.publishIPNS(uploadId);
  }

  async updateIPNSName(
    ipnsNameId: string,
    uploadId: string
  ): Promise<IPNSName> {
    return await this.spheronApi.updateIPNSName(ipnsNameId, uploadId);
  }

  async getIPNSName(ipnsNameId: string): Promise<IPNSName> {
    return await this.spheronApi.getIPNSName(ipnsNameId);
  }

  async getIPNSNamesForUpload(uploadId: string): Promise<IPNSName[]> {
    return await this.spheronApi.getIPNSNamesForUpload(uploadId);
  }

  async getIPNSNamesForOrganization(
    organizationId: string
  ): Promise<IPNSName[]> {
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

    return {
      used: {
        bandwidth: usage.usedBandwidth ?? 0,
        storageArweave: usage.usedStorageArweave ?? 0,
        storageIPFS: usage.usedStorageIPFS ?? 0,
        domains: usage.usedDomains ?? 0,
        numberOfRequests: usage.usedNumberOfRequests ?? 0,
        parallelUploads: usage.usedParallelUploads ?? 0,
      },
      limit: {
        bandwidth: usage.bandwidthLimit ?? 0,
        storageArweave: usage.storageArweaveLimit ?? 0,
        storageIPFS: usage.storageIPFSLimit ?? 0,
        domains: usage.domainsLimit ?? 0,
        parallelUploads: usage.parallelUploadsLimit ?? 0,
      },
    };
  }

  async getTokenScope(): Promise<TokenScope> {
    return await this.spheronApi.getTokenScope();
  }

  async getPrepData (filename: string): Promise<DealDataResult> {    
    const carFileResults: any = await processCarFile(filename)    
    let currentlyUploaded = 0;
    const UploadResult = await this.upload(
      carFileResults.filePath,
      {
        protocol: ProtocolEnum.IPFS,
        name: 'fvm_car_store',
        onUploadInitiated: (uploadId) => {
          console.log(`Upload with id ${uploadId} started...`);
        },
        onChunkUploaded: (uploadedSize, totalSize) => {
          currentlyUploaded += uploadedSize;
          console.log(`Uploaded ${currentlyUploaded} of ${totalSize} Bytes.`);
        },
      })
      if (UploadResult.protocolLink) {
        var carlink = UploadResult.protocolLink;
        //console.log('CarLink :', carlink)        
      } else {
        throw new Error('Error: Something went wrong');
      }
      fs.unlinkSync(carFileResults.filePath);
      fs.rmdirSync('out');      
      return {
        pieceSize: carFileResults.pieceSize,        
        size: carFileResults.size,
        pieceCid: carFileResults.pieceCid,
        dataCid: carFileResults.dataCid,
        carLink: carlink
      }
              
       
  };
  
};


export default SpheronClient;
