import {
  AppTypeEnum,
  InstanceStateEnum,
  ClusterStateEnum,
  HealthStatusEnum,
  MarketplaceCategoryEnum,
  PersistentStorageClassEnum,
  ProtocolEnum,
  ProviderEnum,
  AutoscalingNumberOfChecksEnum,
  AutoscalingTimeWindowEnum,
  AutoscalingPlanEnum,
  AutoscalingCooldownEnum,
  ComputeTypeEnum,
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
    appType: AppTypeEnum;
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

interface MasterOrganization {
  _id: string;
  profile: {
    name: string;
    image: string;
    username: string;
  };
  site: Organization;
  compute: Organization;
  storage: Organization;
  preferedAppType: AppTypeEnum;
  publiclyAccessible: AppTypeEnum;
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
  organizations: [MasterOrganization];
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
  masterOrganizationId: string;
  computeOrganizationId: string;
  siteOrganizationId: string;
  storageOrganizationId: string;
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
  usedStorageFilecoin?: number;
  storageFilecoinLimit?: number;
  usedImageOptimizations?: number;
  imageOptimizationsLimit?: number;
  usedIpfsBandwidth: number;
  ipfsBandwidthLimit?: number;
  usedIpfsNumberOfRequests?: number;
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

interface PeerData {
  peerName: string;
  ipfsPeerId: string;
  ipfsPeerAddresses: string[];
  status: string;
  timeStamp: string;
  error: string;
  attemptCount: number;
  priorityPin: boolean;
}

interface PinStatus {
  cid: string;
  name: string;
  allocations: string[];
  origins: string[];
  created: string;
  metadata: null | any;
  peerMap: { [key: string]: PeerData };
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

interface ComputeProject {
  _id: string;
  name: string;
  description: string;
  proivder: ProviderEnum;
  state: ClusterStateEnum;
  organization: string;
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

interface ComputeProjectFundsUsage {
  dailyUsage: number;
  usedTillNow: number;
}

interface Instance {
  _id: string;
  state: InstanceStateEnum;
  name: string;
  deployments: Array<string>;
  computeProject: string;
  activeDeployment: string;
  retrievableAkt: number;
  withdrawnAkt: number;
  scalableRunningCostUpdatedAt: Date;
  scalableRunningCost: number;
  type: ComputeTypeEnum;
  region: string;
  createdAt: Date;
  updatedAt: Date;
}

interface InstanceWithProject {
  _id: string;
  state: InstanceStateEnum;
  name: string;
  deployments: Array<string>;
  computeProject: ComputeProject;
  activeDeployment: string;
  retrievableAkt: number;
  withdrawnAkt: number;
  scalableRunningCostUpdatedAt: Date;
  scalableRunningCost: number;
  type: ComputeTypeEnum;
  createdAt: Date;
  updatedAt: Date;
}

interface ExtendedInstance extends Instance {
  defaultDailyTopup: number;
  leasePricePerBlock: number;
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
  path: string;
  port?: Port;
  status?: HealthStatusEnum;
  timestamp?: Date;
}

interface Port {
  containerPort: number;
  exposedPort: number;
  global?: boolean;
  exposeTo?: string;
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
  containerPort: number;
  exposedPort: number;
}

interface ComputeDeployment {
  _id: string;
  type: string;
  commitId: string;
  status: string;
  buildTime: number;
  topic: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  env: any;
  logs: [{ time: string; log: Array<string> }];
  topups: [{ time: number; amount: number; txhash: string }];
  closingLogs: [{ time: string; log: string }];
  instanceLogs: Array<string>;
  instanceEvents: Array<string>;
  computeInstance: string;
  services: Array<ComputeServiceConfiguration>;
  lastTopup: InstanceTopup;
  deploymentConfigBase64: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protocolData: any; // unique data related to protocol. ex: akash : dseq,oseq,gseq
  urlPrewiew: string;
  akashWalletId: string;
  deploymentInitiator: string;
}

interface ComputeServiceConfiguration {
  name: string;
  branch: string;
  folderName: string; // folder where docker image is located in repo
  protocol: string; // ex: akash
  image: string; // name of the docker image if it is not located in repo
  tag: string; // name of the docker image if it is not located in repo
  serviceCount: number;
  buildImage: boolean; // if container should build the image, or if user has already defined it
  ports: Array<Port>;
  env: Array<Env>;
  command: Array<string>;
  args: Array<string>;
  region: string;
  customServiceSpecs: CustomServiceSpecs;
  agreedMachineImage: {
    machineId: string;
    machineType: string;
    agreementDate: number;
    cpu: number;
    memory: string;
    storage: string;
    persistentStorage?: PersistentStorage;
    gpu: GPUSpecs;
    maxPricePerBlock: number;
    leasePricePerBlock: number;
    defaultDailyTopUp: number;
    topupThreashold: number;
  };
  urlPrewiew?: string;
  privateImageConfig?: PrivateImageConfig;
  scalable: boolean;
  autoscalingRules: AutoscalingRules;
  healthCheck: HealthCheck;
  template: string;
}

interface GPUSpecs {
  units: number;
  models: Vendor;
}

interface Vendor {
  [key: string]: GPUModel[];
}

interface GPUModel {
  model: string;
}

interface PrivateImageConfig {
  dockerRegistryURL: string;
  dockerUserName: string;
  dockerPasswordOrToken: string;
}

interface AutoscalingRules {
  numberOfChecks: AutoscalingNumberOfChecksEnum;
  timeWindow: AutoscalingTimeWindowEnum;
  minimumInstances: number;
  maximumInstances: number;
  scaleUp: AutoscalingRulesThreshold;
  scaleDown: AutoscalingRulesThreshold;
  cooldown: AutoscalingCooldownEnum;
  lastScaleAction: Date;
  lastScaleCheck: Date;
  windowCounter: {
    numberOfChecksPreformed: number;
    numberOfRequestsAboveCPULimit: number;
    numberOfRequestsBelowCPULimit: number;
    numberOfRequestsAboveMemoryLimit: number;
    numberOfRequestsBelowMemoryLimit: number;
  };
  averageCpuUtilization: number;
  averageMemoryUtilization: number;
  plan: AutoscalingPlanEnum;
}

interface AutoscalingRulesThreshold {
  cpuThreshold: {
    step: number;
    utilizationPercentage: number;
    checksInAlarm: number;
  };
  memoryThreshold: {
    step: number;
    utilizationPercentage: number;
    checksInAlarm: number;
  };
}

interface ComputeDeploymentLogs {
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

interface CustomServiceSpecs {
  cpu?: number;
  memory?: string;
  persistentStorage?: PersistentStorage;
  storage: string;
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
  gpu?: Gpu;
}

enum BucketStateEnum {
  MAINTAINED = "MAINTAINED",
  ARCHIVED = "ARCHIVED",
}

interface Bucket {
  _id: string;
  name: string;
  organization: string;
  createdBy: string;
  state: BucketStateEnum;
}

interface BucketDomain {
  _id: string;
  name: string;
  link: string;
  verified: boolean;
  bucketId: string;
  type: DomainTypeEnum;
}

interface BucketIpnsRecord {
  _id: string;
  keyName: string;
  keyId: string;
  ipnsLink: string;
  bucket: string;
  targetCid: string;
  createdAt: Date;
  updatedAt: Date;
  memoryUsed: number;
}

enum UploadStatusEnum {
  IN_PROGRESS = "InProgress",
  CANCELED = "Canceled",
  UPLOADED = "Uploaded",
  FAILED = "Failed",
  TIMED_OUT = "TimedOut",
  PINNED = "Pinned",
  UNPINNED = "Unpinned",
}

interface UploadedFile {
  fileName: string;
  fileSize: number;
}

interface Upload {
  _id: string;
  protocolLink: string;
  uploadDirectory: UploadedFile[];
  status: UploadStatusEnum;
  memoryUsed: number;
  bucket: string;
  uploadInitiator: string;
  protocol: ProtocolEnum;
}

interface Gpu {
  units: number;
  vendor: string;
  model: string;
  totalUnits: number;
  availableUnits: number;
}

interface ComputeMetrics {
  cpu: number;
  memory: number;
  timestamp: string;
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
  PinStatus,
  StartDeploymentConfiguration,
  EnvironmentVariable,
  ComputeProject,
  InstancesInfo,
  ComputeProjectFundsUsage,
  Instance,
  ExtendedInstance,
  ComputeDeployment,
  ComputeServiceConfiguration,
  InstanceTopup,
  Env,
  Port,
  PersistentStorage,
  CustomServiceSpecs,
  MarketplaceApp,
  ComputeMachine,
  MarketplaceAppMetadata,
  MarketplaceAppServiceData,
  MarketplaceAppPort,
  MarketplaceAppVariable,
  HealthCheck,
  MachineImageType,
  ComputeDeploymentLogs,
  Bucket,
  BucketStateEnum,
  UploadStatusEnum,
  Upload,
  UploadedFile,
  BucketDomain,
  BucketIpnsRecord,
  PrivateImageConfig,
  AutoscalingRules,
  AutoscalingRulesThreshold,
  InstanceWithProject,
  Gpu,
  MasterOrganization,
  ComputeMetrics,
  TopupReport,
};
