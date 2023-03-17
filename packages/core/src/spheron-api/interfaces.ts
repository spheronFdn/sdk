import { AppTypeEnum, ProtocolEnum } from "./enums";
import {
  DeploymentEnvironmentStatusEnum,
  DeploymentStatusEnum,
  DomainApplicationTypeEnum,
  DomainTypeEnum,
  FrameworkEnum,
  NodeVersionEnum,
  ProjectStateEnum,
} from "./enums";
import { ProjectTypeEnum } from "./enums";

interface TokenScope {
  user: {
    id: string;
    username: string;
    name: string;
    email: string;
  };
  organizations: {
    id: string;
    name: string;
    username: string;
  }[];
}

interface DeploymentEnvironment {
  name: string;
  branches: string[];
  status: DeploymentEnvironmentStatusEnum;
  protocol: ProtocolEnum;
  isFree: boolean;
}

interface EnvironmentVariable {
  name: string;
  value: string;
  deploymentEnvironments: DeploymentEnvironment[];
}

interface Configuration {
  _id: string;
  buildCommand: string;
  installCommand: string;
  workspace: string;
  publishDir: string;
  framework: FrameworkEnum;
  nodeVersion: NodeVersionEnum;
}

interface PasswordProtection {
  enabled: boolean;
  credentials: string[];
}

interface Credentials {
  username: string;
  password: string;
}

interface Domain {
  _id: string;
  name: string;
  link: string;
  type: DomainTypeEnum;
  verified: boolean;
  projectId: string;
  deploymentEnvironmentIds: DeploymentEnvironment[];
  version: string;
  credentials: Credentials[];
  appType: DomainApplicationTypeEnum;
  createdAt: Date;
  updatedAt: Date;
}

interface Project {
  _id: string;
  name: string;
  type: ProjectTypeEnum;
  url: string;
  environmentVariables: EnvironmentVariable[];
  deploymentEnvironments: DeploymentEnvironment[];
  organization: string;
  state: ProjectStateEnum;
  hookId: string;
  provider: string;
  prCommentIds: { prId: string; commentId: string }[];
  configuration: Configuration[];
  passwordProtection: PasswordProtection;
  createdAt: Date;
  updatedAt: Date;
  domains: Domain[];
}

interface Deployment {
  _id: string;
  sitePreview: string;
  commitId: string;
  commitMessage: string;
  logs: { time: string; log: string }[];
  buildDirectory: string[];
  contentHash: string;
  topic: string;
  status: DeploymentStatusEnum;
  paymentId: string;
  buildTime: number;
  memoryUsed: number;
  env: object;
  project: Project;
  branch: string;
  externalRepositoryName: string;
  protocol: string;
  deploymentEnvironmentName: string;
  failedMessage: string;
  isFromRequest: boolean;
  configuration: Configuration;
  pickedUpByDeployerAt: number;
  encrypted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Organization {
  _id: string;
  appType: AppTypeEnum;
  profile: {
    name: string;
    image: string;
    username: string;
  };
  users: [string];
  registries: string[];
  overdue: boolean;
}

interface VerifiedTokenResponse {
  jwt: string;
  organizationId: string;
  email: string;
}

export {
  TokenScope,
  Project,
  Domain,
  Deployment,
  Configuration,
  Organization,
  VerifiedTokenResponse,
};
