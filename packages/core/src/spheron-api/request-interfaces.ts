import { ClusterProtocolEnum } from "./enums";
import { Env, Port } from "./interfaces";

interface CreateClusterInstanceRequest {
  organizationId: string;
  uniqueTopicId?: string;
  configuration: CreateClusterInstanceConfig;
  instanceName?: string;
  clusterUrl: string;
  clusterProvider: string;
  clusterName: string;
  healthCheckUrl: string;
  healthCheckPort: number;
}

interface CreateClusterInstanceConfig {
  branch?: string;
  folderName: string; // folder where docker image is located in repo
  protocol: ClusterProtocolEnum; // ex: akash
  image: string; // name of the docker image if it is not located in repo
  tag: string; // name of the docker image if it is not located in repo
  instanceCount: number;
  buildImage: boolean; // if container should build the image, or if user has already defined it
  ports: Array<Port>;
  env: Array<Env>;
  command: Array<string>;
  args: Array<string>;
  region: string;
  akashMachineImageName: string;
}

interface CreateClusterInstanceFromMarketplaceRequest {
  templateId: string;
  environmentVariables: ClusterDeploymentVariable[];
  organizationId: string;
  akashImageId: string;
  uniqueTopicId?: string;
  region: string;
}

interface ClusterDeploymentVariable {
  label: string;
  value: string;
  isSecret: boolean;
}

interface UpdateClusterInstaceRequest {
  env: Array<Env>;
  command: Array<string>;
  args: Array<string>;
  uniqueTopicId: string;
  tag: string;
  healthCheckUrl?: string;
  healthCheckPort?: string;
}

export {
  CreateClusterInstanceRequest,
  CreateClusterInstanceConfig,
  CreateClusterInstanceFromMarketplaceRequest,
  UpdateClusterInstaceRequest,
};
