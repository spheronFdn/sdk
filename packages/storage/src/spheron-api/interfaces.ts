import { ProtocolEnum } from "../enums";
import {
  DeploymentEnvironmentStatusEnum,
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

export { TokenScope, Project, Domain };
