import configuration from "../configuration";
import SpheronClient, { ProtocolEnum } from "@spheron/storage";
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
    console.log(error.message);
  } finally {
    spinner.stop();
  }
}

function mapProtocol(protocol: string): ProtocolEnum {
  if (protocol === "IPFS") {
    return ProtocolEnum.IPFS;
  } else if (protocol === "Filecoin") {
    return ProtocolEnum.FILECOIN;
  } else if (protocol === "Arweave") {
    return ProtocolEnum.ARWEAVE;
  }
  return ProtocolEnum.IPFS;
}
