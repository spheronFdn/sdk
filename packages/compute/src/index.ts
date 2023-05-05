import { ClusterManager } from "./cluster-manager";
import { ComputeMarketplaceManager } from "./compute-marketplace-manager";
import { ClusterInstanceManager } from "./cluster-instance-manager";
import { ClusterMachineManager } from "./cluter-machine-manager";
import OrganizationManager from "./organization-manager";
import { SpheronApi } from "@spheron/core";

export interface SpheronClientConfiguration {
  token: string;
}

export class SpheronComputeClient {
  private readonly configuration: SpheronClientConfiguration;
  private readonly spheronApi: SpheronApi;

  public readonly cluster: ClusterManager;
  public readonly computeMarketplace: ComputeMarketplaceManager;
  public readonly instance: ClusterInstanceManager;
  public readonly clusterMachine: ClusterMachineManager;
  public readonly organization: OrganizationManager;

  constructor(configuration: SpheronClientConfiguration) {
    this.configuration = configuration;
    this.spheronApi = new SpheronApi(this.configuration.token);

    this.cluster = new ClusterManager(this.spheronApi);
    this.computeMarketplace = new ComputeMarketplaceManager(this.spheronApi);
    this.instance = new ClusterInstanceManager(this.spheronApi);
    this.clusterMachine = new ClusterMachineManager(this.spheronApi);
    this.organization = new OrganizationManager(this.spheronApi);
  }
}

export * from "./interfaces";
export default SpheronComputeClient;
