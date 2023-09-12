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

  async getComputeData(): Promise<ComputeMetadata> {
    const data: ComputeMetadata = await readFromJsonFile(
      AppTypeEnum.COMPUTE,
      configuration.configFilePath
    );
    return data;
  },

  async getSiteData(): Promise<SiteMetadata> {
    const data: SiteMetadata = await readFromJsonFile(
      AppTypeEnum.WEB_APP,
      configuration.configFilePath
    );
    return data;
  },

  async editComputeData(metadata: ComputeMetadata): Promise<void> {
    await writeToJsonFile(
      AppTypeEnum.COMPUTE,
      metadata,
      configuration.configFilePath
    );
  },

  async editSiteData(metadata: SiteMetadata): Promise<void> {
    await writeToJsonFile(
      AppTypeEnum.WEB_APP,
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

export interface ComputeMetadata {
  organizationId: string;
}

export interface SiteMetadata {
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
