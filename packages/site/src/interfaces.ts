import {
  FrameworkEnum,
  NodeVersionEnum,
  ProjectStateEnum,
  ProviderEnum,
  ProtocolEnum,
  DomainTypeEnum,
  DeploymentStatusEnum,
} from "@spheron/core";

interface Organization {
  id: string;
  profile: {
    name: string;
    username: string;
    image: string;
  };
}

interface Configuration {
  buildCommand: string;
  installCommand: string;
  workspace: string;
  publishDir: string;
  framework: FrameworkEnum;
  nodeVersion: NodeVersionEnum;
}

interface Project {
  id: string;
  name: string;
  state: ProjectStateEnum;
  url: string;
  organizationId: string;
  provider: ProviderEnum;
  configuration: Configuration;
}

interface DeploymentEnvironment {
  id: string;
  name: string;
  protocol: ProtocolEnum;
  branches: string[];
}

interface EnvironmentVariable {
  id: string;
  name: string;
  value: string;
  environments: string[];
}

interface Domain {
  id: string;
  name: string;
  verified: boolean;
  link: string;
  type: DomainTypeEnum;
  projectId: string;
  deploymentEnvironmentIds: string[];
}

interface Deployment {
  id: string;
  status: DeploymentStatusEnum;
  configuration: Configuration;
  buildTime: number;
  fileSize: number;
  deploymentEnvironmentName: string;
  commitId: string;
  branch: string;
  protocol: ProtocolEnum;
  sitePreview: string;
}

interface DeploymentLog {
  log: string;
  time: string;
}

interface StartDeploymentConfiguration {
  gitUrl: string;
  projectName: string;
  branch: string;
  protocol: ProtocolEnum;
  provider: ProviderEnum;
  configuration: {
    buildCommand: string;
    installCommand: string;
    workspace: string;
    publishDir: string;
    framework: FrameworkEnum | string;
    nodeVersion: NodeVersionEnum;
  };
  environmentVariables?: Record<string, string>;
  gitProviderPreferences?: {
    prComments?: boolean;
    commitComments?: boolean;
    buildStatus?: boolean;
    githubDeployment?: boolean;
  };
}

interface UsageWithLimits {
  used: {
    bandwidth: number; // Bytes
    buildExecution: number; // Seconds
    concurrentBuild: number;
    storageArweave: number; // Bytes
    storageIPFS: number; // Bytes
    deploymentsPerDay: number;
    domains: number;
    hnsDomains: number;
    ensDomains: number;
    environments: number;
    numberOfRequests: number;
    passwordProtection: number;
  };
  limit: {
    bandwidth: number; // Bytes
    buildExecution: number; // Seconds
    concurrentBuild: number;
    storageArweave: number; // Bytes
    storageIPFS: number; // Bytes
    deploymentsPerDay: number;
    domains: number;
    hnsDomains: number;
    ensDomains: number;
    environments: number;
    membersLimit: number;
  };
}

interface DeploymentCount {
  total: number;
  successful: number;
  failed: number;
  pending: number;
}

interface DeploymentResponse {
  success: boolean;
  message: string;
  deploymentId: string;
  projectId: string;
  deployment: Deployment;
}

interface CancelDeploymentResponse {
  message: string;
  canceled: boolean;
  killing: boolean;
}

export {
  Organization,
  Configuration,
  Project,
  DeploymentEnvironment,
  EnvironmentVariable,
  Domain,
  Deployment,
  DeploymentLog,
  StartDeploymentConfiguration,
  UsageWithLimits,
  DeploymentCount,
  DeploymentResponse,
  CancelDeploymentResponse,
};
