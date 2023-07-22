import fs from "fs";
import * as path from "path";
import { IFiles } from "./commands/gpt";

export async function fileExists(path: string): Promise<boolean> {
  try {
    await fs.promises.stat(path);
    return true;
  } catch (err) {
    return false;
  }
}

export async function getFileType(path: string): Promise<FileTypeEnum> {
  try {
    const stats = await fs.promises.stat(path);
    if (stats.isDirectory()) {
      return FileTypeEnum.DIRECTORY;
    } else {
      return FileTypeEnum.FILE;
    }
  } catch (err) {
    console.error(err);
    throw new Error("Error while reading file");
  }
}

export async function readFromJsonFile(
  key: string,
  path: string
): Promise<any> {
  let config: any = {};
  try {
    const fileContents = await fs.promises.readFile(path, "utf-8");
    config = JSON.parse(fileContents);
  } catch (err) {
    console.error("Error reading Spheron config file:", err.message);
    return undefined;
  }
  return config[key];
}

export async function writeToJsonFile(
  key: string,
  value: any,
  path: string,
  options?: any
): Promise<void> {
  let config: any = {};
  const opt = options ? options : "utf-8";
  try {
    // Check if the  file exists
    await fs.promises.stat(path);
    const fileContents = await fs.promises.readFile(path, "utf-8");
    config = JSON.parse(fileContents);
  } catch (err) {
    await fs.promises.writeFile(path, "{}", opt);
  }
  config[key] = value;
  const jsonString = JSON.stringify(config, null, 2); // pretty-print with 2-space indentation
  await fs.promises.writeFile(path, jsonString, opt);
}

export async function deleteKeyFromJson(
  key: string,
  path: string
): Promise<void> {
  try {
    const fileContents = await fs.promises.readFile(path, "utf-8");
    const jsonConfig = JSON.parse(fileContents);
    delete jsonConfig[key];
    const jsonString = JSON.stringify(jsonConfig, null, 2);
    await fs.promises.writeFile(path, jsonString, "utf-8");
  } catch (err) {
    console.error(
      `Error deleting key ${key} from JSON file ${path}: ${err.message}`
    );
  }
}

export function mapProtocolToUserReadable(protocol: string): string {
  if (protocol === "ipfs") {
    return "IPFS";
  } else if (protocol === "filecoin") {
    return "Filecoin";
  } else if (protocol === "arweave") {
    return "Arweave";
  }
  return "IPFS";
}

export enum FileTypeEnum {
  DIRECTORY = "directory",
  FILE = "file",
}

export const generateFilePath = (filePath: string) => {
  const rootDirectory = ".";
  const { dir } = path.parse(filePath);

  // Check if the directory exists or create it
  const directoryPath = path.join(rootDirectory, dir);
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }

  const fileFullPath = path.join(rootDirectory, filePath);
  return fileFullPath;
};

export const generateFilesString = (response: IFiles[]) => {
  return response.map((file: IFiles) => file.filename).join(", ");
};

export const generateTestCasesFilesString = (
  filepath: string,
  response: IFiles[]
) => {
  return response
    .map((file: IFiles) => generateTestCaseFileName(filepath, file.filename))
    .join(", ");
};

export const createLog = (filepath: string, message: string) => {
  const fileContent = `${new Date().toISOString()} - ${message}\n`;
  fs.access(filepath, fs.constants.F_OK, (err) => {
    if (err) {
      fs.writeFileSync(filepath, fileContent);
    } else {
      fs.appendFileSync(filepath, fileContent);
    }
  });
};

export const generateTestCaseFileName = (
  filename: string,
  generatedFilename: string
) => {
  const nameOfFile = path.basename(filename, path.extname(filename));
  const fileExtension = path.extname(generatedFilename);
  return nameOfFile + ".test" + fileExtension;
};
