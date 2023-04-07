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
    uploadContext.totalSize += file.size;
    if (!uploadContext.currentPayload) {
      uploadContext.currentPayload = new FormData();
    }
    uploadContext.currentPayload.append("files", file, {
      filepath: file.name,
    });
    uploadContext.currentPayloadSize += file.size;
    if (uploadContext.currentPayloadSize > payloadSize) {
      uploadContext.payloads.push(uploadContext.currentPayload);
      uploadContext.currentPayload = null;
      uploadContext.currentPayloadSize = 0;
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

export { createPayloads };
