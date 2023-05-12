import { DomainTypeEnum, ProjectStateEnum } from "@spheron/core";

interface Domain {
  id: string;
  name: string;
  link: string;
  verified: boolean;
  bucketId: string;
  type: DomainTypeEnum;
}

type BucketStateEnum = ProjectStateEnum;

interface Bucket {
  id: string;
  name: string;
  organizationId: string;
  state: BucketStateEnum;
  domains: Domain[];
}

enum UploadStatusEnum {
  PENDING = "Pending",
  CANCELED = "Canceled",
  DEPLOYED = "Deployed",
  FAILED = "Failed",
  TIMED_OUT = "TimedOut",
}

interface Upload {
  id: string;
  protocolLink: string;
  buildDirectory: string[];
  status: UploadStatusEnum;
  memoryUsed: number;
  bucketId: string;
  protocol: string;
}

interface UsageWithLimits {
  usedBandwidth?: number; // Bytes
  usedStorageArweave?: number; // Bytes
  usedStorageIPFS?: number; // Bytes
  usedDomains?: number;
  usedNumberOfRequests?: number;
  bandwidthLimit?: number; // Bytes
  storageArweaveLimit?: number; // Bytes
  storageIPFSLimit?: number;
  domainsLimit?: number;
  usedParallelUploads?: number;
  parallelUploadsLimit?: number;
}

export {
  Bucket,
  Domain,
  Upload,
  BucketStateEnum,
  UploadStatusEnum,
  UsageWithLimits,
};
