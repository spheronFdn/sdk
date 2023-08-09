import fs from "fs";
import { ProtocolEnum } from "@spheron/core";
import { DealDataResult, PrepDataConfiguration } from "./interface";

import { SpheronClient } from "@spheron/storage";
import path from "path";
import CID from "cids";

import { executeCmd, generateRandomName } from "./utils";

export interface SpheronClientConfiguration {
  token: string;
}

export class SpheronDealClient {
  private readonly configuration: SpheronClientConfiguration;
  private readonly generateCarCommandPath = "./lib/generate-car/generate-car";

  constructor(configuration: SpheronClientConfiguration) {
    if (!configuration.token) {
      throw new Error("Token is not provided.");
    }
    this.configuration = configuration;
  }

  async getFvmMetadata(
    filePath: string,
    configuration: PrepDataConfiguration
  ): Promise<DealDataResult> {
    this.validateFilePath(filePath);
    this.validateConfiguration(configuration);

    const outputDir = this.generateUniqueDirectory(filePath);

    try {
      const carFileResults = await this.generateCarFile(filePath, outputDir);

      const spheronStorage = new SpheronClient(this.configuration);

      const uploadResult = await spheronStorage.upload(
        carFileResults.filePath,
        {
          protocol: ProtocolEnum.IPFS,
          name: configuration.name,
          onUploadInitiated: configuration.onUploadInitiated,
          onChunkUploaded: configuration.onChunkUploaded,
        }
      );

      return {
        pieceSize: carFileResults.pieceSize,
        size: carFileResults.size,
        pieceCid: carFileResults.pieceCid,
        dataCid: carFileResults.dataCid,
        carLink: `${uploadResult.protocolLink}/${path.basename(
          carFileResults.filePath
        )}`,
        carName: carFileResults.carName,
      };
    } finally {
      await fs.promises.rm(outputDir, { recursive: true });
    }
  }

  private generateCarFile = async (
    filePath: string,
    outDir: string
  ): Promise<{
    pieceSize: number;
    size: number;
    pieceCid: string;
    dataCid: string;
    filePath: string;
    carName: string;
  }> => {
    const cmd = `${
      this.generateCarCommandPath
    } --single -i ${filePath} -o ${outDir} -p ${path.dirname(filePath)}/`;
    const result = await executeCmd(cmd);

    const data = JSON.parse(result);

    const cidHexRaw = new CID(data.PieceCid).toString("base16"); // convert to hex
    const cidHex = "0x" + cidHexRaw.substring(1); // hex notation

    const carFiles = fs.readdirSync(outDir);
    if (!fs.statSync(outDir + "/" + carFiles[0]).isFile()) {
      throw new Error("Car file was not generated");
    }

    return {
      pieceSize: data.PieceSize,
      size: data.Ipld.Link[0].Size,
      pieceCid: cidHex,
      dataCid: data.DataCid,
      filePath: path.resolve(outDir + "/" + carFiles[0]),
      carName: data.PieceCid,
    };
  };

  private generateUniqueDirectory(filePath: string): string {
    const fileDir = path.dirname(filePath);
    const fileName = path.basename(filePath);

    let uniqueDirectory = generateRandomName(fileName);
    let counter = 0;
    while (fs.existsSync(`${fileDir}/${uniqueDirectory}`) && counter++ < 5) {
      uniqueDirectory = generateRandomName(fileName);
    }

    if (counter == 5) {
      throw new Error("Something went wrong. Try again.");
    }

    const outDir = `${fileDir}/${uniqueDirectory}`;
    fs.mkdirSync(outDir);
    return outDir;
  }

  private validateFilePath(filePath: string): void {
    if (!filePath) {
      throw new Error("File path is not specified.");
    }

    if (!fs.statSync(path.resolve(filePath)).isFile()) {
      throw new Error("The provided file path does not point to a valid file.");
    }
  }

  private validateConfiguration(config: PrepDataConfiguration): void {
    if (!config.name) {
      throw new Error("Bucket name is not provided.");
    }
  }
}

export default SpheronDealClient;
