import { changeDefaultOrganization } from "./commands/configure";
import { createConfiguration } from "./commands/create-configuration";
import { createOrganization } from "./commands/create-organization";
import { ResourceEnum, ResourceFetcher } from "./commands/site/get-resources";
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
import { init } from "./commands/site/init";
import { login } from "./commands/login";
import { logout } from "./commands/logout";
import { publish } from "./commands/site/publish";
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
} from "./prompts/prompts";
import SpheronApiService from "./services/spheron-api";
import { fileExists } from "./utils";
import { SiteCommandEnum } from "./commands/site/interfaces";
import { ComputeCommandEnum } from "./commands/compute/interfaces";
import { AppTypeEnum } from "@spheron/core";
import MetadataService, { SiteMetadata } from "./services/metadata-service";

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
        if (options.organization) {
          await publish(options.organization);
        } else {
          await publish();
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
        await init(project, protocol, path, framework);
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
          if (options.resource == ResourceEnum.DEPLOYMENT) {
            const id = options.id;
            await ResourceFetcher.getDeployment(id);
          } else if (options.resource == ResourceEnum.DEPLOYMENTS) {
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
          } else if (options.resource == ResourceEnum.PROJECT) {
            const id = options.id;
            await ResourceFetcher.getProject(id);
          } else if (options.resource == ResourceEnum.PROJECTS) {
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
          } else if (options.resource == ResourceEnum.ORGANIZATION) {
            const id = options.id;
            await ResourceFetcher.getOrganization(id);
          } else if (options.resource == ResourceEnum.ORGANIZATIONS) {
            await ResourceFetcher.getUserOrganizations();
          } else if (options.resource == ResourceEnum.DOMAINS) {
            const projectId = options.projectId;
            await ResourceFetcher.getProjectDomains(projectId);
          } else if (options.resource == ResourceEnum.DEPLOYMENT_ENVIRONMENTS) {
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
        await changeDefaultOrganization(organizationId);
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
    const isWhitelisted = await SpheronApiService.isWhitelisted();
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
    const isWhitelisted = await SpheronApiService.isWhitelisted();
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
    const isWhitelisted = await SpheronApiService.isWhitelisted();
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
    const isWhitelisted = await SpheronApiService.isWhitelisted();
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
    const isWhitelisted = await SpheronApiService.isWhitelisted();
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
    const isWhitelisted = await SpheronApiService.isWhitelisted();
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
        await changeDefaultOrganization(organizationId);
      } catch (error) {
        console.log(error.message);
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
