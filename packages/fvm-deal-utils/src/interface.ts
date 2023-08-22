export interface PrepDataConfiguration {
  name: string;
  onUploadInitiated?: (uploadId: string) => void;
  onChunkUploaded?: (uploadedSize: number, totalSize: number) => void;
}

export interface DealDataResult {
  pieceSize: number;
  size: number;
  pieceCid: string;
  dataCid: string;
  carLink: string;
  carName: string;
  uploadId: string;
}
