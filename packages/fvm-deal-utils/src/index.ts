import { ProtocolEnum } from "@spheron/core";
import { processCarFile } from "./payload-creator";
import { DealDataResult } from "./interface";
import { SpheronClient } from "@spheron/storage"
import fs from "fs"

export interface SpheronClientConfiguration {
  token: string;
}

export class SpheronDealClient {
  private readonly configuration: SpheronClientConfiguration;  
  
  constructor(configuration: SpheronClientConfiguration) {
    this.configuration = configuration;    
  }

  async getPrepData (filename: string): Promise<DealDataResult> {   
    const spheronStorage = new SpheronClient(this.configuration)
    const carFileResults: any = await processCarFile(filename)    
    let currentlyUploaded = 0;
    const uploadResult = await spheronStorage.upload(
      carFileResults.filePath,
      {
        protocol: ProtocolEnum.IPFS,
        name: 'fvm_car_store',
        onUploadInitiated: (uploadId) => {
          console.log(`Upload with id ${uploadId} started...`);
        },
        onChunkUploaded: (uploadedSize, totalSize) => {
          currentlyUploaded += uploadedSize;
          console.log(`Uploaded ${currentlyUploaded} of ${totalSize} Bytes.`);
        },
      })
      if (uploadResult.protocolLink) {
        var carlink = uploadResult.protocolLink;
        //console.log('CarLink :', carlink)        
      } else {
        throw new Error('Error: Something went wrong');
      }
      fs.unlinkSync(carFileResults.filePath);
      fs.rmdirSync('out');      
      return {
        pieceSize: carFileResults.pieceSize,        
        size: carFileResults.size,
        pieceCid: carFileResults.pieceCid,
        dataCid: carFileResults.dataCid,
        carLink: carlink
      }
  };
}

export default SpheronDealClient
