import { AppTypeEnum } from "@spheron/core";
import MetadataService from "../services/metadata-service";

export async function changeDefaultOrganization(
  type: AppTypeEnum,
  organizationId: string
) {
  try {
    let appTypeMetadata: any;
    switch (type) {
      case AppTypeEnum.COMPUTE:
        appTypeMetadata = await MetadataService.getComputeData();
        if (!appTypeMetadata) {
          appTypeMetadata = { organizationId: organizationId };
        } else {
          appTypeMetadata.organizationId = organizationId;
        }
        MetadataService.editComputeData(appTypeMetadata);
        break;

      case AppTypeEnum.WEB_APP:
        appTypeMetadata = await MetadataService.getSiteData();
        if (!appTypeMetadata) {
          appTypeMetadata = { organizationId: organizationId };
        } else {
          appTypeMetadata.organizationId = organizationId;
        }
        MetadataService.editSiteData(appTypeMetadata);
        break;
      default:
        throw new Error("Unsupported app type");
    }
    console.log(
      `Succesfully switched default organizaiton to ${organizationId}`
    );
  } catch (error) {
    console.log(`✖️  Error: ${error.message}`);
  }
}
