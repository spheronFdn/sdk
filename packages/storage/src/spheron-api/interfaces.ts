import { ProtocolEnum } from "../enums";
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

export interface UsageWithLimits {
  usedBandwidth?: number; //bytes
  usedBuildExecution?: number; //sec
  usedConcurrentBuild?: number;
  usedStorageArweave?: number; //bytes
  usedStorageSkynet?: number; //bytes
  usedStorageFileCoin?: number; //bytes
  usedStorageIPFS?: number; //bytes
  usedDeploymentsPerDay?: number;
  lastDeploymentDate?: Date;
  usedDomains?: number;
  usedHnsDomains?: number;
  usedEnsDomains?: number;
  usedEnvironments?: number;
  usedClusterAkt?: number;
  usedClusterBuildExecution?: number;
  usedNumberOfRequests?: number;
  usedPasswordProtections?: number;
  membersLimit?: number;
  bandwidthLimit?: number; //bytes
  buildExecutionLimit?: number; //sec
  concurrentBuildLimit?: number;
  storageArweaveLimit?: number; //bytes
  storageSkynetLimit?: number; //bytes
  storageFileCoinLimit?: number; //bytes
  storageIPFSLimit?: number;
  deploymentsPerDayLimit?: number;
  domainsLimit?: number;
  hnsDomainsLimit?: number;
  ensDomainsLimit?: number;
  environmentsLimit?: number;
  clusterAktLimit?: number;
  clusterBuildExecutionLimit?: number;
  passwordProtectionLimit?: number;
}

export { TokenScope, Project, Domain, Deployment, Configuration };
