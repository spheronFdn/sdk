import { SpheronApi } from "@spheron/core";
import {
  Cluster,
  ClusterInstanceExtendedInfo,
  mapCluster,
  mapClusterInstanceExtendedInfo,
  ClusterFundsUsage,
  ClusterInstancesInfo,
} from "./interfaces";

class ClusterManager {
  private readonly spheronApi: SpheronApi;

  constructor(spheronApi: SpheronApi) {
    this.spheronApi = spheronApi;
  }

  async get(id: string): Promise<Cluster> {
    const cluster = await this.spheronApi.getCluster(id);

    return mapCluster(cluster);
  }

  async delete(id: string): Promise<void> {
    await this.spheronApi.deleteCluster(id);
  }

  async getInstancesInfo(id: string): Promise<ClusterInstancesInfo> {
    return this.spheronApi.getClusterInstancesDetails(id);
  }

  async getUsage(id: string): Promise<ClusterFundsUsage> {
    return this.spheronApi.getClusterFundsUsage(id);
  }

  async getInstances(
    id: string,
    options: {
      skip: number;
      limit: number;
      includeReport?: boolean;
    }
  ): Promise<ClusterInstanceExtendedInfo[]> {
    if (options.skip < 0 || options.limit < 0) {
      throw new Error(`Skip and Limit cannot be negative numbers.`);
    }

    const clusterInstances = await this.spheronApi.getClusterInstances(
      id,
      options
    );

    return clusterInstances.map((x) => mapClusterInstanceExtendedInfo(x));
  }
}

export { ClusterManager };
