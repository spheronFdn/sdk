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
) => {
  const fileDir = path.dirname(filepath)
  const binaryPath = path.relative(".", "node_modules/@spheron/storage/lib/generate-car/generate-car")  
  //console.log(binaryPath)
  const cmd = `${binaryPath} --single -i ${filepath} -o ${fileDir}/out -p ${path.dirname(filepath)}/`;  
  try {
    if (filepath) {
      if (fs.statSync(path.resolve(filepath)).isFile()) {
        if (fs.existsSync(`${fileDir}/out`)) {
          const oldFiles = fs.readdirSync(`${fileDir}/out/`);
          if (oldFiles.length > 0) {
            for ( let i=0; i<oldFiles.length; i++ ) {
              fs.unlinkSync(`${fileDir}/out/${oldFiles[i]}`);
            }
          }          
        } else {
          fs.mkdirSync(`${fileDir}/out`);
        }
        const dataObj: any = {};          
        const result: any = await execute(cmd)
        //console.log(result)          
        const data = JSON.parse(result);
        //console.log(data)
        dataObj.pieceSize = data.PieceSize;
        dataObj.size = data.Ipld.Link[0].Size;
        const cidHexRaw = new CID(data.PieceCid).toString('base16').substring(1); //convert to hex
        const cidHex = '0x' + cidHexRaw; //hex notation
        dataObj.pieceCid = cidHex;
        dataObj.dataCid = data.DataCid;                 
        const carFiles = fs.readdirSync(`${fileDir}/out/`);
        if (fs.statSync(`${fileDir}/out/` + carFiles[0]).isFile()) {
          const filePath = path.resolve(`${fileDir}/out/` + carFiles[0])
          dataObj.filePath = filePath          
          return dataObj
        } else { 
            throw new Error('Car file was not generated');
        }          
      }
    } else {
        throw new Error('Provide a valid file');
    }   
  } catch (e) {    
    throw new Error(e);    
  }
}

export { createPayloads, processCarFile };
