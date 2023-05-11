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
  usedBuildExecution?: number; // Seconds
  usedConcurrentBuild?: number;
  usedStorageArweave?: number; // Bytes
  usedStorageIPFS?: number; // Bytes
  usedDeploymentsPerDay?: number;
  lastDeploymentDate?: Date;
  usedDomains?: number;
  usedHnsDomains?: number;
  usedEnsDomains?: number;
  usedEnvironments?: number;
  usedNumberOfRequests?: number;
  usedPasswordProtections?: number;
  membersLimit?: number;
  bandwidthLimit?: number; // Bytes
  buildExecutionLimit?: number; // Seconds
  concurrentBuildLimit?: number;
  storageArweaveLimit?: number; // Bytes
  storageIPFSLimit?: number;
  deploymentsPerDayLimit?: number;
  domainsLimit?: number;
  hnsDomainsLimit?: number;
  ensDomainsLimit?: number;
  environmentsLimit?: number;
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
