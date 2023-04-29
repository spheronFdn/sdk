import {
  Cluster,
  ClusterFundsUsage,
  ClusterInstancesInfo,
  ExtendedClusterInstance,
  SpheronApi,
} from "@spheron/core";

class ClusterManager {
  private readonly spheronApi: SpheronApi;

  constructor(spheronApi: SpheronApi) {
    this.spheronApi = spheronApi;
  }

  async getAll(
    organisationId: string,
    options: {
      skip: number;
      limit: number;
    }
  ): Promise<Cluster[]> {
    return this.spheronApi.getOrganizationClusters(organisationId, options);
  }

  async get(id: string): Promise<Cluster> {
    return this.spheronApi.getCluster(id);
  }

  async delete(id: string): Promise<void> {
    await this.spheronApi.deleteCluster(id);
  }

  async getAllInstancesInfo(id: string): Promise<ClusterInstancesInfo> {
    return this.spheronApi.getClusterInstancesDetails(id);
  }

  async getFundsUsage(id: string): Promise<ClusterFundsUsage> {
    return this.spheronApi.getClusterFundsUsage(id);
  }

  async getInstances(
    id: string,
    options: {
      skip: number;
      limit: number;
      includeReport?: boolean;
    }
  ): Promise<ExtendedClusterInstance[]> {
    if (options.skip < 0 || options.limit < 0) {
      throw new Error(`Skip and Limit cannot be negative numbers.`);
    }

    return this.spheronApi.getClusterInstances(id, options);
  }
}

export { ClusterManager };
