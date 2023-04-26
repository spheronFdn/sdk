import { AppTypeEnum, ProtocolEnum, ProviderEnum } from "./enums";
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
  _id: string;
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
  deploymentEnvironmentIds: string[];
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
  provider: ProviderEnum;
  prCommentIds: { prId: string; commentId: string }[];
  configuration: Configuration;
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
  protocol: ProtocolEnum;
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
  profile: {
    name: string;
    image: string;
    username: string;
  };
  users: [string];
  registries: string[];
  overdue: boolean;
  appType: AppTypeEnum;
}

interface User {
  _id: string;
  platformProfile: PlatformUser;
  createdAt: Date;
  updatedAt: Date;
  organizations: [Organization];
}

interface PlatformUser {
  username: string;
  avatar: string;
  is_active?: boolean;
  name: string;
  email: string;
}

interface VerifiedTokenResponse {
  jwtToken: string;
  organizationId: string;
  email: string;
}

interface UsageWithLimits {
  usedBandwidth?: number; // Bytes
  usedBuildExecution?: number; // Seconds
  usedConcurrentBuild?: number;
  usedStorageArweave?: number; // Bytes
  usedStorageFileCoin?: number; // Seconds
  usedStorageIPFS?: number; // Bytes
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
  bandwidthLimit?: number; // Bytes
  buildExecutionLimit?: number; // Seconds
  concurrentBuildLimit?: number;
  storageArweaveLimit?: number; // Bytes
  storageFileCoinLimit?: number; // Bytes
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

interface UsageWithLimitsWithSkynet extends UsageWithLimits {
  usedStorageSkynet?: number; // Bytes
  storageSkynetLimit?: number; // Bytes
}

interface IPNSPublishResponse {
  _id: string;
  publishedDeploymentId: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
  keyId: string;
  keyName: string;
  ipnsLink: string;
}

interface IPNSName {
  id: string;
  publishedUploadId: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
  ipnsHash: string;
  ipnsLink: string;
}

interface StartDeploymentConfiguration {
  organizationId: string;
  gitUrl: string;
  repoName: string;
  branch: string;
  protocol: ProtocolEnum;
  provider: ProviderEnum;
  createDefaultWebhook: boolean;
  configuration: {
    buildCommand: string;
    installCommand: string;
    workspace: string;
    publishDir: string;
    framework: FrameworkEnum | string;
    nodeVersion: NodeVersionEnum;
  };
  env?: Record<string, string>;
  gitProviderPreferences?: {
    prComments?: boolean;
    commitComments?: boolean;
    buildStatus?: boolean;
    githubDeployment?: boolean;
  };
  uniqueTopicId?: string;
}

interface EnvironmentVariable {
  _id: string;
  name: string;
  value: string;
  deploymentEnvironments: DeploymentEnvironment[];
}

export {
  TokenScope,
  Project,
  Domain,
  Deployment,
  Configuration,
  Organization,
  VerifiedTokenResponse,
  User,
  DeploymentEnvironment,
  UsageWithLimits,
  UsageWithLimitsWithSkynet,
  IPNSPublishResponse,
  IPNSName,
  StartDeploymentConfiguration,
  EnvironmentVariable,
};
