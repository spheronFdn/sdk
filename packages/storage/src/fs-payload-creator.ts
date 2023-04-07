import fs from "fs";
import FormData from "form-data";
import path from "path";

export interface PayloadCreatorContext {
  payloads: FormData[];
  currentPayload: FormData | null;
  currentPayloadSize: number;
  totalSize: number;
}

const createPayloads = async (
  path: string,
  payloadSize: number
): Promise<{
  payloads: FormData[];
  totalSize: number;
}> => {
  const uploadContext: PayloadCreatorContext = {
    payloads: new Array<FormData>(),
    currentPayload: null,
    currentPayloadSize: 0,
    totalSize: 0,
  };

  await fillUploadContext(path, "./", uploadContext, true, payloadSize);

  if (uploadContext.currentPayload) {
    uploadContext.payloads.push(uploadContext.currentPayload);
  }

  return {
    payloads: uploadContext.payloads,
    totalSize: uploadContext.totalSize,
  };
};

const fillUploadContext = async (
  pathToFile: string,
  rootPath: string,
  uploadContext: PayloadCreatorContext,
  isRoot: boolean,
  payloadSize: number
): Promise<void> => {
  const stat = await fs.promises.stat(pathToFile);
  if (stat.isFile()) {
    const fileName = path.basename(pathToFile);
    processFile(
      pathToFile,
      rootPath + fileName,
      stat,
      uploadContext,
      payloadSize
    );
    return;
  }

  const files = await fs.promises.readdir(pathToFile);
  for (const file of files) {
    await fillUploadContext(
      `${pathToFile}/${file}`,
      isRoot ? "./" : `${rootPath}${path.basename(pathToFile)}/`,
      uploadContext,
      false,
      payloadSize
    );
  }
};

const processFile = async (
  fullPath: string,
  uploadPath: string,
  stat: fs.Stats,
  uploadContext: PayloadCreatorContext,
  payloadSize: number
) => {
  uploadContext.totalSize += stat.size;
  if (stat.size > payloadSize) {
    const numOfChunks = Math.ceil(stat.size / payloadSize);
    for (let i = 0; i < numOfChunks; i++) {
      const start = i * payloadSize;
      const end = start + payloadSize - 1;
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
    if (!uploadContext.currentPayload) {
      uploadContext.currentPayload = new FormData();
    }
    uploadContext.currentPayload.append(
      "files",
      fs.createReadStream(fullPath),
      {
        filepath: uploadPath,
      }
    );
    uploadContext.currentPayloadSize += stat.size;
    if (uploadContext.currentPayloadSize > payloadSize) {
      uploadContext.payloads.push(uploadContext.currentPayload);
      uploadContext.currentPayload = null;
      uploadContext.currentPayloadSize = 0;
    }
  }
};

export { createPayloads };
