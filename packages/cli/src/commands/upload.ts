import configuration from "../configuration";
const { default: SpheronClient, ProtocolEnum } = require("@spheron/storage");
import cliProgress from "cli-progress";

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

    // Initialize the progress bar
    const progressBar = new cliProgress.SingleBar({
      format:
        "Uploading [{bar}] {percentage}% | ETA: {eta_formatted} | {value}/{total} bytes",
      stopOnComplete: true,
    });
    let uploadStarted = false;
    const { uploadId, bucketId, protocolLink, dynamicLinks } =
      await client.upload(rootPath, {
        protocol: mapProtocol(protocol),
        name: projectName,
        organizationId,
        onUploadInitiated: (deploymentId: any) => {
          console.log("Upload started, id of deployment: " + deploymentId);
        },
        onChunkUploaded(uploadedSize: any, totalSize: any) {
          if (!uploadStarted) {
            uploadStarted = true;
            progressBar.start(totalSize, 0);
          }
          uploadedBytes += uploadedSize;
          progressBar.update(uploadedBytes);
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
