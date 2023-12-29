import { MasterOrganization } from "@spheron/core";
import MetadataService from "../services/metadata-service";

export async function changeDefaultOrganization(masterOrg: MasterOrganization) {
  try {
    await Promise.all([
      MetadataService.editComputeData({
        organizationId: masterOrg.compute._id,
      }),
      MetadataService.editMaterOrgData({ organizationId: masterOrg._id }),
      MetadataService.editSiteData({ organizationId: masterOrg.site._id }),
      MetadataService.editStorageData({
        organizationId: masterOrg.storage._id,
      }),
    ]);

    console.log(
      `Succesfully switched default organizaiton to ${masterOrg.profile.name} (id:${masterOrg._id})`
    );
  } catch (error) {
    console.log(`✖️  Error: ${error.message}`);
  }
}
