import {
  DeploymentStatusEnum,
  DomainTypeEnum,
  ProjectStateEnum,
} from "../spheron-api/enums";

interface Domain {
  _id: string;
  name: string;
  link: string;
  verified: boolean;
  bucketId: string;
  type: DomainTypeEnum;
}

type BucketStateEnum = ProjectStateEnum;

interface Bucket {
  _id: string;
  name: string;
  organizationId: string;
  state: BucketStateEnum;
  domains: Domain[];
}

interface Upload {
  _id: string;
  protocolLink: string;
  buildDirectory: string[];
  status: DeploymentStatusEnum;
  memoryUsed: number;
  bucketId: string;
  protocol: string;
}

export { Bucket, Domain, Upload, BucketStateEnum };
