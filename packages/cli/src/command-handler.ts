import { createConfiguration } from "./commands/create-configuration";
import { createOrganization } from "./commands/create-organization";
import { init } from "./commands/init";
import { login } from "./commands/login";
import { logout } from "./commands/logout";
import { publish } from "./commands/publish";
import { upload } from "./commands/upload";
import configuration from "./configuration";
import {
  promptForCreateApp,
  promptForCreateOrganization,
  promptForInit,
  promptForLogin,
  promptForUploadFile,
} from "./prompts/prompts";
import { fileExists, readFromJsonFile } from "./utils";

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

  if (options._[0] === "upload") {
    const validOptions = ["path", "protocol", "project", "organization"];
    const unknownOptions = Object.keys(options).filter(
      (option) =>
        option !== "_" && option !== "$0" && !validOptions.includes(option)
    );
    if (unknownOptions.length > 0) {
      console.log(`Unrecognized options: ${unknownOptions.join(", ")}`);
      process.exit(1);
    }
    (async () => {
      let path, protocol, organizationId, projectName;
      if (options.path && options.protocol) {
        path = options.path;
        protocol = options.protocol.toLowerCase();
        organizationId = options.organization;
        projectName = options.project;
      } else {
        const prompt = await promptForUploadFile();
        path = prompt.path;
        protocol = prompt.protocol.toLowerCase();
        organizationId = prompt.organizationId;
        projectName = prompt.project;
      }
      if (!projectName) {
        const pathSegments = process.cwd().split("/");
        projectName = pathSegments[pathSegments.length - 1];
        console.log(`Generated default project name: ${projectName}`);
      }
      if (!organizationId) {
        organizationId = await readFromJsonFile(
          "organization",
          configuration.configFilePath
        );
      }
      if (!path) {
        path = "./";
      }
      try {
        await upload(path, protocol, organizationId, projectName);
      } catch (error) {
        process.exit(1);
      }
    })();
  }

  if (options._[0] === "publish") {
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

  if (options._[0] === "create-organization") {
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
          await createOrganization(name, username, "app");
        } catch (error) {
          process.exit(1);
        }
      } catch (error) {
        console.log(error.message);
        process.exit(1);
      }
    })();
  }

  if (options._[0] === "init") {
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

  if (options._[0] === "create-dapp") {
    (async () => {
      try {
        if (options._[1]) {
          await promptForCreateApp(options._[1]);
        } else {
          await promptForCreateApp();
        }
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
