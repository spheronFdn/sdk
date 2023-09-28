import { SpheronComputeConfiguration } from "./interfaces";
import * as yaml from "js-yaml";
import * as fs from "fs/promises"; // Node.js fs module with promises
import * as path from "path";
import { spawn } from "child_process";

export async function build(
  configPath?: string,
  dockerHubUsername?: string,
  dockerHubPassword?: string
): Promise<any> {
  try {
    if (!configPath) {
      configPath = "spheron.yaml";
    }
    console.log(`Reading from ${configPath}`);
    const yamlFilePath = path.join(process.cwd(), configPath); // Read spheron.yaml from the current working directory
    const yamlData = await fs.readFile(yamlFilePath, "utf8");
    const spheronConfig: any = yaml.load(
      yamlData
    ) as SpheronComputeConfiguration;
    if (
      spheronConfig.image.startsWith("./") ||
      spheronConfig.image.startsWith("/")
    ) {
      if (!spheronConfig.dockerhubRepository) {
        throw new Error("Dockerhub profile not selected");
      }
      const dockerfilePath = path.join(process.cwd(), spheronConfig.image);
      const imageName = `${spheronConfig.dockerhubRepository}:${spheronConfig.tag}`;

      // Use Docker CLI to build the image
      const dockerBuildProcess = spawn("docker", [
        "build",
        "-t",
        imageName,
        "-f",
        dockerfilePath,
        ".",
      ]);

      dockerBuildProcess.stdout.on("data", (data: any) => {
        console.log(`Docker Build Output: ${data}`);
      });

      dockerBuildProcess.stderr.on("data", (data: any) => {
        console.error(`Docker Build Error: ${data}`);
      });

      await new Promise<void>((resolve, reject) => {
        dockerBuildProcess.on("close", (code) => {
          if (code === 0) {
            console.log("Docker build process completed successfully.");
            resolve();
          } else {
            reject(new Error(`Docker build process exited with code ${code}`));
          }
        });
      });

      if (dockerHubUsername && dockerHubPassword) {
        const dockerLoginProcess = spawn("docker", [
          "login",
          "-u",
          dockerHubUsername,
          "-p",
          dockerHubPassword,
        ]);
        dockerLoginProcess.stdout.on("data", (data) => {
          console.log(`Docker Login Output: ${data}`);
        });

        dockerLoginProcess.stderr.on("data", (data) => {
          console.error(`Docker Login Error: ${data}`);
        });

        await new Promise<void>((resolve, reject) => {
          dockerLoginProcess.on("close", (code) => {
            if (code === 0) {
              console.log("Docker login process completed successfully.");
              resolve();
            } else {
              reject(
                new Error(`Docker login process exited with code ${code}`)
              );
            }
          });
        });
      } else {
        console.log(
          "Login credentials were not passed, will try to use default configuration ⚠️"
        );
      }

      // Push the Docker image to the public repository
      const dockerPushProcess = spawn("docker", ["push", imageName]);

      dockerPushProcess.stdout.on("data", (data) => {
        console.log(`Docker Push Output: ${data}`);
      });

      dockerPushProcess.stderr.on("data", (data) => {
        console.error(`Docker Push Error: ${data}`);
      });

      await new Promise<void>((resolve, reject) => {
        dockerPushProcess.on("close", (code) => {
          if (code === 0) {
            console.log("Docker push process completed successfully.");
            resolve();
          } else {
            reject(new Error(`Docker push process exited with code ${code}`));
          }
        });
      });
    } else {
      throw new Error("Config file is not pointing to local docker file");
    }
  } catch (error) {
    console.log(`✖️  Error: ${error.message}`);
    throw error;
  }
}
