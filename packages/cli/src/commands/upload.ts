import configuration from "../configuration";
// import SpheronClient, { ProtocolEnum } from "@spheron/storage";
import SpheronClient, { ProtocolEnum } from "spheron-storage-dusan";
import cliProgress from "cli-progress";

import { FileTypeEnum, getFileType, readFromJsonFile } from "../utils";
import Spinner from "../outputs/spinner";

export async function upload(
  rootPath: string,
  protocol: string,
  organizationId: string,
  projectName: string
) {
  const spinner = new Spinner();
  try {
    spinner.spin("Upload ");
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
    const progressBar = new cliProgress.SingleBar({
      format:
        "Uploading [{bar}] {percentage}% | ETA: {eta_formatted} | {value}/{total} bytes",
      stopOnComplete: true,
    });
    let uploadStarted = false;
    const fileType: FileTypeEnum = await getFileType(rootPath);
    console.log(`Uploading ${fileType} `);
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
    console.log("Upload finished, here is upload details:");
    console.log(`Upload ID: ${uploadId}`);
    console.log(`Bucket ID: ${bucketId}`);
    console.log(`Protocol Link: ${protocolLink}`);
    console.log(`Dynamic Links:", ${dynamicLinks.join(", ")}`);
    spinner.success("Upload finished !");
  } catch (error) {
    console.log(`Error: ${error.message}`);
    //TODO: Fix messages that are returned by spheron@storage
    if (protocol == "Arweave") {
      console.log(
        `Arweave is not enabled for starter plan, please upgrade your plan to pro to start uploading your files to Arweave.\nPlease feel free to contact our team on Discord if you have any questions.`
      );
    }
  } finally {
    spinner.stop();
  }
}

function mapProtocol(protocol: string): ProtocolEnum {
  if (protocol === "ipfs") {
    return ProtocolEnum.IPFS;
  } else if (protocol === "filecoin") {
    return ProtocolEnum.FILECOIN;
  } else if (protocol === "arweave") {
    return ProtocolEnum.ARWEAVE;
  }
  return ProtocolEnum.IPFS;
}
