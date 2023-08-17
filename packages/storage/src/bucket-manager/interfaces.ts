import {
  BucketStateEnum,
  DomainTypeEnum,
  UploadStatusEnum,
  UploadedFile,
} from "@spheron/core";

interface Domain {
  id: string;
  name: string;
  link: string;
  verified: boolean;
  bucketId: string;
  type: DomainTypeEnum;
}

interface IpnsRecord {
  id: string;
  ipnsHash: string;
  ipnsLink: string;
  publishedUploadId: string;
  bucketId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Bucket {
  id: string;
  name: string;
  organizationId: string;
  state: BucketStateEnum;
}

interface Upload {
  id: string;
  protocolLink: string;
  uploadDirectory: UploadedFile[];
  status: UploadStatusEnum;
  memoryUsed: number;
  bucketId: string;
  protocol: string;
}

/*
        "usedImageOptimizations": 0,
        "imageOptimizationsLimit": 1000
    */

interface UsageWithLimits {
  used: {
    bandwidth: number; // Bytes
    storageArweave: number; // Bytes
    storageIPFS: number; // Bytes
    storageFilecoin: number; // Bytes
    domains: number;
    hnsDomains: number;
    ensDomains: number;
    numberOfRequests: number;
    parallelUploads: number;
    imageOptimization: number;
  };
  limit: {
    bandwidth: number; // Bytes
    storageArweave: number; // Bytes
    storageIPFS: number; // Bytes
    storageFilecoin: number; // Bytes
    domains: number;
    hnsDomains: number;
    ensDomains: number;
    parallelUploads: number;
    imageOptimization: number;
  };
}

export {
  Bucket,
  Domain,
  Upload,
  BucketStateEnum,
  UploadStatusEnum,
  UsageWithLimits,
  IpnsRecord,
};
