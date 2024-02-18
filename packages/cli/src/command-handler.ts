import { changeDefaultOrganization } from "./commands/switch-organization";
import { createConfiguration } from "./commands/create-configuration";
import { createOrganization } from "./commands/create-organization";
import { ResourceFetcher } from "./commands/get-resources";
// import {
//   GptCommandEnum,
//   createTestCases,
//   findBugsInCode,
//   improveCode,
//   transpileCode,
//   updateCode,
// } from "./commands/gpt/gpt";
import { login } from "./commands/login";
import { logout } from "./commands/logout";
import configuration from "./configuration";
import {
  // filePathForGPT,
  // languageForGPT,
  // languageForGPTTest,
  promptForSwitchOrganization,
  promptForCreateOrganization,
  // promptForGPT,
  promptForLogin,
  closeInstancePrompt,
} from "./prompts/prompts";
import SpheronApiService from "./services/spheron-api";
import { fileExists } from "./utils";
import {
  ComputeCommandEnum,
  CliComputeInstanceType,
  SpheronComputeServiceConfiguration,
} from "./commands/compute/interfaces";
import {
  AppTypeEnum,
  MarketplaceApp,
  MasterOrganization,
  User,
} from "@spheron/core";
import {
  computeInit,
  readDockerComposeFile,
  readDockerfile,
} from "./commands/compute/init";
import { computeDeploy } from "./commands/compute/publish";
// import { validate } from "./commands/compute/validate";
// import { executeShell } from "./commands/compute/execute-shell";
import { computeUpdate } from "./commands/compute/update-instance";
import { build } from "./commands/compute/build";
import { close } from "./commands/compute/close";

export async function commandHandler(options: any) {
  if (!(await fileExists(configuration.configFilePath))) {
    //check if ${HOME}/.spheron dir exists
    await createConfiguration();
  }
  if (options._[0] === "login") {
    const validOptions = ["github", "gitlab", "bitbucket"];
    const unknownOptions = Object.keys(options).filter(
      (option) =>
        option !== "_" && option !== "$0" && !validOptions.includes(option)
    );
    if (unknownOptions.length > 0) {
      console.log(`Unrecognized options: ${unknownOptions.join(", ")}`);
      process.exit(1);
    }
    (async () => {
      if (options.github) {
        await login("github");
      } else if (options.gitlab) {
        await login("gitlab");
      } else if (options.bitbucket) {
        await login("bitbucket");
      } else {
        const { provider } = await promptForLogin();
        await login(provider.toLowerCase());
      }
    })();
  }

  if (options._[0] === "logout") {
    (async () => {
      await logout();
    })();
  }

  // if (options._[0] === "gpt" && options._[1] === GptCommandEnum.UPDATE) {
  //   const validOptions = ["prompt", "filepath"];
  //   const unknownOptions = Object.keys(options).filter(
  //     (option) =>
  //       option !== "_" && option !== "$0" && !validOptions.includes(option)
  //   );
  //   if (unknownOptions.length > 0) {
  //     console.log(`Unrecognized options: ${unknownOptions.join(", ")}`);
  //     process.exit(1);
  //   }
  //   const isWhitelisted = await SpheronApiService.isGptWhitelisted();
  //   // check if the user is whitelisted
  //   if (!isWhitelisted?.whitelisted && isWhitelisted?.error) {
  //     console.log(isWhitelisted?.message);
  //     process.exit(1);
  //   }
  //   (async () => {
  //     try {
  //       let gptPrompt;
  //       if (options.prompt) {
  //         gptPrompt = options.prompt;
  //       } else {
  //         const prompt = await promptForGPT();
  //         gptPrompt = prompt.gpt;
  //       }
  //       let filePath;
  //       if (options.filepath) {
  //         filePath = options.filepath;
  //       } else {
  //         const path = await filePathForGPT();
  //         filePath = path.inputpath;
  //       }
  //       await updateCode(gptPrompt, filePath);
  //     } catch (error) {
  //       console.log(error.message);
  //       process.exit(1);
  //     }
  //   })();
  // }

  // if (options._[0] === "gpt" && options._[1] === GptCommandEnum.FINDBUGS) {
  //   const validOptions = ["filepath"];
  //   const unknownOptions = Object.keys(options).filter(
  //     (option) =>
  //       option !== "_" && option !== "$0" && !validOptions.includes(option)
  //   );
  //   if (unknownOptions.length > 0) {
  //     console.log(`Unrecognized options: ${unknownOptions.join(", ")}`);
  //     process.exit(1);
  //   }
  //   const isWhitelisted = await SpheronApiService.isGptWhitelisted();
  //   // check if the user is whitelisted
  //   if (!isWhitelisted?.whitelisted && isWhitelisted?.error) {
  //     console.log(isWhitelisted?.message);
  //     process.exit(1);
  //   }
  //   (async () => {
  //     try {
  //       let filePath;
  //       if (options.filepath) {
  //         filePath = options.filepath;
  //       } else {
  //         const path = await filePathForGPT();
  //         filePath = path.inputpath;
  //       }
  //       await findBugsInCode(filePath);
  //     } catch (error) {
  //       console.log(error.message);
  //       process.exit(1);
  //     }
  //   })();
  // }

  // if (options._[0] === "gpt" && options._[1] === GptCommandEnum.IMPROVE) {
  //   const validOptions = ["filepath"];
  //   const unknownOptions = Object.keys(options).filter(
  //     (option) =>
  //       option !== "_" && option !== "$0" && !validOptions.includes(option)
  //   );
  //   if (unknownOptions.length > 0) {
  //     console.log(`Unrecognized options: ${unknownOptions.join(", ")}`);
  //     process.exit(1);
  //   }
  //   const isWhitelisted = await SpheronApiService.isGptWhitelisted();
  //   // check if the user is whitelisted
  //   if (!isWhitelisted?.whitelisted && isWhitelisted?.error) {
  //     console.log(isWhitelisted?.message);
  //     process.exit(1);
  //   }
  //   (async () => {
  //     try {
  //       let filePath;
  //       if (options.filepath) {
  //         filePath = options.filepath;
  //       } else {
  //         const path = await filePathForGPT();
  //         filePath = path.inputpath;
  //       }
  //       await improveCode(filePath);
  //     } catch (error) {
  //       console.log(error.message);
  //       process.exit(1);
  //     }
  //   })();
  // }

  // if (options._[0] === "gpt" && options._[1] === GptCommandEnum.TRANSPILE) {
  //   const validOptions = ["filepath", "language"];
  //   const unknownOptions = Object.keys(options).filter(
  //     (option) =>
  //       option !== "_" && option !== "$0" && !validOptions.includes(option)
  //   );
  //   if (unknownOptions.length > 0) {
  //     console.log(`Unrecognized options: ${unknownOptions.join(", ")}`);
  //     process.exit(1);
  //   }
  //   const isWhitelisted = await SpheronApiService.isGptWhitelisted();
  //   // check if the user is whitelisted
  //   if (!isWhitelisted?.whitelisted && isWhitelisted?.error) {
  //     console.log(isWhitelisted?.message);
  //     process.exit(1);
  //   }
  //   (async () => {
  //     try {
  //       let progLanguage;
  //       if (options.language) {
  //         progLanguage = options.language;
  //       } else {
  //         const lang = await languageForGPT();
  //         progLanguage = lang.lang;
  //       }
  //       let filePath;
  //       if (options.filepath) {
  //         filePath = options.filepath;
  //       } else {
  //         const path = await filePathForGPT();
  //         filePath = path.inputpath;
  //       }
  //       await transpileCode(progLanguage, filePath);
  //     } catch (error) {
  //       console.log(error.message);
  //       process.exit(1);
  //     }
  //   })();
  // }

  // if (options._[0] === "gpt" && options._[1] === GptCommandEnum.TEST) {
  //   const validOptions = ["filepath"];
  //   const unknownOptions = Object.keys(options).filter(
  //     (option) =>
  //       option !== "_" && option !== "$0" && !validOptions.includes(option)
  //   );
  //   if (unknownOptions.length > 0) {
  //     console.log(`Unrecognized options: ${unknownOptions.join(", ")}`);
  //     process.exit(1);
  //   }
  //   const isWhitelisted = await SpheronApiService.isGptWhitelisted();
  //   // check if the user is whitelisted
  //   if (!isWhitelisted?.whitelisted && isWhitelisted?.error) {
  //     console.log(isWhitelisted?.message);
  //     process.exit(1);
  //   }
  //   (async () => {
  //     try {
  //       let progLanguage;
  //       if (options.language) {
  //         progLanguage = options.language;
  //       } else {
  //         const lang = await languageForGPTTest();
  //         progLanguage = lang.testlang;
  //       }
  //       let filePath;
  //       if (options.filepath) {
  //         filePath = options.filepath;
  //       } else {
  //         const path = await filePathForGPT();
  //         filePath = path.inputpath;
  //       }
  //       await createTestCases(progLanguage, filePath);
  //     } catch (error) {
  //       console.log(error.message);
  //       process.exit(1);
  //     }
  //   })();
  // }

  if (options._[0] === ComputeCommandEnum.CREATE_ORGANIZATION) {
    const validOptions = ["name", "username"];
    const unknownOptions = Object.keys(options).filter(
      (option) =>
        option !== "_" && option !== "$0" && !validOptions.includes(option)
    );
    if (unknownOptions.length > 0) {
      console.log(`Unrecognized options: ${unknownOptions.join(", ")}`);
      process.exit(1);
    }
    (async () => {
      try {
        let name, username;
        if (options.name && options.username) {
          name = options.name;
          username = options.username;
        } else {
          const prompt = await promptForCreateOrganization();
          name = prompt.name;
          username = prompt.username;
        }
        if (!name) {
          throw new Error("Please insert a name for organization.");
        }
        if (!username) {
          throw new Error("Please insert username for organization.");
        }
        try {
          await createOrganization(name, username, AppTypeEnum.COMPUTE);
        } catch (error) {
          process.exit(1);
        }
      } catch (error) {
        console.log(error.message);
        process.exit(1);
      }
    })();
  }

  if (options._[0] === ComputeCommandEnum.SWITCH_ORGANIZATION) {
    //FETCH ALL AND PICK

    const validOptions = ["organization"];
    const unknownOptions = Object.keys(options).filter(
      (option) =>
        option !== "_" && option !== "$0" && !validOptions.includes(option)
    );
    if (unknownOptions.length > 0) {
      console.log(`Unrecognized options: ${unknownOptions.join(", ")}`);
      process.exit(1);
    }
    (async () => {
      try {
        let masterOrg: MasterOrganization;
        if (options.organization) {
          masterOrg = await SpheronApiService.getOrganization(
            options.organization
          );

          if (!masterOrg) {
            throw new Error(
              `Organization with id ${options.organization} doesn't exist.`
            );
          }
        } else {
          const user: User = await SpheronApiService.getProfile();

          const orgNameList: string[] = user.organizations.map(
            (org) => org.profile.name
          );

          const prompt = await promptForSwitchOrganization(orgNameList);
          const organizationName = prompt.organization;

          masterOrg = user.organizations.find(
            (org) => org.profile.name === organizationName
          ) as MasterOrganization;
        }
        await changeDefaultOrganization(masterOrg);
      } catch (error) {
        console.log(error.message);
        process.exit(1);
      }
    })();
  }

  if (options._[0] === ComputeCommandEnum.INIT) {
    (async () => {
      try {
        console.log(`prompt data: ${JSON.stringify(options)}`);

        const marketplaceAppId = options.marketplace;
        const importFile = options.import;
        const dockerFile = options.dockerFile;

        const services: Array<SpheronComputeServiceConfiguration> = [];

        const region = "us-west";

        if (importFile) {
          const dockerComposeServices = await readDockerComposeFile(importFile);

          if (dockerComposeServices) {
            services.push(...dockerComposeServices);
          }
        }

        if (dockerFile) {
          const dockerFiles =
            typeof dockerFile === "string" ? [dockerFile] : dockerFile;

          const dockerFileConfigs = await Promise.all(
            dockerFiles.map(async (df: string) => readDockerfile(df))
          );

          services.push(...dockerFileConfigs.filter((df) => df));
        }

        if (marketplaceAppId) {
          const templateIds =
            typeof marketplaceAppId === "string"
              ? [marketplaceAppId]
              : marketplaceAppId;

          await Promise.all(
            templateIds.map(async (id: string) => {
              const template: MarketplaceApp =
                await SpheronApiService.getMarketplaceApp(id);
              if (!template) {
                throw new Error("Specified template does not exist");
              }

              const plans = await SpheronApiService.getComputePlans();
              const defaultPlan = plans.find(
                (x) => x._id == template.serviceData.defaultAkashMachineImageId
              );
              const configEnvs = template.serviceData.variables.map((x) => {
                return {
                  name: x.name,
                  value: `${x.defaultValue}`,
                  hidden: x.hidden ? x.hidden : false,
                };
              });
              const configPorts = template.serviceData.ports.map((x) => {
                return {
                  containerPort: x.containerPort,
                  exposedPort: x.exposedPort,
                };
              });

              services.push({
                name: template.name.toLocaleLowerCase().replace(" ", "_"),
                templateId: template._id,
                templateName: template.name,
                image: template.serviceData.dockerImage,
                tag: template.serviceData.dockerImageTag,
                count: 1,
                ports: configPorts,
                env: configEnvs,
                commands: template.serviceData.commands,
                args: template.serviceData.args,
                plan: defaultPlan ? defaultPlan.name : "Ventus Nano 1",
                customParams: {
                  storage: "10Gi",
                },
              });
            })
          );
        }

        if (services.length == 0) {
          services.push({
            name: `service`,
            image: "crccheck/hello-world",
            tag: "latest",
            count: 1,
            ports: [{ containerPort: 8000, exposedPort: 8000 }],
            env: [
              {
                name: "my_env",
                value: "123",
                hidden: false,
              },
            ],
            commands: [],
            args: [],
            plan: "Ventus Nano 1",
            customParams: {
              storage: "10Gi",
            },
          });
        }

        await computeInit({
          projectName: "my_first_project",
          services: services,
          region: region,
          type: CliComputeInstanceType.ON_DEMAND,
        });
      } catch (error) {
        console.log(error.message);
        process.exit(1);
      }
    })();
  }

  if (options._[0] === ComputeCommandEnum.BUILD) {
    const validOptions = ["config", "u", "p"];
    const unknownOptions = Object.keys(options).filter(
      (option) =>
        option !== "_" && option !== "$0" && !validOptions.includes(option)
    );
    if (unknownOptions.length > 0) {
      console.log(`Unrecognized options: ${unknownOptions.join(", ")}`);
      process.exit(1);
    }
    (async () => {
      try {
        const config = options.config;
        const dockerUsername = options.u;
        const dockerPassword = options.p;
        console.log("CONFIG:", config);
        console.log("Username:", dockerUsername);
        console.log("Password:", dockerPassword);
        await build(config, dockerUsername, dockerPassword);
      } catch (error) {
        console.log(error.message);
        process.exit(1);
      }
    })();
  }

  if (options._[0] === ComputeCommandEnum.CLOSE) {
    (async () => {
      try {
        const config = options.config;
        const instanceId = options.instance;

        const prompt = await closeInstancePrompt(instanceId);

        if (prompt.answer === "Yes") {
          await close(instanceId, config);
        }
      } catch (error) {
        process.exit(1);
      }
    })();
  }

  if (options._[0] === ComputeCommandEnum.PROJECTS) {
    (async () => {
      try {
        // const name = options.name;
        const organizationId = options.organizationId;
        await ResourceFetcher.getComputeProject(organizationId);
      } catch (error) {
        console.log(error.message);
        process.exit(1);
      }
    })();
  }

  if (options._[0] === ComputeCommandEnum.PLANS) {
    (async () => {
      try {
        const name = options.name;
        const region = options.region;
        await ResourceFetcher.getComputePlans(name, region);
      } catch (error) {
        console.log(error.message);
        process.exit(1);
      }
    })();
  }

  if (options._[0] === ComputeCommandEnum.MARKETPLACE_APP) {
    (async () => {
      try {
        const category = options.category;
        await ResourceFetcher.getMarketplaceApps(category);
      } catch (error) {
        console.log(error.message);
        process.exit(1);
      }
    })();
  }

  if (options._[0] === ComputeCommandEnum.REGIONS) {
    (async () => {
      try {
        await ResourceFetcher.getComputeRegions();
      } catch (error) {
        console.log(error.message);
        process.exit(1);
      }
    })();
  }

  if (options._[0] === ComputeCommandEnum.SERVICE) {
    (async () => {
      try {
        const serviceName = options.name;
        const instanceId = options.instance;
        await ResourceFetcher.getComputeDeploymentService(
          serviceName,
          instanceId
        );
      } catch (error) {
        console.log(error.message);
        process.exit(1);
      }
    })();
  }

  // if (options._[0] === ComputeCommandEnum.METRICS) {
  //   (async () => {
  //     try {
  //       const serviceName = options.name;
  //       const instanceId = options.instance;
  //       await ResourceFetcher.getComputeDeploymentService(
  //         serviceName,
  //         instanceId
  //       );
  //     } catch (error) {
  //       console.log(error.message);
  //       process.exit(1);
  //     }
  //   })();
  // }

  if (options._[0] === ComputeCommandEnum.INSTANCE) {
    (async () => {
      try {
        const id = options.id;
        const downloadConfig = options.downloadConfig;
        await ResourceFetcher.getComputeInstance(id, downloadConfig);
      } catch (error) {
        console.log(error.message);
        process.exit(1);
      }
    })();
  }

  if (options._[0] === ComputeCommandEnum.INSTANCES) {
    (async () => {
      try {
        const computeProjectId = options.project;
        let state = options.status;

        if (!computeProjectId && !state) {
          state = "Active";
        }

        await ResourceFetcher.getComputeInstances(computeProjectId, state);
      } catch (error) {
        console.log(error.message);
        process.exit(1);
      }
    })();
  }

  if (options._[0] === ComputeCommandEnum.ORGANIZATION) {
    (async () => {
      try {
        const id = options.id;
        const all = options.all;

        if (all) {
          await ResourceFetcher.getUserOrganizations();
        } else {
          await ResourceFetcher.getOrganization(id);
        }
      } catch (error) {
        console.log(error.message);
        process.exit(1);
      }
    })();
  }

  if (options._[0] === ComputeCommandEnum.LOGS) {
    (async () => {
      try {
        const instanceId = options.instance;
        const serviceName = options.service;

        const type = options.type;
        const versionId = options.versionId;
        const from = options.from;
        const to = options.to;
        const search = options.search;
        const download = options.d;
        const outputFile = options.outputFile;

        await ResourceFetcher.getComputeDeploymentLogs(
          instanceId,
          type,
          from,
          to,
          versionId,
          search,
          download,
          outputFile,
          serviceName
        );
      } catch (error) {
        console.log(error.message);
        process.exit(1);
      }
    })();
  }

  if (options._[0] === ComputeCommandEnum.PLANS) {
    (async () => {
      try {
        const name = options.name;
        await ResourceFetcher.getComputePlans(name);
      } catch (error) {
        console.log(error.message);
        process.exit(1);
      }
    })();
  }

  if (options._[0] === ComputeCommandEnum.DEPLOY) {
    (async () => {
      try {
        const organizationId = options.organizationId;
        const config = options.config ?? "./spheron.yaml";

        await computeDeploy(organizationId, config);
      } catch (error) {
        process.exit(1);
      }
    })();
  }

  if (options._[0] === ComputeCommandEnum.UPDATE) {
    (async () => {
      try {
        const organizationId = options.organization;
        const config = options.config ?? "./spheron.yaml";
        const instanceId = options.instance;

        await computeUpdate(instanceId, config, organizationId);
      } catch (error) {
        process.exit(1);
      }
    })();
  }

  // if (options._[0] === ComputeCommandEnum.VALIDATE) {
  //   const validOptions = ["config"];
  //   const unknownOptions = Object.keys(options).filter(
  //     (option) =>
  //       option !== "_" && option !== "$0" && !validOptions.includes(option)
  //   );
  //   if (unknownOptions.length > 0) {
  //     console.log(`Unrecognized options: ${unknownOptions.join(", ")}`);
  //     process.exit(1);
  //   }
  //   (async () => {
  //     let config;
  //     if (options.config) {
  //       config = options.path;
  //     }
  //     if (!config) {
  //       config = "./spheron.yaml";
  //     }
  //     try {
  //       await validate(config);
  //     } catch (error) {
  //       process.exit(1);
  //     }
  //   })();
  // }

  // if (options._[0] === ComputeCommandEnum.SHELL) {
  //   const validOptions = ["instanceId", "command", "service"];
  //   const unknownOptions = Object.keys(options).filter(
  //     (option) =>
  //       option !== "_" && option !== "$0" && !validOptions.includes(option)
  //   );
  //   if (unknownOptions.length > 0) {
  //     console.log(`Unrecognized options: ${unknownOptions.join(", ")}`);
  //     process.exit(1);
  //   }
  //   (async () => {
  //     const instanceId = options.instanceId;
  //     const command = options.command;
  //     const serviceName = options.service;
  //     try {
  //       await executeShell(instanceId, command, serviceName);
  //     } catch (error) {
  //       process.exit(1);
  //     }
  //   })();
  // }

  if (!options._[0]) {
    console.log(
      "Please use --help to check all commands available with spheron cli"
    );
  }
}
