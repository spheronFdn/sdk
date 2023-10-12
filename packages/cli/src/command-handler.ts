import { changeDefaultOrganization } from "./commands/switch-organization";
import { createConfiguration } from "./commands/create-configuration";
import { createOrganization } from "./commands/create-organization";
import {
  SiteResourceEnum,
  ResourceFetcher,
  ComputeResourceEnum,
} from "./commands/get-resources";
import {
  GptCommandEnum,
  createTestCases,
  findBugsInCode,
  generateCode,
  generateCodeBasedOnFile,
  improveCode,
  transpileCode,
  updateCode,
} from "./commands/gpt/gpt";
import { siteInit } from "./commands/site/init";
import { login } from "./commands/login";
import { logout } from "./commands/logout";
import { sitePublish } from "./commands/site/publish";
import { upload } from "./commands/site/upload";
import configuration from "./configuration";
import {
  filePathForGPT,
  languageForGPT,
  languageForGPTTest,
  promptForSwitchOrganization,
  promptForCreateDapp,
  promptForCreateOrganization,
  promptForGPT,
  promptForInit,
  promptForLogin,
  promptForUploadFile,
  promptForComputeInit,
  promptComputePublish,
  promptComputeUpdate,
} from "./prompts/prompts";
import SpheronApiService from "./services/spheron-api";
import { fileExists } from "./utils";
import { SiteCommandEnum } from "./commands/site/interfaces";
import {
  ComputeCommandEnum,
  CliComputeInstanceType,
  SpheronComputeConfiguration,
} from "./commands/compute/interfaces";
import { AppTypeEnum, MarketplaceApp } from "@spheron/core";
import MetadataService, { SiteMetadata } from "./services/metadata-service";
import { computeInit } from "./commands/compute/init";
import { computePublish } from "./commands/compute/publish";
import { validate } from "./commands/compute/validate";
import { executeShell } from "./commands/compute/execute-shell";
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

  if (options._[0] === "site" && options._[1] === SiteCommandEnum.UPLOAD) {
    const validOptions = ["path", "protocol", "bucket", "organization"];
    const unknownOptions = Object.keys(options).filter(
      (option) =>
        option !== "_" && option !== "$0" && !validOptions.includes(option)
    );
    if (unknownOptions.length > 0) {
      console.log(`Unrecognized options: ${unknownOptions.join(", ")}`);
      process.exit(1);
    }
    (async () => {
      let path, protocol, organizationId, bucketName;
      if (options.path && options.protocol) {
        path = options.path;
        protocol = options.protocol.toLowerCase();
        organizationId = options.organization;
        bucketName = options.project;
      } else {
        const prompt = await promptForUploadFile();
        path = prompt.path;
        protocol = prompt.protocol.toLowerCase();
        organizationId = prompt.organizationId;
        bucketName = prompt.project;
      }
      if (!bucketName) {
        const pathSegments = process.cwd().split("/");
        bucketName = pathSegments[pathSegments.length - 1];
        console.log(`Generated default bucket name: ${bucketName}`);
      }
      if (!organizationId) {
        const siteData: SiteMetadata = await MetadataService.getSiteData();
        organizationId = siteData.organizationId;
      }
      if (!path) {
        path = "./";
      }
      try {
        await upload(path, protocol, organizationId, bucketName);
      } catch (error) {
        process.exit(1);
      }
    })();
  }

  if (options._[0] === "site" && options._[1] === SiteCommandEnum.PUBLISH) {
    (async () => {
      try {
        if (options.organizationId) {
          await sitePublish(options.organizationId);
        } else {
          await sitePublish();
        }
      } catch (error) {
        process.exit(1);
      }
    })();
  }

  if (
    options._[0] === "site" &&
    options._[1] === SiteCommandEnum.CREATE_ORGANIZATION
  ) {
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
          await createOrganization(name, username, AppTypeEnum.WEB_APP);
        } catch (error) {
          process.exit(1);
        }
      } catch (error) {
        console.log(error.message);
        process.exit(1);
      }
    })();
  }

  if (options._[0] === "site" && options._[1] === SiteCommandEnum.INIT) {
    const validOptions = ["protocol", "project", "path", "framework"];
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
        let project, protocol, path, framework;
        if (options.protocol) {
          project = options.project;
          protocol = options.protocol.toLowerCase();
          path = options.path;
          framework = options.framework;
        } else {
          const prompt = await promptForInit();
          project = prompt.project;
          protocol = prompt.protocol.toLowerCase();
          path = prompt.path;
          framework = prompt.framework.toLowerCase();
        }
        if (!project) {
          const pathSegments = process.cwd().split("/");
          project = pathSegments[pathSegments.length - 1];
        }
        if (!path) {
          path = "./";
        }
        await siteInit(project, protocol, path, framework);
      } catch (error) {
        console.log(error.message);
        process.exit(1);
      }
    })();
  }

  if (options._[0] === "site" && options._[1] === SiteCommandEnum.CREATE_DAPP) {
    (async () => {
      try {
        if (options._[1]) {
          await promptForCreateDapp(options._[1]);
        } else {
          await promptForCreateDapp();
        }
      } catch (error) {
        console.log(error.message);
        process.exit(1);
      }
    })();
  }

  if (options._[0] === "site" && options._[1] === SiteCommandEnum.GET) {
    (async () => {
      try {
        if (options.resource) {
          if (options.resource == SiteResourceEnum.DEPLOYMENT) {
            const id = options.id;
            await ResourceFetcher.getDeployment(id);
          } else if (options.resource == SiteResourceEnum.DEPLOYMENTS) {
            const projectId = options.projectId;
            const skip = options.skip;
            const limit = options.limit;
            const status = options.status;
            await ResourceFetcher.getProjectDeployments(
              projectId,
              skip,
              limit,
              status
            );
          } else if (options.resource == SiteResourceEnum.PROJECT) {
            const id = options.id;
            await ResourceFetcher.getProject(id);
          } else if (options.resource == SiteResourceEnum.PROJECTS) {
            const organizationId = options.organizationId;
            const skip = options.skip;
            const limit = options.limit;
            const state = options.state;
            await ResourceFetcher.getOrganizationProjects(
              organizationId,
              skip,
              limit,
              state
            );
          } else if (options.resource == SiteResourceEnum.ORGANIZATION) {
            const id = options.id;
            await ResourceFetcher.getOrganization(id, AppTypeEnum.WEB_APP);
          } else if (options.resource == SiteResourceEnum.ORGANIZATIONS) {
            await ResourceFetcher.getUserOrganizations();
          } else if (options.resource == SiteResourceEnum.DOMAINS) {
            const projectId = options.projectId;
            await ResourceFetcher.getProjectDomains(projectId);
          } else if (
            options.resource == SiteResourceEnum.DEPLOYMENT_ENVIRONMENTS
          ) {
            const projectId = options.projectId;
            await ResourceFetcher.getProjectDeploymentEnvironments(projectId);
          }
        } else {
          throw new Error("Resource needs to be specified");
        }
      } catch (error) {
        console.log(error.message);
        process.exit(1);
      }
    })();
  }

  if (
    options._[0] === "site" &&
    options._[1] === SiteCommandEnum.SWITCH_ORGANIZATION
  ) {
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
        let organizationId;
        if (options.organization) {
          organizationId = options.organization;
        } else {
          const prompt = await promptForSwitchOrganization();
          organizationId = prompt.organization;
        }
        await changeDefaultOrganization(AppTypeEnum.WEB_APP, organizationId);
      } catch (error) {
        console.log(error.message);
        process.exit(1);
      }
    })();
  }

  if (options._[0] === "gpt" && options._[1] === GptCommandEnum.GENERATE) {
    const validOptions = ["prompt", "filepath"];
    const unknownOptions = Object.keys(options).filter(
      (option) =>
        option !== "_" && option !== "$0" && !validOptions.includes(option)
    );
    if (unknownOptions.length > 0) {
      console.log(`Unrecognized options: ${unknownOptions.join(", ")}`);
      process.exit(1);
    }
    const isWhitelisted = await SpheronApiService.isGptWhitelisted();
    // check if the user is whitelisted
    if (!isWhitelisted?.whitelisted && isWhitelisted?.error) {
      console.log(isWhitelisted?.message);
      process.exit(1);
    }
    (async () => {
      try {
        let gptPrompt;
        if (options.prompt) {
          gptPrompt = options.prompt;
        } else {
          const prompt = await promptForGPT();
          gptPrompt = prompt.gpt;
        }
        options.filepath
          ? await generateCodeBasedOnFile(gptPrompt, options.filepath)
          : await generateCode(gptPrompt);
      } catch (error) {
        console.log(error.message);
        process.exit(1);
      }
    })();
  }

  if (options._[0] === "gpt" && options._[1] === GptCommandEnum.UPDATE) {
    const validOptions = ["prompt", "filepath"];
    const unknownOptions = Object.keys(options).filter(
      (option) =>
        option !== "_" && option !== "$0" && !validOptions.includes(option)
    );
    if (unknownOptions.length > 0) {
      console.log(`Unrecognized options: ${unknownOptions.join(", ")}`);
      process.exit(1);
    }
    const isWhitelisted = await SpheronApiService.isGptWhitelisted();
    // check if the user is whitelisted
    if (!isWhitelisted?.whitelisted && isWhitelisted?.error) {
      console.log(isWhitelisted?.message);
      process.exit(1);
    }
    (async () => {
      try {
        let gptPrompt;
        if (options.prompt) {
          gptPrompt = options.prompt;
        } else {
          const prompt = await promptForGPT();
          gptPrompt = prompt.gpt;
        }
        let filePath;
        if (options.filepath) {
          filePath = options.filepath;
        } else {
          const path = await filePathForGPT();
          filePath = path.inputpath;
        }
        await updateCode(gptPrompt, filePath);
      } catch (error) {
        console.log(error.message);
        process.exit(1);
      }
    })();
  }

  if (options._[0] === "gpt" && options._[1] === GptCommandEnum.FINDBUGS) {
    const validOptions = ["filepath"];
    const unknownOptions = Object.keys(options).filter(
      (option) =>
        option !== "_" && option !== "$0" && !validOptions.includes(option)
    );
    if (unknownOptions.length > 0) {
      console.log(`Unrecognized options: ${unknownOptions.join(", ")}`);
      process.exit(1);
    }
    const isWhitelisted = await SpheronApiService.isGptWhitelisted();
    // check if the user is whitelisted
    if (!isWhitelisted?.whitelisted && isWhitelisted?.error) {
      console.log(isWhitelisted?.message);
      process.exit(1);
    }
    (async () => {
      try {
        let filePath;
        if (options.filepath) {
          filePath = options.filepath;
        } else {
          const path = await filePathForGPT();
          filePath = path.inputpath;
        }
        await findBugsInCode(filePath);
      } catch (error) {
        console.log(error.message);
        process.exit(1);
      }
    })();
  }

  if (options._[0] === "gpt" && options._[1] === GptCommandEnum.IMPROVE) {
    const validOptions = ["filepath"];
    const unknownOptions = Object.keys(options).filter(
      (option) =>
        option !== "_" && option !== "$0" && !validOptions.includes(option)
    );
    if (unknownOptions.length > 0) {
      console.log(`Unrecognized options: ${unknownOptions.join(", ")}`);
      process.exit(1);
    }
    const isWhitelisted = await SpheronApiService.isGptWhitelisted();
    // check if the user is whitelisted
    if (!isWhitelisted?.whitelisted && isWhitelisted?.error) {
      console.log(isWhitelisted?.message);
      process.exit(1);
    }
    (async () => {
      try {
        let filePath;
        if (options.filepath) {
          filePath = options.filepath;
        } else {
          const path = await filePathForGPT();
          filePath = path.inputpath;
        }
        await improveCode(filePath);
      } catch (error) {
        console.log(error.message);
        process.exit(1);
      }
    })();
  }

  if (options._[0] === "gpt" && options._[1] === GptCommandEnum.TRANSPILE) {
    const validOptions = ["filepath", "language"];
    const unknownOptions = Object.keys(options).filter(
      (option) =>
        option !== "_" && option !== "$0" && !validOptions.includes(option)
    );
    if (unknownOptions.length > 0) {
      console.log(`Unrecognized options: ${unknownOptions.join(", ")}`);
      process.exit(1);
    }
    const isWhitelisted = await SpheronApiService.isGptWhitelisted();
    // check if the user is whitelisted
    if (!isWhitelisted?.whitelisted && isWhitelisted?.error) {
      console.log(isWhitelisted?.message);
      process.exit(1);
    }
    (async () => {
      try {
        let progLanguage;
        if (options.language) {
          progLanguage = options.language;
        } else {
          const lang = await languageForGPT();
          progLanguage = lang.lang;
        }
        let filePath;
        if (options.filepath) {
          filePath = options.filepath;
        } else {
          const path = await filePathForGPT();
          filePath = path.inputpath;
        }
        await transpileCode(progLanguage, filePath);
      } catch (error) {
        console.log(error.message);
        process.exit(1);
      }
    })();
  }

  if (options._[0] === "gpt" && options._[1] === GptCommandEnum.TEST) {
    const validOptions = ["filepath"];
    const unknownOptions = Object.keys(options).filter(
      (option) =>
        option !== "_" && option !== "$0" && !validOptions.includes(option)
    );
    if (unknownOptions.length > 0) {
      console.log(`Unrecognized options: ${unknownOptions.join(", ")}`);
      process.exit(1);
    }
    const isWhitelisted = await SpheronApiService.isGptWhitelisted();
    // check if the user is whitelisted
    if (!isWhitelisted?.whitelisted && isWhitelisted?.error) {
      console.log(isWhitelisted?.message);
      process.exit(1);
    }
    (async () => {
      try {
        let progLanguage;
        if (options.language) {
          progLanguage = options.language;
        } else {
          const lang = await languageForGPTTest();
          progLanguage = lang.testlang;
        }
        let filePath;
        if (options.filepath) {
          filePath = options.filepath;
        } else {
          const path = await filePathForGPT();
          filePath = path.inputpath;
        }
        await createTestCases(progLanguage, filePath);
      } catch (error) {
        console.log(error.message);
        process.exit(1);
      }
    })();
  }

  if (
    options._[0] === "compute" &&
    options._[1] === ComputeCommandEnum.CREATE_ORGANIZATION
  ) {
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

  if (
    options._[0] === "compute" &&
    options._[1] === ComputeCommandEnum.SWITCH_ORGANIZATION
  ) {
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
        let organizationId;
        if (options.organization) {
          organizationId = options.organization;
        } else {
          const prompt = await promptForSwitchOrganization();
          organizationId = prompt.organization;
        }
        await changeDefaultOrganization(AppTypeEnum.COMPUTE, organizationId);
      } catch (error) {
        console.log(error.message);
        process.exit(1);
      }
    })();
  }

  if (options._[0] === "compute" && options._[1] === ComputeCommandEnum.INIT) {
    (async () => {
      try {
        let templateId, dockerfile, tag, dockerhubRepository;
        if (options.templateId && options.dockerfile) {
          throw new Error("Cannot specify both template and dockerfile");
        }
        if (options.templateId || options.dockerfile) {
          templateId = options.templateId;
          dockerfile = options.dockerfile;
          tag = options.tag;
          dockerhubRepository = options.dockerhubRepository;
        } else {
          const prompt = await promptForComputeInit();
          templateId = prompt?.template?._id;
          dockerfile = prompt?.dockerfile
            ? `${prompt.dockerfile}Dockerfile`
            : null;
          tag = prompt?.tag;
          dockerhubRepository = prompt?.dockerhubRepository;
        }
        let initialConfig: SpheronComputeConfiguration;
        if (!templateId) {
          initialConfig = {
            clusterName: "my_first_cluster",
            region: "any",
            image: dockerfile ? dockerfile : "ovrclk/lunie-light",
            tag: tag ? tag : "latest",
            instanceCount: 1,
            ports: [{ containerPort: 3000, exposedPort: 80 }],
            env: [
              {
                name: "my_env",
                value: "123",
                hidden: false,
              },
            ],
            commands: [],
            args: [],
            type: CliComputeInstanceType.SPOT,
            plan: "Ventus Nano 1",
            customParams: {
              storage: "10Gi",
            },
          };
          if (dockerhubRepository) {
            initialConfig.dockerhubRepository = dockerhubRepository;
          }
          await computeInit(initialConfig);
          return;
        } else {
          const template: MarketplaceApp =
            await SpheronApiService.getComputeTemplate(templateId);
          if (!template) {
            throw new Error("Specified template does not exist");
          }
          const plans = await SpheronApiService.getComputePlans();
          const defaultPlan = plans.find(
            (x) => x._id == template.serviceData.defaultAkashMachineImageId
          );
          const configEnvs = template.serviceData.variables.map((x) => {
            return {
              name: x.label,
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
          initialConfig = {
            templateId: template._id,
            templateName: template.name,
            clusterName: template.name,
            region: "any",
            image: template.serviceData.dockerImage,
            tag: template.serviceData.dockerImageTag,
            instanceCount: 1,
            ports: configPorts,
            env: configEnvs,
            commands: template.serviceData.commands,
            args: template.serviceData.args,
            type: CliComputeInstanceType.SPOT,
            plan: defaultPlan ? defaultPlan.name : "Ventus Nano 1",
            customParams: {
              storage: "10Gi",
            },
          };
          await computeInit(initialConfig);
        }
      } catch (error) {
        console.log(error.message);
        process.exit(1);
      }
    })();
  }

  if (options._[0] === "compute" && options._[1] === ComputeCommandEnum.BUILD) {
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

  if (options._[0] === "compute" && options._[1] === ComputeCommandEnum.CLOSE) {
    (async () => {
      try {
        const config = options.config;
        const instanceId = options.id;
        await close(instanceId, config);
      } catch (error) {
        process.exit(1);
      }
    })();
  }

  if (options._[0] === "compute" && options._[1] === ComputeCommandEnum.GET) {
    (async () => {
      try {
        if (options.resource) {
          if (options.resource == ComputeResourceEnum.ORGANIZATION) {
            const id = options.id;
            await ResourceFetcher.getOrganization(id, AppTypeEnum.COMPUTE);
          } else if (options.resource == ComputeResourceEnum.ORGANIZATIONS) {
            await ResourceFetcher.getUserOrganizations();
          } else if (options.resource == ComputeResourceEnum.PLANS) {
            const name = options.name;
          const info = options.info;
          await ResourceFetcher.getComputePlans(name, info);
          } else if (options.resource == ComputeResourceEnum.REGIONS) {
            await ResourceFetcher.getComputeRegions();
          } else if (options.resource == ComputeResourceEnum.CLUSTERS) {
            const organizationId = options.organizationId;
            await ResourceFetcher.getClusters(organizationId);
          } else if (options.resource == ComputeResourceEnum.INSTANCES) {
            const clusterId = options.clusterId;
            await ResourceFetcher.getClusterInstances(clusterId);
          } else if (options.resource == ComputeResourceEnum.INSTANCE) {
            const id = options.id;
            const downloadConfig = options.downloadConfig;
            await ResourceFetcher.getClusterInstance(id, downloadConfig);
          } else if (options.resource == ComputeResourceEnum.LOGS) {
            const instanceId = options.instanceId;
            const type = options.type;
            const versionId = options.versionId;
            const from = options.from;
            const to = options.to;
            const search = options.search;
            const download = options.d;
            const outputFile = options.outputFile;
            await ResourceFetcher.getClusterInstanceOrderLogs(
              instanceId,
              type,
              from,
              to,
              versionId,
              search,
              download,
              outputFile
            );
          } else if (options.resource == ComputeResourceEnum.TEMPLATES) {
            const category = options.category;
            const name = options.name;
            const info = options.info;
            await ResourceFetcher.getComputeTemplates(category, name, info);
        }
        } else {
          throw new Error("Resource needs to be specified");
        }
      } catch (error) {
        console.log(error.message);
        process.exit(1);
      }
    })();
  }

  if (
    options._[0] === "compute" &&
    options._[1] === ComputeCommandEnum.PUBLISH
  ) {
    (async () => {
      try {
        let organizationId, config;
        if (options.organizationId && options.config) {
          organizationId = options.organizationId;
          config = options.config;
        } else {
          const prompt = await promptComputePublish();
          organizationId = prompt.organization;
          config = prompt.config;
        }
        await computePublish(organizationId, config);
      } catch (error) {
        process.exit(1);
      }
    })();
  }

  if (
    options._[0] === "compute" &&
    options._[1] === ComputeCommandEnum.UPDATE
  ) {
    (async () => {
      try {
        let instanceId, organizationId, config;
        if (options.config) {
          organizationId = options.organizationId;
          config = options.config;
          instanceId = options.instanceId;
        } else {
          const prompt = await promptComputeUpdate();
          organizationId = prompt.organizationId;
          config = prompt.config;
          instanceId = prompt.instanceId;
        }
        await computeUpdate(instanceId, config, organizationId);
      } catch (error) {
        process.exit(1);
      }
    })();
  }

  if (
    options._[0] === "compute" &&
    options._[1] === ComputeCommandEnum.VALIDATE
  ) {
    const validOptions = ["config"];
    const unknownOptions = Object.keys(options).filter(
      (option) =>
        option !== "_" && option !== "$0" && !validOptions.includes(option)
    );
    if (unknownOptions.length > 0) {
      console.log(`Unrecognized options: ${unknownOptions.join(", ")}`);
      process.exit(1);
    }
    (async () => {
      let config;
      if (options.config) {
        config = options.path;
      }
      if (!config) {
        config = "./spheron.yaml";
      }
      try {
        await validate(config);
      } catch (error) {
        process.exit(1);
      }
    })();
  }

  if (options._[0] === "compute" && options._[1] === ComputeCommandEnum.SHELL) {
    const validOptions = ["instanceId", "command"];
    const unknownOptions = Object.keys(options).filter(
      (option) =>
        option !== "_" && option !== "$0" && !validOptions.includes(option)
    );
    if (unknownOptions.length > 0) {
      console.log(`Unrecognized options: ${unknownOptions.join(", ")}`);
      process.exit(1);
    }
    (async () => {
      const instanceId = options.instanceId;
      const command = options.command;
      try {
        await executeShell(instanceId, command);
      } catch (error) {
        process.exit(1);
      }
    })();
  }

  if (!options._[0]) {
    console.log(
      "Please use --help to check all commands available with spheron cli"
    );
  }
}
