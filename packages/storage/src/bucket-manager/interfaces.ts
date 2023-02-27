import { DeploymentStatusEnum, ProjectStateEnum } from "../spheron-api/enums";

interface Domain {
  _id: string;
  name: string;
  link: string;
  verified: boolean;
  bucketId: string;
}

interface Bucket {
  _id: string;
  name: string;
  organizationId: string;
  state: ProjectStateEnum;
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

export { Bucket, Domain, Upload };
