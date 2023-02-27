import configuration from "../configuration";
const { default: SpheronClient, ProtocolEnum } = require("@spheron/storage");

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

    let uploadedBytes = 0;
    const { uploadId, bucketId, protocolLink, dynamicLinks } =
      await client.upload(rootPath, {
        protocol: mapProtocol(protocol),
        name: projectName,
        organizationId,
        onUploadInitiated: (deploymentId: any) => {
          console.log("Upload started, id of deployment: " + deploymentId);
        },
        onChunkUploaded(uploadedSize: any, totalSize: any) {
          uploadedBytes += uploadedSize;
          console.log(
            `Uploaded ${uploadedBytes} bytes of total ${totalSize} bytes`
          );
        },
      });
    console.log("uploadId:", uploadId);
    console.log("bucketId:", bucketId);
    console.log("protocolLink:", protocolLink);
    console.log("dynamicLinks:", dynamicLinks);
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
