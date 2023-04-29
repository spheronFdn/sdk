import { ComputeMachine, SpheronApi } from "@spheron/core";

class ClusterMachineManager {
  private readonly spheronApi: SpheronApi;

  constructor(spheronApi: SpheronApi) {
    this.spheronApi = spheronApi;
  }

  async get(options: {
    skip: number;
    limit: number;
    searchString?: string;
  }): Promise<ComputeMachine[]> {
    if (options.limit < 1 || options.skip < 0) {
      throw new Error(
        `Limit and Skip cannot be negative numbers. Limit must be greater thatn 1.`
      );
    }

    return this.spheronApi.getComputeMachines(options);
  }

  async getRegions(): Promise<string[]> {
    return this.spheronApi.getComputeMachineRegions();
  }
}

export { ClusterMachineManager };
