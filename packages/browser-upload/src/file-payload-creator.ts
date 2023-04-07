import FormData from "form-data";

export interface PayloadCreatorContext {
  payloads: FormData[];
  currentPayload: FormData | null;
  currentPayloadSize: number;
  totalSize: number;
}

const createPayloads = async (
  files: File[],
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

  files.forEach((file) => {
    if (file.size > payloadSize) {
      const chunks = splitFileIntoChunks(file, payloadSize);
      chunks.forEach((chunk, index) => {
        const form = new FormData();
        form.append(
          `chunk-${index}-${chunks.length}`,
          new File([chunk], file.name),
          file.name
        );
        uploadContext.payloads.push(form);
      });
    } else {
      uploadContext.totalSize += file.size;
      if (!uploadContext.currentPayload) {
        uploadContext.currentPayload = new FormData();
      }
      uploadContext.currentPayload.append("files", file, file.name);
      uploadContext.currentPayloadSize += file.size;
      if (uploadContext.currentPayloadSize > payloadSize) {
        uploadContext.payloads.push(uploadContext.currentPayload);
        uploadContext.currentPayload = null;
        uploadContext.currentPayloadSize = 0;
      }
    }
  });
  if (uploadContext.currentPayload) {
    uploadContext.payloads.push(uploadContext.currentPayload);
  }

  return {
    payloads: uploadContext.payloads,
    totalSize: uploadContext.totalSize,
  };
};

function splitFileIntoChunks(file: File, chunkSize: number): Blob[] {
  const chunks: Blob[] = [];
  let start = 0;
  let end = chunkSize;

  while (start < file.size) {
    const chunk = file.slice(start, end);
    chunks.push(chunk);

    start += chunkSize;
    end += chunkSize;
  }

  return chunks;
}

export { createPayloads };
