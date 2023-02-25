import fs from "fs";
import path from "path";
import configuration from "./configuration";

export async function writeToConfigFile(key: string, value: any) {
  let config: any = {};
  try {
    // Check if the config file exists
    await fs.promises.stat(configuration.configFilePath);
    const fileContents = await fs.promises.readFile(
      configuration.configFilePath,
      "utf-8"
    );
    config = JSON.parse(fileContents);
  } catch (err) {
    console.log("Spheron config file not found. Creating a new file.");
    await fs.promises.mkdir(path.join(configuration.home_path, ".spheron"), {
      recursive: true,
    });
    await fs.promises.writeFile(configuration.configFilePath, "{}", "utf-8");
  }
  config[key] = value;
  const jsonString = JSON.stringify(config, null, 2); // pretty-print with 2-space indentation
  await fs.promises.writeFile(
    configuration.configFilePath,
    jsonString,
    "utf-8"
  );
}

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
  path: string
): Promise<void> {
  let config: any = {};
  try {
    // Check if the  file exists
    await fs.promises.stat(path);
    const fileContents = await fs.promises.readFile(path, "utf-8");
    config = JSON.parse(fileContents);
  } catch (err) {
    await fs.promises.writeFile(path, "{}", "utf-8");
  }
  config[key] = value;
  const jsonString = JSON.stringify(config, null, 2); // pretty-print with 2-space indentation
  await fs.promises.writeFile(path, jsonString, "utf-8");
}

export enum FileTypeEnum {
  DIRECTORY = "directory",
  FILE = "file",
}
