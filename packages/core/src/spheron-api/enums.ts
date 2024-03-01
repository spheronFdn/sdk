export enum ProtocolEnum {
  ARWEAVE = "arweave",
  FILECOIN = "ipfs-filecoin",
  IPFS = "ipfs",
}

enum ProjectTypeEnum {
  STANDARD = "STANDARD",
  UPLOAD = "UPLOAD",
}

enum DeploymentEnvironmentStatusEnum {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  PAYMENT_PENDING = "PAYMENT_PENDING",
}

enum ProjectStateEnum {
  MAINTAINED = "MAINTAINED",
  ARCHIVED = "ARCHIVED",
}

enum DomainTypeEnum {
  DOMAIN = "domain",
  SUBDOMAIN = "subdomain",
  HANDSHAKE_DOMAIN = "handshake-domain",
  HANDSHAKE_SUBDOMAIN = "handshake-subdomain",
  ENS_DOMAIN = "ens-domain",
}

enum DomainApplicationTypeEnum {
  WEB = 1,
  COMPUTE = 2,
}

enum NodeVersionEnum {
  V_12 = "V_12",
  V_14 = "V_14",
  V_16 = "V_16",
}

enum FrameworkEnum {
  SIMPLE_JAVASCRIPT_APP = "static",
  VUE = "vue",
  REACT = "react",
  NEXT = "next",
  ANGULAR = "angular",
  PREACT = "preact",
  NUXT = "nuxt2",
  SVELTE = "svelte",
  GATSBY = "gatsby",
  ELEVENTY = "eleventy",
  DOCUSAURUS = "docusaurus",
  SANITY = "sanity",
  HUGO = "hugo",
  IONIC_REACT = "ionicreact",
  VITE = "vite",
  SCULLY = "scully",
  STENCIL = "stencil",
  BRUNCH = "brunch",
  IONIC_ANGULAR = "ionicangular",
}

enum DeploymentStatusEnum {
  PRE_QUEUE = "PreQueue",
  QUEUED = "Queued",
  PENDING = "Pending",
  CANCELED = "Canceled",
  DEPLOYED = "Deployed",
  FAILED = "Failed",
  AUTHORIZATION_NEEDED = "AuthorizationNeeded",
  KILLING = "Killing",
  TIMED_OUT = "TimedOut",
}

enum AppTypeEnum {
  WEB_APP = "app",
  COMPUTE = "compute",
  STORAGE = "storage",
}

enum ProviderEnum {
  GITHUB = "GITHUB",
  GITLAB = "GITLAB",
  BITBUCKET = "BITBUCKET",
  DOCKERHUB = "DOCKERHUB",
}

enum ClusterStateEnum {
  MAINTAINED = "MAINTAINED",
  ARCHIVED = "ARCHIVED",
}

enum InstanceStateEnum {
  STARTING = "Starting",
  FAILED_START = "Failed-start",
  ACTIVE = "Active",
  CLOSED = "Closed",
}

enum HealthStatusEnum {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
  PENDING = "Pending",
  UNKNOWN = "Unknown",
}

enum MarketplaceCategoryEnum {
  DATABASE = "Database",
  NODE = "Node",
  TOOLS = "Tools",
  AI = "AI",
}

enum InstanceLogType {
  DEPLOYMENT_LOGS = "logs",
  INSTANCE_LOGS = "instanceLogs",
  INSTANCE_EVENTS = "instanceEvents",
}

enum PersistentStorageClassEnum {
  HDD = "beta1",
  SSD = "beta2",
  NVMe = "beta3",
}

enum ClusterProtocolEnum {
  AKASH = "akash",
}

enum ComputeTypeEnum {
  SPOT = "SPOT",
  ON_DEMAND = "ON_DEMAND",
}

enum AutoscalingNumberOfChecksEnum {
  CHECKS_5 = 5,
}

enum AutoscalingTimeWindowEnum {
  WINDOW_60 = 60, // 1min
  WINDOW_120 = 120, // 2min
  WINDOW_300 = 300, // 5min
  WINDOW_6000 = 600, // 10min
}

enum AutoscalingCooldownEnum {
  MINUTE_5 = 300,
  MINUTE_10 = 600,
  MINUTE_15 = 900,
  MINUTE_20 = 1200,
}

enum AutoscalingPlanEnum {
  CUSTOM = "custom",
  RELAX = "relax",
  STANDARD = "standard",
  AGGRESSIVE = "aggressive",
}

export {
  ProjectTypeEnum,
  DeploymentEnvironmentStatusEnum,
  ProjectStateEnum,
  NodeVersionEnum,
  FrameworkEnum,
  DomainTypeEnum,
  DomainApplicationTypeEnum,
  DeploymentStatusEnum,
  AppTypeEnum,
  ProviderEnum,
  ClusterStateEnum,
  InstanceStateEnum,
  HealthStatusEnum,
  MarketplaceCategoryEnum,
  InstanceLogType,
  PersistentStorageClassEnum,
  ClusterProtocolEnum,
  ComputeTypeEnum,
  AutoscalingNumberOfChecksEnum,
  AutoscalingTimeWindowEnum,
  AutoscalingCooldownEnum,
  AutoscalingPlanEnum,
};
