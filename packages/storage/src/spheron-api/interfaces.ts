import { ProtocolEnum } from "../enums";
import {
  DeploymentEnvironmentStatusEnum,
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

interface Project {
  name: string;
  type: ProjectTypeEnum;
  url: string;
  environmentVariables: EnvironmentVariable[];
  deploymentEnvironments: DeploymentEnvironment[];
  organization: string;
  // latestDeployment: IDeployment;
  state: ProjectStateEnum;
  hookId: string;
  provider: string;
  prCommentIds: { prId: string; commentId: string }[];
  configuration: Configuration[];
  // createdBy: IUserModel;
  passwordProtection: PasswordProtection;
  createdAt: Date;
  updatedAt: Date;
}

export { TokenScope, Project };
