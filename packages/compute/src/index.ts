import { ClusterManager } from "./cluster-manager";
import { ComputeMarketplaceManager } from "./compute-marketplace-manager";
import { InstanceManager } from "./instance-manager";
import { ComputeMachineManager } from "./cluter-machine-manager";
import OrganizationManager from "./organization-manager";
import { SpheronApi } from "@spheron/core";
import Utils from "./utils";

export interface SpheronClientConfiguration {
  token: string;
}

export class SpheronClient {
  private readonly configuration: SpheronClientConfiguration;
  private readonly spheronApi: SpheronApi;
  private readonly utils: Utils;

  public readonly cluster: ClusterManager;
  public readonly computeMarketplace: ComputeMarketplaceManager;
  public readonly instance: InstanceManager;
  public readonly computeMachine: ComputeMachineManager;
  public readonly organization: OrganizationManager;

  constructor(configuration: SpheronClientConfiguration) {
    this.configuration = configuration;
    this.spheronApi = new SpheronApi(this.configuration.token);
    this.utils = new Utils(this.spheronApi);

    this.cluster = new ClusterManager(this.spheronApi);
    this.computeMarketplace = new ComputeMarketplaceManager(this.spheronApi);
    this.instance = new InstanceManager(this.spheronApi, this.utils);
    this.computeMachine = new ComputeMachineManager(this.spheronApi);
    this.organization = new OrganizationManager(this.spheronApi, this.utils);
  }
}

export * from "./interfaces";
export default SpheronClient;
