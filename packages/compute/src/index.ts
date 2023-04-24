import { SpheronApi } from "@spheron/core";
import { ClusterManager } from "./cluster-manager";
import { ClusterTemplateManager } from "./cluster-template-manager";
import { ClusterInstanceManager } from "./cluster-instance-manager";
import { ClusterMachineManager } from "./compute-machine-manager";

export interface SpheronClientConfiguration {
  token: string;
}

export class SpheronComputeClient {
  private readonly configuration: SpheronClientConfiguration;
  private readonly spheronApi: SpheronApi;
  public readonly cluster: ClusterManager;
  public readonly clusterTemplate: ClusterTemplateManager;
  public readonly clusterInstance: ClusterInstanceManager;
  public readonly clusterMachine: ClusterMachineManager;

  constructor(configuration: SpheronClientConfiguration) {
    this.configuration = configuration;
    this.spheronApi = new SpheronApi(this.configuration.token);
    this.cluster = new ClusterManager(this.spheronApi);
    this.clusterTemplate = new ClusterTemplateManager(this.spheronApi);
    this.clusterInstance = new ClusterInstanceManager(this.spheronApi);
    this.clusterMachine = new ClusterMachineManager(this.spheronApi);
  }
}
