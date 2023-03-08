import configuration from "../configuration";
import SpheronClient, { ProtocolEnum } from "@spheron/storage";

import { FileTypeEnum, getFileType, readFromJsonFile } from "../utils";
import Spinner from "../outputs/spinner";
import { progressBar } from "../outputs/progress-bar";

export async function upload(
  rootPath: string,
  protocol: string,
  organizationId: string,
  projectName: string
) {
  const spinner = new Spinner();
  try {
    spinner.spin(`Uploading to ${mapProtocolToUserReadable(protocol)} `, 4000);
    const jwtToken = await readFromJsonFile(
      "jwtToken",
      configuration.configFilePath
    );
    if (!jwtToken) {
      throw new Error(
        "Authorization failed. Please execute login command first"
      );
    }
    const client = new SpheronClient({ token: jwtToken });

    let uploadedBytes = 0;
    // Initialize the progress bar
    let uploadStarted = false;
    const fileType: FileTypeEnum = await getFileType(rootPath);
    console.log(`Uploading ${fileType} `);
    const { uploadId, bucketId, protocolLink, dynamicLinks } =
      await client.upload(rootPath, {
        protocol: mapProtocolToStorageSDK(protocol),
        name: projectName,
        organizationId,
        onUploadInitiated: (deploymentId: any) => {
          console.log("Upload started, id of deployment: " + deploymentId);
        },
        onChunkUploaded(uploadedSize: any, totalSize: any) {
          if (!uploadStarted) {
            uploadStarted = true;
            console.log(progressBar(0, totalSize));
            process.stdout.moveCursor(0, -1);
          } else {
            uploadedBytes += uploadedSize;
            process.stdout.moveCursor(0, 1);
            process.stdout.clearLine(-1);
            process.stdout.cursorTo(0);
            console.log(
              `Uploaded ${formatBytes(uploadedBytes)}/${formatBytes(
                totalSize
              )} (${formatPercentage(uploadedBytes, totalSize)}), ${progressBar(
                uploadedBytes,
                totalSize
              )}`
            );
            process.stdout.moveCursor(0, -2);
          }
        },
      });
    spinner.success("Upload finished !🚀");
    spinner.stop();
    console.log("Upload finished, here are upload details:");
    console.log(`Upload ID: ${uploadId}`);
    console.log(`Bucket ID: ${bucketId}`);
    console.log(`Protocol Link: ${protocolLink}`);
    console.log(`Dynamic Links:, ${dynamicLinks.join(", ")}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    //TODO: Fix messages that are returned by spheron@storage
    if (protocol == "arweave") {
      console.log(
        `Arweave is not enabled for starter plan, please upgrade your plan to pro to start uploading your files to Arweave.\nPlease feel free to contact our team on Discord if you have any questions.`
      );
    }
  } finally {
    spinner.stop();
  }
}

function mapProtocolToStorageSDK(protocol: string): ProtocolEnum {
  if (protocol === "ipfs") {
    return ProtocolEnum.IPFS;
  } else if (protocol === "filecoin") {
    return ProtocolEnum.FILECOIN;
  } else if (protocol === "arweave") {
    return ProtocolEnum.ARWEAVE;
  }
  return ProtocolEnum.IPFS;
}

function mapProtocolToUserReadable(protocol: string): string {
  if (protocol === "ipfs") {
    return "IPFS";
  } else if (protocol === "filecoin") {
    return "Filecoin";
  } else if (protocol === "arweave") {
    return "Arweave";
  }
  return "IPFS";
}

// Helper functions for formatting bytes, percentages, and time
function formatBytes(bytes: number) {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let index = 0;
  while (bytes >= 1024 && index < units.length - 1) {
    bytes /= 1024;
    index++;
  }
  return `${bytes.toFixed(2)} ${units[index]}`;
}

function formatPercentage(value: number, total: number) {
  const percentage = (value / total) * 100;
  return `${percentage.toFixed(2)}%`;
}
