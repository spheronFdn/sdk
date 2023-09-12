import configuration from "../configuration";
import { fileExists } from "../utils";
import { createConfiguration } from "./create-configuration";
import Spinner from "../outputs/spinner";
import { AppTypeEnum, Organization } from "@spheron/core";
import SpheronApiService from "../services/spheron-api";
import MetadataService from "../services/metadata-service";

export async function createOrganization(
  name: string,
  username: string,
  type: AppTypeEnum
) {
  const spinner = new Spinner();

  try {
    spinner.spin("Creating organization ");

    if (!(await fileExists(configuration.configFilePath))) {
      await createConfiguration();
    }

    const jwtToken = await MetadataService.getJwtToken();
    if (!jwtToken) {
      throw new Error(
        "For creating new organisation, you need to login to Spheron first"
      );
    }

    const organization: Organization =
      await SpheronApiService.createOrganization(username, name, type);
    let appTypeMetadata: any;

    switch (type) {
      case AppTypeEnum.COMPUTE:
        appTypeMetadata = await MetadataService.getComputeData();
        if (!appTypeMetadata) {
          appTypeMetadata = { organizationId: organization._id };
        } else {
          appTypeMetadata.organizationId = organization._id;
        }
        MetadataService.editComputeData(appTypeMetadata);
        break;

      case AppTypeEnum.WEB_APP:
        appTypeMetadata = await MetadataService.getSiteData();
        if (!appTypeMetadata) {
          appTypeMetadata = { organizationId: organization._id };
        } else {
          appTypeMetadata.organizationId = organization._id;
        }
        MetadataService.editSiteData(appTypeMetadata);
        break;

      default:
        throw new Error("Unsupported app type");
    }

    spinner.success(`Organization ${name} is created`);
  } catch (error) {
    spinner.stop();
    console.log(`✖️  Error: ${error.message}`);
    throw error;
  }
}
