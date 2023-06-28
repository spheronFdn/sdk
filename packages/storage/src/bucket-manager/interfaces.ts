import {
  BucketStateEnum,
  DomainTypeEnum,
  UploadStatusEnum,
} from "@spheron/core";

interface Domain {
  id: string;
  name: string;
  link: string;
  verified: boolean;
  bucketId: string;
  type: DomainTypeEnum;
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
  uploadDirectory: string[];
  status: UploadStatusEnum;
  memoryUsed: number;
  bucketId: string;
  protocol: string;
}

interface UsageWithLimits {
  used: {
    bandwidth: number; // Bytes
    storageArweave: number; // Bytes
    storageIPFS: number; // Bytes
    domains: number;
    numberOfRequests: number;
    parallelUploads: number;
  };
  limit: {
    bandwidth: number; // Bytes
    storageArweave: number; // Bytes
    storageIPFS: number; // Bytes
    domains: number;
    parallelUploads: number;
  };
}

export {
  Bucket,
  Domain,
  Upload,
  BucketStateEnum,
  UploadStatusEnum,
  UsageWithLimits,
};
