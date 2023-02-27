//TODO: Use spheron sdk to upload files
import configuration from "../configuration";
// const { default: SpheronClient, ProtocolEnum } = require("@spheron/storage");
import SpheronClient, { ProtocolEnum } from "@spheron/storage";

import { readFromJsonFile } from "../utils";

export async function upload(
  rootPath: string,
  protocol: string,
  organizationId: string,
  projectName: string
) {
  try {
    const jwtToken = await readFromJsonFile(
      "jwtToken",
      configuration.configFilePath
    );
    if (!jwtToken) {
      throw new Error("JWT token not present. Execute login command");
    }

    const client = new SpheronClient({ token: jwtToken });

    const { uploadId, bucketId, protocolLink, dynamicLinks } =
      await client.upload(rootPath, {
        protocol: mapProtocol(protocol),
        name: projectName,
        organizationId,
      });
    console.log(uploadId, bucketId, protocolLink, dynamicLinks);
  } catch (error) {
    console.log("Upload failed: ", error.message);
    throw error;
  }
}

function mapProtocol(protocol: string): ProtocolEnum {
  if (protocol === "ipfs") {
    return ProtocolEnum.IPFS;
  } else if (protocol === "ipfs-filecoin") {
    return ProtocolEnum.FILECOIN;
  } else if (protocol === "arweave") {
    return ProtocolEnum.ARWEAVE;
  }
  return ProtocolEnum.IPFS;
}
