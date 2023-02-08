import fs from "fs";
import FormData from "form-data";
import path from "path";

export interface PayloadCreatorContext {
  payloads: FormData[];
  currentPayload: FormData;
  currentPayloadSize: number;
}

export default class PayloadCreator {
  private readonly path: string;
  private readonly payloadSize: number;

  constructor(path: string, payloadSize: number) {
    this.path = path;
    this.payloadSize = payloadSize || 1024 * 1024 * 5;
  }

  public async createPayloads(): Promise<FormData[]> {
    const uploadContext: PayloadCreatorContext = {
      payloads: new Array<FormData>(),
      currentPayload: new FormData(),
      currentPayloadSize: 0,
    };

    await this.fillUploadContext(this.path, "./", uploadContext, true);

    if (uploadContext.currentPayloadSize > 0) {
      uploadContext.payloads.push(uploadContext.currentPayload);
    }

    return uploadContext.payloads;
  }

  private async fillUploadContext(
    pathToFile: string,
    rootPath: string,
    uploadContext: PayloadCreatorContext,
    isRoot: boolean
  ): Promise<void> {
    const stat = await fs.promises.stat(pathToFile);
    if (stat.isFile()) {
      const fileName = path.basename(pathToFile);
      this.processFile(pathToFile, rootPath + fileName, stat, uploadContext);
      return;
    }

    const files = await fs.promises.readdir(pathToFile);
    for (const file of files) {
      await this.fillUploadContext(
        `${pathToFile}/${file}`,
        isRoot ? "./" : `${rootPath}${path.basename(pathToFile)}/`,
        uploadContext,
        false
      );
    }
  }

  private async processFile(
    fullPath: string,
    uploadPath: string,
    stat: fs.Stats,
    uploadContext: PayloadCreatorContext
  ) {
    if (stat.size > this.payloadSize) {
      const numOfChunks = Math.ceil(stat.size / this.payloadSize);
      for (let i = 0; i < numOfChunks; i++) {
        const start = i * this.payloadSize;
        const end = start + this.payloadSize - 1;
        const form = new FormData();
        form.append(
          `chunk-${i}-${numOfChunks}`,
          fs.createReadStream(fullPath, { start, end }),
          {
            filepath: uploadPath,
          }
        );
        uploadContext.payloads.push(form);
      }
    } else {
      uploadContext.currentPayload.append(
        "files",
        fs.createReadStream(fullPath),
        {
          filepath: uploadPath,
        }
      );
      uploadContext.currentPayloadSize += stat.size;
      if (uploadContext.currentPayloadSize > this.payloadSize) {
        uploadContext.payloads.push(uploadContext.currentPayload);
        uploadContext.currentPayload = new FormData();
        uploadContext.currentPayloadSize = 0;
      }
    }
  }
}
