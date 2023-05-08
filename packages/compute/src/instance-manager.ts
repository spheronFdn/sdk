import { SpheronApi } from "@spheron/core";
import { v4 as uuidv4 } from "uuid";
import {
  Instance,
  InstanceDeployment,
  Domain,
  DomainTypeEnum,
  mapClusterInstance,
  mapInstanceDeployment,
  mapDomain,
  InstanceResponse,
  UpdateInstaceRequest,
  InstanceLogType,
  MarketplaceInstanceCreationConfig,
  MarketplaceInstanceResponse,
  EventProcessingFunction,
  InstanceCreationConfig,
  mapCreateInstanceRequest,
  mapMarketplaceInstanceCreationConfig,
  mapMarketplaceInstanceResponse,
  mapInstanceResponse,
} from "./interfaces";
import Utils from "./utils";

class InstanceManager {
  private readonly spheronApi: SpheronApi;
  private readonly utils: Utils;

  constructor(spheronApi: SpheronApi, utils: Utils) {
    this.spheronApi = spheronApi;
    this.utils = utils;
  }

  async create(
    creationConfig: InstanceCreationConfig
  ): Promise<InstanceResponse> {
    creationConfig.uniqueTopicId = creationConfig.uniqueTopicId ?? uuidv4();

    const organizationId = await this.utils.getOrganizationId();

    const response = await this.spheronApi.createClusterInstance(
      mapCreateInstanceRequest(creationConfig, organizationId)
    );

    return mapInstanceResponse(response);
  }

  async get(
    id: string,
    options?: {
      includeReport?: boolean;
    }
  ): Promise<Instance> {
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
    clusterInstance: UpdateInstaceRequest
  ): Promise<InstanceResponse> {
    const organizationId = await this.utils.getOrganizationId();

    const response = await this.spheronApi.updateClusterInstance(
      id,
      organizationId,
      clusterInstance
    );

    return mapInstanceResponse(response);
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

  async getInstanceDeployment(
    id: string
  ): Promise<{ deployment: InstanceDeployment; liveLogs: string[] }> {
    const clusterInstanceOrder = await this.spheronApi.getClusterInstanceOrder(
      id
    );

    return {
      deployment: mapInstanceDeployment(clusterInstanceOrder.order),
      liveLogs: clusterInstanceOrder.liveLogs,
    };
  }

  async getInstanceDeploymentLogs(
    id: string,
    logsOptions: {
      from: number;
      to: number;
      logType: InstanceLogType;
      search?: string;
    }
  ): Promise<InstanceDeployment> {
    if (logsOptions.from < 0 || logsOptions.to < 0) {
      throw new Error(`From and To cannot be negative numbers.`);
    }

    const order = await this.spheronApi.getClusterInstanceOrderLogs(
      id,
      logsOptions
    );

    return mapInstanceDeployment(order);
  }

  async createFromMartketplace(
    createConfig: MarketplaceInstanceCreationConfig
  ): Promise<MarketplaceInstanceResponse> {
    createConfig.uniqueTopicId = createConfig.uniqueTopicId ?? uuidv4();

    const organizationId = await this.utils.getOrganizationId();

    const response = await this.spheronApi.createClusterInstanceFromTemplate(
      mapMarketplaceInstanceCreationConfig(createConfig, organizationId)
    );

    return mapMarketplaceInstanceResponse(response);
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

  async triggerLatestLog(
    instanceId: string,
    topicId: string
  ): Promise<{
    topicId: string;
    message: string;
  }> {
    return this.spheronApi.triggerClusterInstanceLogFetch(instanceId, topicId);
  }

  async triggerLatestHealth(
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

export { InstanceManager };
