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
} from "@spheron/core";
import { createPayloads } from "./fs-payload-creator";
import { ipfs } from "./ipfs.utils";
import { UsageWithLimits } from "./bucket-manager/interfaces";
// import { DecryptFromIpfsProps, EncryptToIpfsProps } from "./interface";
// import {
//   decryptFile,
//   decryptString,
//   encryptFile,
//   encryptString,
//   uint8arrayToString,
// } from "@spheron/encryption";
// import { promises as fs } from "fs";

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

  // async encryptUpload({
  //   authSig,
  //   sessionSigs,
  //   accessControlConditions,
  //   evmContractConditions,
  //   solRpcConditions,
  //   unifiedAccessControlConditions,
  //   chain,
  //   string,
  //   file,
  //   litNodeClient,
  //   configuration,
  // }: EncryptToIpfsProps): Promise<UploadResult> {
  //   if (string === undefined && file === undefined)
  //     throw new Error(`Either string or file must be provided`);

  //   let encryptedData;
  //   let symmetricKey;
  //   if (string !== undefined && file !== undefined) {
  //     throw new Error(`Provide only either a string or file to encrypt`);
  //   } else if (string !== undefined) {
  //     const encryptedString = await encryptString(string);
  //     encryptedData = encryptedString.encryptedString;
  //     symmetricKey = encryptedString.symmetricKey;
  //   } else {
  //     // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  //     const encryptedFile = await encryptFile({ file: file! });
  //     encryptedData = encryptedFile.encryptedFile;
  //     symmetricKey = encryptedFile.symmetricKey;
  //   }

  //   const encryptedSymmetricKey = await litNodeClient.saveEncryptionKey({
  //     accessControlConditions,
  //     evmContractConditions,
  //     solRpcConditions,
  //     unifiedAccessControlConditions,
  //     symmetricKey,
  //     authSig,
  //     sessionSigs,
  //     chain,
  //   });

  //   console.log("encrypted key saved to Lit", encryptedSymmetricKey);

  //   const encryptedSymmetricKeyString = uint8arrayToString(
  //     encryptedSymmetricKey,
  //     "base16"
  //   );

  //   const encryptedDataJson = Buffer.from(
  //     await encryptedData.arrayBuffer()
  //   ).toJSON();
  //   try {
  //     const uploadJson = JSON.stringify({
  //       [string !== undefined ? "encryptedString" : "encryptedFile"]:
  //         encryptedDataJson,
  //       encryptedSymmetricKeyString,
  //       accessControlConditions,
  //       evmContractConditions,
  //       solRpcConditions,
  //       unifiedAccessControlConditions,
  //       chain,
  //     });
  //     const filePath = "./data.json";
  //     // Write the JSON data to the file
  //     await fs.writeFile(filePath, uploadJson);
  //     //Upload it to spheron
  //     const res = await this.upload(filePath, configuration);
  //     // Delete the JSON file
  //     await fs.unlink(filePath);
  //     return res;
  //   } catch (e) {
  //     throw new Error(`Upload failed: ${e.message}`);
  //   }
  // }

  // async decryptUpload({
  //   authSig,
  //   sessionSigs,
  //   ipfsCid,
  //   litNodeClient,
  // }: DecryptFromIpfsProps): Promise<string | Uint8Array> {
  //   try {
  //     const metadataRes = await (
  //       await fetch(
  //         `https://gateway.spheron.link/ipfs/${ipfsCid}/data.json`
  //       ).catch(() => {
  //         throw new Error("Error finding metadata from IPFS CID");
  //       })
  //     ).json();
  //     const metadata = JSON.parse(metadataRes);

  //     console.log("metadata", metadata.accessControlConditions);

  //     const symmetricKey = await litNodeClient.getEncryptionKey({
  //       accessControlConditions: metadata.accessControlConditions,
  //       evmContractConditions: metadata.evmContractConditions,
  //       solRpcConditions: metadata.solRpcConditions,
  //       unifiedAccessControlConditions: metadata.unifiedAccessControlConditions,
  //       toDecrypt: metadata.encryptedSymmetricKeyString,
  //       chain: metadata.chain,
  //       authSig,
  //       sessionSigs,
  //     });
  //     console.log("symmetricKey", symmetricKey);

  //     if (metadata.encryptedString !== undefined) {
  //       const encryptedStringBlob = new Blob(
  //         [Buffer.from(metadata.encryptedString)],
  //         { type: "application/octet-stream" }
  //       );
  //       return await decryptString(encryptedStringBlob, symmetricKey);
  //     }

  //     const encryptedFileBlob = new Blob(
  //       [Buffer.from(metadata.encryptedFile)],
  //       {
  //         type: "application/octet-stream",
  //       }
  //     );
  //     return await decryptFile({ file: encryptedFileBlob, symmetricKey });
  //   } catch (e) {
  //     console.log("Error on decrypt", e);
  //     throw new Error(e.message);
  //   }
  // }

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
}

export default SpheronClient;
