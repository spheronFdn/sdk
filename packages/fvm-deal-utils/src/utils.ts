import { exec } from "child_process";
import * as crypto from "crypto";

const executeCmd = (cmd: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (!error) {
        resolve(stdout);
      } else {
        reject(stderr);
      }
    });
  });
};

const generateRandomHexString = (length: number): string => {
  const buffer: Buffer = crypto.randomBytes(length);
  const randomHexString = buffer.toString("hex");
  // last half of the string is returned because there are two hex characters in a byte
  return randomHexString.slice(randomHexString.length / 2);
};

const generateRandomName = (fileName: string): string => {
  const randomString = generateRandomHexString(6);
  return `${fileName}-${randomString}`;
};

export { executeCmd, generateRandomHexString, generateRandomName };
