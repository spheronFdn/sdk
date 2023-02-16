import { ProtocolEnum } from "../enums";
import { DeploymentEnvironmentStatusEnum } from "./enums";
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

// interface Project {
//   name: string;
//   type: ProjectTypeEnum;
//   url: string;
//   environmentVariables: EnvironmentVariable[];
//   deploymentEnvironments: DeploymentEnvironment[];
//   organization: IOrganization["_id"];
//   latestDeployment: IDeployment["_id"];
//   state: ProjectStateEnum;
//   hookId: string;
//   provider: string;
//   prCommentIds: [{ prId: string; commentId: string }];
//   configuration: IConfiguration["_id"];
//   createdAt: Date;
//   updatedAt: Date;
//   createdBy: IUserModel;
//   passwordProtection: IPasswordProtection;
// }

export { TokenScope };
