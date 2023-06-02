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
  UNKNOWN = "Unknown",
}

enum MarketplaceCategoryEnum {
  DATABASE = "Database",
  NODE = "Node",
  TOOLS = "Tools",
}

enum InstanceLogType {
  DEPLOYMENT_LOGS = "logs",
  INSTANCE_LOGS = "instanceLogs",
  INSTANCE_EVENTS = "instanceEvents",
}

enum PersistentStorageClassEnum {
  BETA1 = "beta1",
  BETA2 = "beta2",
  BETA3 = "beta3",
}
enum ClusterProtocolEnum {
  AKASH = "akash",
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
};
