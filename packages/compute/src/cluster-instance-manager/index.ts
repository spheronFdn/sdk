import {
  ClusterInstance,
  ClusterInstanceOrder,
  CreateClusterInstanceFromTemplateRequest,
  CreateClusterInstanceRequest,
  Domain,
  DomainTypeEnum,
  InstanceLogType,
  SpheronApi,
  UpdateClusterInstaceRequest,
} from "@spheron/core";

class ClusterInstanceManager {
  private readonly spheronApi: SpheronApi;

  constructor(spheronApi: SpheronApi) {
    this.spheronApi = spheronApi;
  }

  async getClusterInstance(
    id: string,
    options?: {
      includeReport?: boolean;
    }
  ): Promise<ClusterInstance> {
    return this.spheronApi.getClusterInstance(id, options);
  }

  async deleteClusterInstance(id: string): Promise<void> {
    return this.spheronApi.deleteClusterInstance(id);
  }

  async updateClusterInstance(
    id: string,
    clusterInstance: UpdateClusterInstaceRequest
  ): Promise<{
    message: string;
    success: boolean;
    topic: string;
    clusterInstanceId: string;
    clusterId: string;
  }> {
    return this.spheronApi.updateClusterInstance(id, clusterInstance);
  }

  async updateClusterInstanceHealthCheckInfo(
    id: string,
    healthCheck: { path: string; cointainerPort: number }
  ): Promise<{ message: string; updated: boolean }> {
    return this.spheronApi.updateClusterInstanceHealthCheckInfo(
      id,
      healthCheck
    );
  }

  async closeClusterInstance(
    id: string
  ): Promise<{ message: string; success: boolean }> {
    return this.spheronApi.closeClusterInstance(id);
  }

  async getClusterInstanceOrder(id: string): Promise<ClusterInstanceOrder> {
    return this.spheronApi.getClusterInstanceOrder(id);
  }

  async getClusterInstanceOrderLogs(
    id: string,
    logsOptions: {
      from: number;
      to: number;
      logType: InstanceLogType;
      search?: string;
    }
  ): Promise<ClusterInstanceOrder> {
    if (logsOptions.from < 0 || logsOptions.to < 0) {
      throw new Error(`From and To cannot be negative numbers.`);
    }

    return this.spheronApi.getClusterInstanceOrderLogs(id, logsOptions);
  }

  async createClusterInstance(
    clusterInstance: CreateClusterInstanceRequest
  ): Promise<ClusterInstanceOrder> {
    return this.spheronApi.createClusterInstance(clusterInstance);
  }

  async createClusterInstanceFromTemplate(
    clusterInstance: CreateClusterInstanceFromTemplateRequest
  ): Promise<ClusterInstanceOrder> {
    return this.spheronApi.createClusterInstanceFromTemplate(clusterInstance);
  }

  async getClusterInstanceDomains(id: string): Promise<{ domains: Domain[] }> {
    return this.spheronApi.getClusterInstanceDomains(id);
  }

  async addClusterInstanceDomain(
    instanceId: string,
    doamin: {
      link: string;
      type: DomainTypeEnum | string;
      name: string;
    }
  ): Promise<Domain> {
    return this.spheronApi.addClusterInstanceDomain(instanceId, doamin);
  }

  async updateClusterInstanceDomain(
    instanceId: string,
    domainId: string,
    doamin: {
      link: string;
      type: DomainTypeEnum | string;
      name: string;
    }
  ): Promise<Domain> {
    return this.spheronApi.updateClusterInstanceDomain(
      instanceId,
      domainId,
      doamin
    );
  }

  async deleteClusterInstanceDomain(
    instanceId: string,
    domainId: string
  ): Promise<void> {
    return this.spheronApi.deleteClusterInstanceDomain(instanceId, domainId);
  }

  async verifyClusterInstanceDomain(
    instanceId: string,
    domainId: string
  ): Promise<void> {
    return this.spheronApi.verifyClusterInstanceDomain(instanceId, domainId);
  }
}

export { ClusterInstanceManager };
