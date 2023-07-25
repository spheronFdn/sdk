import fs from "fs";
import FormData from "form-data";
import path from "path";
import CID from 'cids';
import { exec } from "child_process";

export interface PayloadCreatorContext {
  payloads: FormData[];
  currentPayload: FormData | null;
  currentPayloadSize: number;
  totalSize: number;
}

const execute = (cmd : any) => {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (!error) {
        resolve(stdout)
      } else {
        reject(stderr)
      }
    })
  })
}

const processCarFile = async (
  filepath: string
): Promise<any> => {
    const fileDir = path.dirname(filepath)
    const binaryPath = path.relative(".", "node_modules/@spheron/fvm-deal-utils/lib/generate-car/generate-car")  
    const cmd = `${binaryPath} --single -i ${filepath} -o ${fileDir}/out -p ${path.dirname(filepath)}/`;  
    try {
      if (!filepath) {
        throw new Error('Provide a valid file');
      }
      if (!fs.statSync(path.resolve(filepath)).isFile()) {
        throw new Error('Provide a valid file');
      }
      if (!fs.existsSync(`${fileDir}/out`)) {
        fs.mkdirSync(`${fileDir}/out`);
      } else {
          const oldFiles = fs.readdirSync(`${fileDir}/out/`);
          if (oldFiles.length > 0) {
            for ( let i=0; i<oldFiles.length; i++ ) {
              fs.unlinkSync(`${fileDir}/out/${oldFiles[i]}`);
            }
          }
      }             
        
      const dataObj: any = {};          
      const result: any = await execute(cmd)     
      const data = JSON.parse(result);
      dataObj.pieceSize = data.PieceSize;
      dataObj.size = data.Ipld.Link[0].Size;
      const cidHexRaw = new CID(data.PieceCid).toString('base16').substring(1); //convert to hex
      const cidHex = '0x' + cidHexRaw; //hex notation
      dataObj.pieceCid = cidHex;
      dataObj.dataCid = data.DataCid;                 
      const carFiles = fs.readdirSync(`${fileDir}/out/`);
      if (!fs.statSync(`${fileDir}/out/` + carFiles[0]).isFile()) { 
        throw new Error('Car file was not generated');
      }
      const filePath = path.resolve(`${fileDir}/out/` + carFiles[0])
      dataObj.filePath = filePath          
      return dataObj

    } catch (e) {    
      throw new Error(e);    
    }
  }

export { processCarFile };
