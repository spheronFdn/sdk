import {
  ClusterInstance,
  ClusterInstanceOrder,
  CreateClusterInstanceFromMarketplaceRequest,
  CreateClusterInstanceRequest,
  Domain,
  DomainTypeEnum,
  EventProcessingFunction,
  InstanceLogType,
  SpheronApi,
  UpdateClusterInstaceRequest,
} from "@spheron/core";
import {
  ClusterInstanceFromMarketplaceResponse,
  ClusterInstanceResponse,
} from "@spheron/core/dist/types/spheron-api/response-interfaces";
import { v4 as uuidv4 } from "uuid";

class ClusterInstanceManager {
  private readonly spheronApi: SpheronApi;

  constructor(spheronApi: SpheronApi) {
    this.spheronApi = spheronApi;
  }

  async create(
    clusterInstance: CreateClusterInstanceRequest
  ): Promise<ClusterInstanceResponse> {
    clusterInstance.uniqueTopicId = clusterInstance.uniqueTopicId ?? uuidv4();

    return this.spheronApi.createClusterInstance(clusterInstance);
  }

  async get(
    id: string,
    options?: {
      includeReport?: boolean;
    }
  ): Promise<ClusterInstance> {
    return this.spheronApi.getClusterInstance(id, options);
  }

  async delete(id: string): Promise<void> {
    return this.spheronApi.deleteClusterInstance(id);
  }

  async update(
    id: string,
    organisationId: string,
    clusterInstance: UpdateClusterInstaceRequest
  ): Promise<ClusterInstanceResponse> {
    return this.spheronApi.updateClusterInstance(
      id,
      organisationId,
      clusterInstance
    );
  }

  async updateHealthCheck(
    id: string,
    healthCheck: { path: string; cointainerPort: number }
  ): Promise<{ message: string; updated: boolean }> {
    return this.spheronApi.updateClusterInstanceHealthCheckInfo(
      id,
      healthCheck
    );
  }

  async close(id: string): Promise<{ message: string; success: boolean }> {
    return this.spheronApi.closeClusterInstance(id);
  }

  async getClusterInstanceOrder(
    id: string
  ): Promise<{ order: ClusterInstanceOrder; liveLogs: string[] }> {
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

  async createFromMartketplace(
    clusterInstance: CreateClusterInstanceFromMarketplaceRequest
  ): Promise<ClusterInstanceFromMarketplaceResponse> {
    clusterInstance.uniqueTopicId = clusterInstance.uniqueTopicId ?? uuidv4();

    return this.spheronApi.createClusterInstanceFromTemplate(clusterInstance);
  }

  async getDomains(id: string): Promise<Domain[]> {
    return this.spheronApi.getClusterInstanceDomains(id);
  }

  async addDomain(
    instanceId: string,
    doamin: {
      link: string;
      type: DomainTypeEnum | string;
      name: string;
    }
  ): Promise<Domain> {
    return this.spheronApi.addClusterInstanceDomain(instanceId, doamin);
  }

  async updateDomain(
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

  async deleteDomain(instanceId: string, domainId: string): Promise<void> {
    return this.spheronApi.deleteClusterInstanceDomain(instanceId, domainId);
  }

  async verifyDomain(instanceId: string, domainId: string): Promise<void> {
    return this.spheronApi.verifyClusterInstanceDomain(instanceId, domainId);
  }

  async fetchLogs(
    instanceId: string,
    topicId: string
  ): Promise<{
    topicId: string;
    message: string;
  }> {
    return this.spheronApi.triggerClusterInstanceLogFetch(instanceId, topicId);
  }

  async triggerHealthCheck(
    instanceId: string,
    topicId: string
  ): Promise<{
    topicId: string;
    message: string;
  }> {
    return this.spheronApi.triggerClusterInstanceHealthCheck(
      instanceId,
      topicId
    );
  }

  subscribeToEventStream(eventProcessingFunction: EventProcessingFunction) {
    this.spheronApi.subscribeToEventStream(eventProcessingFunction);
  }
}

export { ClusterInstanceManager };
