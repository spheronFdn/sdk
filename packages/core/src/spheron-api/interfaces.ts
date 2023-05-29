import {
  AppTypeEnum,
  InstanceStateEnum,
  ClusterStateEnum,
  HealthStatusEnum,
  MarketplaceCategoryEnum,
  PersistentStorageClassEnum,
  ProtocolEnum,
  ProviderEnum,
} from "./enums";
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
  storageIPFSLimit?: number;
  deploymentsPerDayLimit?: number;
  domainsLimit?: number;
  hnsDomainsLimit?: number;
  ensDomainsLimit?: number;
  environmentsLimit?: number;
  clusterAktLimit?: number;
  clusterBuildExecutionLimit?: number;
  passwordProtectionLimit?: number;
  usedParallelUploads?: number;
  parallelUploadsLimit?: number;
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

interface Cluster {
  _id: string;
  name: string;
  url: string;
  proivder: ProviderEnum;
  createdBy: string;
  state: ClusterStateEnum;
  createdAt: Date;
  updatedAt: Date;
}

interface InstancesInfo {
  active: number;
  starting: number;
  failedToStart: number;
  closed: number;
  total: number;
}

interface ClusterFundsUsage {
  dailyUsage: number;
  usedTillNow: number;
}

interface Instance {
  _id: string;
  state: InstanceStateEnum;
  name: string;
  orders: Array<string>;
  cluster: string;
  activeOrder: string;
  latestUrlPreview: string;
  agreedMachineImageType: MachineImageType;
  retrievableAkt: number;
  withdrawnAkt: number;
  healthCheck: HealthCheck;
  createdAt: Date;
  updatedAt: Date;
}

interface ExtendedInstance extends Instance {
  cpu: number;
  memory: string;
  storage: string;
  ami: string;
  defaultDailyTopup: number;
  image: string;
  leasePricePerBlock: number;
  tag: string;
  topupReport?: TopupReport;
}

interface MachineImageType {
  machineType: string;
  agreementDate: number;
  cpu?: number;
  memory?: string;
  storage?: string;
  persistentStorage?: PersistentStorage;
}

interface TopupReport {
  dailyUsage: number;
  usedTillNow: number;
}

interface HealthCheck {
  url: string;
  port?: Port;
  status?: HealthStatusEnum;
  timestamp?: Date;
}

interface Port {
  containerPort: number;
  exposedPort: number;
}

interface MarketplaceApp {
  _id: string;
  name: string;
  metadata: MarketplaceAppMetadata;
  serviceData: MarketplaceAppServiceData;
}

interface MarketplaceAppMetadata {
  description: string;
  icon: string;
  image: string;
  docsLink: string;
  websiteLink: string;
  category: MarketplaceCategoryEnum;
  usage: number;
}

interface MarketplaceAppServiceData {
  defaultAkashMachineImageId: string;
  dockerImage: string;
  dockerImageTag: string;
  provider: string;
  instanceCount: number;
  variables: MarketplaceAppVariable[];
  ports: MarketplaceAppPort[];
  commands: string[];
  args: string[];
}

interface MarketplaceAppVariable {
  name: string;
  defaultValue: string;
  label: string;
  required?: string;
  hidden: boolean;
}

interface MarketplaceAppPort {
  containerValue: number;
  defaultExposedValue: number;
}

interface InstanceOrder {
  _id: string;
  type: string;
  commitId: string;
  status: string;
  buildTime: number;
  topic: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  env: any;
  logs: [{ time: string; log: Array<string> }];
  topups: InstanceTopup[];
  closingLogs: [{ time: string; log: string }];
  instanceLogs: Array<string>;
  instanceEvents: Array<string>;
  clusterInstance: string;
  clusterInstanceConfiguration: {
    branch: string;
    folderName: string; // folder where docker image is located in repo
    protocol: string; // ex: akash
    image: string; // name of the docker image if it is not located in repo
    tag: string; // name of the docker image if it is not located in repo
    instanceCount: number;
    buildImage: boolean; // if container should build the image, or if user has already defined it
    ports: Array<Port>;
    env: Array<Env>;
    command: Array<string>;
    args: Array<string>;
    region: string;
    agreedMachineImage: {
      machineType: string;
      agreementDate: number;
      cpu: number;
      memory: string;
      storage: string;
      persistentStorage?: PersistentStorage;
      maxPricePerBlock: number;
      leasePricePerBlock: number;
      defaultDailyTopUp: number;
      topupThreashold: number;
    };
  };
  lastTopup: InstanceTopup;
  deploymentConfigBase64: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protocolData: any; // unique data related to protocol. ex: akash : dseq,oseq,gseq
  urlPrewiew: string;
  akashWalletId: string;
  deploymentInitiator: string;
}

interface InstanceOrderLogs {
  _id: string;
  logs: Array<string>;
  logsLength: number;
}

interface Env {
  value: string;
  isSecret: boolean;
}

interface PersistentStorage {
  size: string;
  class: PersistentStorageClassEnum;
  mountPoint: string;
}

interface InstanceTopup {
  time: number;
  amount: number;
  txhash: string;
}

interface ComputeMachine {
  _id: string;
  name: string;
  cpu: number;
  storage: string;
  memory: string;
  maxPricePerBlock: number; //akt per block
  defaultDailyTopUp: number;
  topupThreashold: number;
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
  Cluster,
  InstancesInfo,
  ClusterFundsUsage,
  Instance,
  ExtendedInstance,
  InstanceOrder,
  InstanceTopup,
  Env,
  Port,
  PersistentStorage,
  MarketplaceApp,
  ComputeMachine,
  MarketplaceAppMetadata,
  MarketplaceAppServiceData,
  MarketplaceAppPort,
  MarketplaceAppVariable,
  HealthCheck,
  MachineImageType,
  InstanceOrderLogs,
};
