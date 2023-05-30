import configuration from "../configuration";
import SpheronClient, { ProtocolEnum } from "@spheron/storage";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const chalk = require("chalk");

import {
  fileExists,
  FileTypeEnum,
  getFileType,
  mapProtocolToUserReadable,
  readFromJsonFile,
} from "../utils";
import Spinner from "../outputs/spinner";
import { progressBar } from "../outputs/progress-bar";

export async function upload(
  rootPath: string,
  protocol: string,
  organizationId: string,
  bucketName: string
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
    if (!(await fileExists(rootPath))) {
      throw new Error(`File ${rootPath} does not exist`);
    }
    const fileType: FileTypeEnum = await getFileType(rootPath);
    console.log(`Uploading ${fileType} ${rootPath}`);
    const { uploadId, bucketId, protocolLink, dynamicLinks } =
      await client.upload(rootPath, {
        protocol: mapProtocolToStorageSDK(protocol),
        name: bucketName,
        organizationId,
        onUploadInitiated: (uploadId: any) => {
          console.log("Upload started, ID of upload: " + uploadId);
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
    spinner.success("Upload finished !");
    spinner.stop();
    console.log("Here are upload details:");
    console.log(`Upload ID: ${uploadId}`);
    console.log(`Bucket ID: ${bucketId}`);
    console.log(chalk.green(`Protocol Link:`), protocolLink);
    console.log(
      chalk.green(`Dynamic Links:`),
      dynamicLinks
        .map((link) => {
          return `https://${link}`;
        })
        .join(", ")
    );
  } catch (error) {
    console.log(`✖️  Error: ${error.message}`);
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
