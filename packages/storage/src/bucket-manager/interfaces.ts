import { DomainTypeEnum, ProjectStateEnum } from "../spheron-api/enums";

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

export { Bucket, Domain, Upload, BucketStateEnum, UploadStatusEnum };
