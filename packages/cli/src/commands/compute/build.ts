import { SpheronComputeConfiguration } from "./interfaces";
import * as yaml from "js-yaml";
import * as fs from "fs/promises"; // Node.js fs module with promises
import * as path from "path";
import { spawn } from "child_process";
import Spinner from "../../outputs/spinner";

export async function build(
  configPath?: string,
  dockerHubUsername?: string,
  dockerHubPassword?: string
): Promise<any> {
  const spinner = new Spinner();

  try {
    if (!configPath) {
      configPath = "spheron.yaml";
    }

    spinner.spin("Fetching ");

    if (dockerHubUsername && dockerHubPassword) {
      const dockerLoginProcess = spawn("docker", [
        "login",
        "-u",
        dockerHubUsername,
        "-p",
        dockerHubPassword,
      ]);

      await new Promise<void>((resolve, reject) => {
        dockerLoginProcess.on("close", (code) => {
          if (code === 0) {
            spinner.success(
              `✓ Success! Dockerhub login with user ${dockerHubUsername} is successful! 🚀`
            );
            resolve();
          } else {
            spinner.stop();
            reject(
              new Error(`Dockerhub login user ${dockerHubUsername} failed ⚠️`)
            );
          }
        });
      });
    } else {
      spinner.stop();
      console.log(
        "Login credentials were not passed, will try to use default configuration ⚠️"
      );
    }

    console.log(
      `\n\nStating build process...\nReading configuration from ./spheron.yaml\n`
    );

    const yamlFilePath = path.join(process.cwd(), configPath); // Read spheron.yaml from the current working directory
    const yamlData = await fs.readFile(yamlFilePath, "utf8");
    const spheronConfig: SpheronComputeConfiguration = yaml.load(
      yamlData
    ) as SpheronComputeConfiguration;

    if (dockerHubUsername) {
      spheronConfig.services.forEach((service) => {
        if (
          service.dockerhubRepository &&
          service.dockerhubRepository.startsWith("spheron/")
        ) {
          service.dockerhubRepository = service.dockerhubRepository.replace(
            "spheron/",
            `${dockerHubUsername}/`
          );
        }
      });

      const yamlData = yaml.dump(spheronConfig);

      // Write to spheron.yaml file
      await fs.writeFile(configPath, yamlData, "utf8");
    }

    await Promise.all(
      spheronConfig.services
        .filter(
          (service) =>
            service.image.startsWith("./") || service.image.startsWith("/")
        )
        .map(async (service) => {
          if (!service.dockerhubRepository) {
            throw new Error("Dockerhub profile not selected");
          }

          const imageRootDirectory = service.image;

          const dockerfilePath = path.join(
            // rootDirectory,
            service.image,
            "/Dockerfile"
          );
          const imageName = `${service.dockerhubRepository}:${service.tag}`;

          console.log(`[${service.name}]: Starting docker build.`);

          // Use Docker CLI to build the image
          const dockerBuildProcess = spawn("docker", [
            "build",
            "-t",
            imageName,
            "-f",
            dockerfilePath,
            imageRootDirectory,
          ]);

          dockerBuildProcess.stdout.on("data", (data: any) => {
            console.log(`[${service.name}]: ${data}`);
          });

          dockerBuildProcess.stderr.on("data", (data: any) => {
            console.error(`[${service.name}]: ${data}`);
          });

          await new Promise<void>((resolve, reject) => {
            dockerBuildProcess.on("close", (code) => {
              if (code === 0) {
                console.log(
                  `[${service.name}] Docker build process completed successfully.`
                );
                resolve();
              } else {
                reject(
                  new Error(
                    `[${service.name}] Docker build process exited with code ${code}`
                  )
                );
              }
            });
          });

          console.log(`[${service.name}]: Pushing docker image.`);

          // Push the Docker image to the public repository
          const dockerPushProcess = spawn("docker", ["push", imageName]);

          dockerPushProcess.stdout.on("data", (data) => {
            console.log(`[${service.name}]: ${data}`);
          });

          dockerPushProcess.stderr.on("data", (data) => {
            console.error(`[${service.name}]: ${data}`);
          });

          await new Promise<void>((resolve, reject) => {
            dockerPushProcess.on("close", (code) => {
              if (code === 0) {
                console.log(
                  `\n✓ Successfully build [${service.name}] service and pushed to ${imageName}! 🚀\n`
                );
                resolve();
              } else {
                reject(
                  new Error(
                    `[${service.name}] Docker push process exited with code ${code}`
                  )
                );
              }
            });
          });
        })
    );

    console.log(
      `\n\nHelpful Commands:\n\nTo deploy your instance to Spheron, use this following command:\nspheron deploy`
    );
  } catch (error) {
    console.log(`✖️  Error: ${error.message}`);
    throw error;
  } finally {
    spinner.stop();
  }
}
