import {
  Cluster,
  ClusterFundsUsage,
  ClusterInstance,
  ClusterInstanceOrder,
  ClusterInstanceStateEnum,
  ClusterInstancesInfo,
  ClusterProtocolEnum,
  ClusterStateEnum,
  MarketplaceApp,
  MarketplaceCategoryEnum,
  ComputeMachine,
  CreateClusterInstanceFromMarketplaceRequest,
  CreateClusterInstanceRequest,
  Domain,
  DomainTypeEnum,
  ExtendedClusterInstance,
  HealthStatusEnum,
  InstanceLogType,
  PersistentStorageClassEnum,
  ProviderEnum,
  SpheronApi,
  UpdateClusterInstaceRequest,
} from "@spheron/core";
import { ClusterManager } from "./cluster-manager";
import { ClusterMarketplaceManager } from "./cluster-marketplace-manager";
import { ClusterInstanceManager } from "./cluster-instance-manager";
import { ClusterMachineManager } from "./compute-machine-manager";
import {
  ClusterInstanceFromMarketplaceResponse,
  ClusterInstanceResponse,
} from "@spheron/core";

export {
  ClusterInstance,
  ClusterInstanceOrder,
  ClusterInstanceFromMarketplaceResponse,
  CreateClusterInstanceRequest,
  Cluster,
  ClusterFundsUsage,
  ClusterInstancesInfo,
  MarketplaceApp,
  ComputeMachine,
  Domain,
  DomainTypeEnum,
  InstanceLogType,
  UpdateClusterInstaceRequest,
  ExtendedClusterInstance,
  ProviderEnum,
  ClusterStateEnum,
  ClusterInstanceStateEnum,
  HealthStatusEnum,
  MarketplaceCategoryEnum,
  PersistentStorageClassEnum,
  ClusterProtocolEnum,
  CreateClusterInstanceFromMarketplaceRequest,
  ClusterInstanceResponse,
};

export interface SpheronClientConfiguration {
  token: string;
}

export class SpheronComputeClient {
  private readonly configuration: SpheronClientConfiguration;
  private readonly spheronApi: SpheronApi;
  public readonly cluster: ClusterManager;
  public readonly clusterMarketplace: ClusterMarketplaceManager;
  public readonly clusterInstance: ClusterInstanceManager;
  public readonly clusterMachine: ClusterMachineManager;

  constructor(configuration: SpheronClientConfiguration) {
    this.configuration = configuration;
    this.spheronApi = new SpheronApi(this.configuration.token);

    this.cluster = new ClusterManager(this.spheronApi);
    this.clusterMarketplace = new ClusterMarketplaceManager(this.spheronApi);
    this.clusterInstance = new ClusterInstanceManager(this.spheronApi);
    this.clusterMachine = new ClusterMachineManager(this.spheronApi);
  }
}

export default SpheronComputeClient;
