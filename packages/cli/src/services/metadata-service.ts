import { AppTypeEnum } from "@spheron/core";
import { readFromJsonFile, writeToJsonFile } from "../utils";
import configuration from "../configuration";

const MetadataService = {
  async getJwtToken(): Promise<string> {
    const jwtToken = await readFromJsonFile(
      "jwtToken",
      configuration.configFilePath
    );
    return jwtToken;
  },

  async getMaterOrgData(): Promise<OrganizationMetadata> {
    const data: OrganizationMetadata = await readFromJsonFile(
      "masterOrganization",
      configuration.configFilePath
    );
    return data;
  },

  async getComputeData(): Promise<OrganizationMetadata> {
    const data: OrganizationMetadata = await readFromJsonFile(
      AppTypeEnum.COMPUTE,
      configuration.configFilePath
    );
    return data;
  },

  async getSiteData(): Promise<OrganizationMetadata> {
    const data: OrganizationMetadata = await readFromJsonFile(
      AppTypeEnum.WEB_APP,
      configuration.configFilePath
    );
    return data;
  },

  async getStorageData(): Promise<OrganizationMetadata> {
    const data: OrganizationMetadata = await readFromJsonFile(
      AppTypeEnum.STORAGE,
      configuration.configFilePath
    );
    return data;
  },

  async editComputeData(metadata: OrganizationMetadata): Promise<void> {
    await writeToJsonFile(
      AppTypeEnum.COMPUTE,
      metadata,
      configuration.configFilePath
    );
  },

  async editMaterOrgData(metadata: OrganizationMetadata): Promise<void> {
    await writeToJsonFile(
      "masterOrganization",
      metadata,
      configuration.configFilePath
    );
  },

  async editSiteData(metadata: OrganizationMetadata): Promise<void> {
    await writeToJsonFile(
      AppTypeEnum.WEB_APP,
      metadata,
      configuration.configFilePath
    );
  },

  async editStorageData(metadata: OrganizationMetadata): Promise<void> {
    await writeToJsonFile(
      AppTypeEnum.STORAGE,
      metadata,
      configuration.configFilePath
    );
  },

  async getProjectTrackingData(): Promise<Array<ProjectTrackingElement>> {
    const projects: Array<ProjectTrackingElement> = await readFromJsonFile(
      "projects",
      configuration.projectTrackingFilePath
    );
    return projects;
  },

  async setProjectTrackingData(
    projects: Array<ProjectTrackingElement>
  ): Promise<void> {
    await writeToJsonFile(
      "projects",
      projects,
      configuration.projectTrackingFilePath
    );
  },
};

export interface OrganizationMetadata {
  organizationId: string;
}

export interface ProjectTrackingElement {
  name: string;
  path: string;
  protocol: string;
  framework: {
    name: string;
    configuration: any;
  };
}

export default MetadataService;
