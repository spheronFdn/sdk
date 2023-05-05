import { SpheronApi } from "@spheron/core";
import { v4 as uuidv4 } from "uuid";
import {
  ClusterInstance,
  ClusterInstanceOrder,
  Domain,
  DomainTypeEnum,
  mapClusterInstance,
  mapClusterInstanceOrder,
  mapDomain,
  CreateInstanceRequest,
  InstanceResponse,
  UpdateInstaceRequest,
  InstanceLogType,
  CreateInstanceFromMarketplaceRequest,
  MarketplaceInstanceResponse,
  EventProcessingFunction,
} from "./interfaces";

class ClusterInstanceManager {
  private readonly spheronApi: SpheronApi;

  constructor(spheronApi: SpheronApi) {
    this.spheronApi = spheronApi;
  }

  async create(
    clusterInstance: CreateInstanceRequest
  ): Promise<InstanceResponse> {
    clusterInstance.uniqueTopicId = clusterInstance.uniqueTopicId ?? uuidv4();

    return this.spheronApi.createClusterInstance(clusterInstance);
  }

  async get(
    id: string,
    options?: {
      includeReport?: boolean;
    }
  ): Promise<ClusterInstance> {
    const clusterInstance = await this.spheronApi.getClusterInstance(
      id,
      options
    );

    return mapClusterInstance(clusterInstance);
  }

  async delete(id: string): Promise<void> {
    return this.spheronApi.deleteClusterInstance(id);
  }

  async update(
    id: string,
    organisationId: string,
    clusterInstance: UpdateInstaceRequest
  ): Promise<InstanceResponse> {
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
    const clusterInstanceOrder = await this.spheronApi.getClusterInstanceOrder(
      id
    );

    return {
      order: mapClusterInstanceOrder(clusterInstanceOrder.order),
      liveLogs: clusterInstanceOrder.liveLogs,
    };
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

    const order = await this.spheronApi.getClusterInstanceOrderLogs(
      id,
      logsOptions
    );

    return mapClusterInstanceOrder(order);
  }

  async createFromMartketplace(
    clusterInstance: CreateInstanceFromMarketplaceRequest
  ): Promise<MarketplaceInstanceResponse> {
    clusterInstance.uniqueTopicId = clusterInstance.uniqueTopicId ?? uuidv4();

    return this.spheronApi.createClusterInstanceFromTemplate(clusterInstance);
  }

  async getDomains(id: string): Promise<Domain[]> {
    const domains = await this.spheronApi.getClusterInstanceDomains(id);

    return domains.map((x) => mapDomain(x));
  }

  async addDomain(
    instanceId: string,
    doamin: {
      link: string;
      type: DomainTypeEnum | string;
      name: string;
    }
  ): Promise<Domain> {
    const domain = await this.spheronApi.addClusterInstanceDomain(
      instanceId,
      doamin
    );

    return mapDomain(domain);
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
    const domain = await this.spheronApi.updateClusterInstanceDomain(
      instanceId,
      domainId,
      doamin
    );

    return mapDomain(domain);
  }

  async deleteDomain(instanceId: string, domainId: string): Promise<void> {
    return this.spheronApi.deleteClusterInstanceDomain(instanceId, domainId);
  }

  async verifyDomain(instanceId: string, domainId: string): Promise<void> {
    return this.spheronApi.verifyClusterInstanceDomain(instanceId, domainId);
  }

  async triggerLogFetch(
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
