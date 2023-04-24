import { ComputeMachine, SpheronApi } from "@spheron/core";

class ClusterMachineManager {
  private readonly spheronApi: SpheronApi;

  constructor(spheronApi: SpheronApi) {
    this.spheronApi = spheronApi;
  }

  async getComputeMachines(options: {
    skip: number;
    limit: number;
    searchString: string;
  }): Promise<{
    akashMachineImages: ComputeMachine[];
    totalCount: number;
  }> {
    if (options.limit < 0 || options.skip < 0) {
      throw new Error(`Limit and Skip cannot be negative numbers.`);
    }

    return this.spheronApi.getComputeMachines(options);
  }

  async getComputeMachineRegions(): Promise<{
    regions: string[];
    totalCount: number;
  }> {
    return this.spheronApi.getComputeMachineRegions();
  }
}

export { ClusterMachineManager };
