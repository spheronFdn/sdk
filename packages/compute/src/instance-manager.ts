import {
  SpheronApi,
  DomainTypeEnum as DomainTypeEnumCore,
} from "@spheron/core";
import { v4 as uuidv4 } from "uuid";
import {
  Instance,
  InstanceDeployment,
  Domain,
  DomainTypeEnum,
  InstanceResponse,
  InstanceLogType,
  MarketplaceInstanceCreationConfig,
  MarketplaceInstanceResponse,
  InstanceCreationConfig,
  InstanceUpdateConfig,
} from "./interfaces";
import Utils from "./utils";
import {
  mapCreateInstanceRequest,
  mapInstanceResponse,
  mapClusterInstance,
  mapInstanceUpdateRequest,
  mapInstanceDeployment,
  mapMarketplaceInstanceCreationConfig,
  mapMarketplaceInstanceResponse,
  mapDomain,
} from "./mappers";

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
    const organizationId = await this.utils.getOrganizationId();

    const computeMachines = await this.spheronApi.getComputeMachines({
      skip: 0,
      limit: 10,
    });
    const computeMachine = computeMachines.find(
      (m) => m._id === creationConfig.configuration.machineImageId
    );

    if (!computeMachine) {
      throw new Error(
        `Compute machine with id ${creationConfig.configuration.machineImageId} not found!`
      );
    }

    const response = await this.spheronApi.createClusterInstance(
      mapCreateInstanceRequest(
        creationConfig,
        organizationId,
        computeMachine.name
      )
    );
    return mapInstanceResponse(response);
  }

  async get(id: string): Promise<Instance> {
    const clusterInstance = await this.spheronApi.getClusterInstance(id);

    return mapClusterInstance(clusterInstance);
  }

  async delete(id: string): Promise<void> {
    return this.spheronApi.deleteClusterInstance(id);
  }

  async update(
    id: string,
    updateConfig: InstanceUpdateConfig
  ): Promise<InstanceResponse> {
    const organizationId = await this.utils.getOrganizationId();

    const response = await this.spheronApi.updateClusterInstance(
      id,
      organizationId,
      mapInstanceUpdateRequest(updateConfig)
    );

    return mapInstanceResponse(response);
  }

  async updateHealthCheck(
    id: string,
    healthCheckConfig: {
      path: string;
      port: number;
    }
  ): Promise<{ message: string; success: boolean }> {
    const response = await this.spheronApi.updateClusterInstanceHealthCheckInfo(
      id,
      {
        path: healthCheckConfig.path,
        cointainerPort: healthCheckConfig.port,
      }
    );

    return { message: response.message, success: response.updated };
  }

  async close(id: string): Promise<{ message: string; success: boolean }> {
    return this.spheronApi.closeClusterInstance(id);
  }

  async getInstanceDeployment(id: string): Promise<InstanceDeployment> {
    const clusterInstanceOrder = await this.spheronApi.getClusterInstanceOrder(
      id
    );

    return mapInstanceDeployment(clusterInstanceOrder.order);
  }

  async getInstanceLogs(
    id: string,
    options: {
      from: number;
      to: number;
      logType: InstanceLogType;
      search?: string;
    }
  ): Promise<Array<string>> {
    if (options.from < 0 || options.to < 0) {
      throw new Error(`From and To cannot be negative numbers.`);
    }

    const logsResponse = await this.spheronApi.getClusterInstanceOrderLogs(
      id,
      options
    );

    return logsResponse.logs;
  }

  async createFromMarketplace(
    createConfig: MarketplaceInstanceCreationConfig
  ): Promise<MarketplaceInstanceResponse> {
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
    const domain = await this.spheronApi.addClusterInstanceDomain(instanceId, {
      link: doamin.link,
      type: doamin.type as DomainTypeEnumCore,
      name: doamin.name,
    });

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
      {
        link: doamin.link,
        type: doamin.type as DomainTypeEnumCore,
        name: doamin.name,
      }
    );

    return mapDomain(domain);
  }

  async deleteDomain(instanceId: string, domainId: string): Promise<void> {
    return this.spheronApi.deleteClusterInstanceDomain(instanceId, domainId);
  }

  async verifyDomain(instanceId: string, domainId: string): Promise<void> {
    return this.spheronApi.verifyClusterInstanceDomain(instanceId, domainId);
  }

  async triggerLatestLog(instanceId: string): Promise<{
    message: string;
  }> {
    return this.spheronApi.triggerClusterInstanceLogFetch(instanceId, uuidv4());
  }

  async triggerLatestHealth(instanceId: string): Promise<{
    message: string;
  }> {
    return this.spheronApi.triggerClusterInstanceHealthCheck(
      instanceId,
      uuidv4()
    );
  }
}

export { InstanceManager };
