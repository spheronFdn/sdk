import path from "path";

import { writeToJsonFile, fileExists, readFromJsonFile } from "../utils";
import configuration from "../configuration";
import { createConfiguration } from "./create-configuration";
import Spinner from "../outputs/spinner";

export async function init(
  name: string,
  protocol: string,
  projectPath: string,
  framework: string,
  silient?: boolean
) {
  const spinner = new Spinner();
  try {
    spinner.spin(`Spheron initialization...`);
    if (await fileExists("./spheron.json")) {
      throw new Error("Spheron file already exists");
    }
    if (
      !(await fileExists(configuration.configFilePath)) ||
      !(await fileExists(configuration.projectTrackingFilePath))
    ) {
      await createConfiguration();
    }
    const pathSegments = process.cwd().split("/");
    const frameworkConfig = mapFrameworkConfig(framework);
    const spheronConfiguration = {
      name: name ? name : pathSegments[pathSegments.length - 1],
      protocol: protocol,
      rootPath: projectPath ? projectPath : "./", // by default it's a relative path from spheron.json point of view
      framework: {
        name: framework,
        configuration: frameworkConfig,
      },
    };
    await writeToJsonFile(
      "configuration",
      spheronConfiguration,
      path.join(process.cwd(), "./spheron.json")
    );
    //link to project tracking file
    const projects = await readFromJsonFile(
      "projects",
      configuration.projectTrackingFilePath
    );
    projects.push({
      name: name ? name : pathSegments[pathSegments.length - 1],
      path: projectPath
        ? path.join(process.cwd(), projectPath)
        : path.join(process.cwd(), "./"),
      protocol: protocol,
      framework: {
        name: framework,
        configuration: frameworkConfig,
      },
    });
    await writeToJsonFile(
      "projects",
      projects,
      configuration.projectTrackingFilePath
    );
    if (!silient) {
      spinner.success("Spheron initialized");
    }
  } catch (error) {
    console.log(`✖️  Error: ${error.message}`);
  } finally {
    spinner.stop();
  }
}

function mapFrameworkConfig(framework: string) {
  switch (framework) {
    case FrameworkOptions.Static:
      return {
        installCommand: "",
        buildCommand: "",
        publishDirectory: "",
      };
    case FrameworkOptions.React:
    case FrameworkOptions.IonicReact:
    case FrameworkOptions.Preact:
    case FrameworkOptions.Docusaurus:
      return {
        installCommand: "yarn install",
        buildCommand: "yarn build",
        publishDirectory: "build",
      };
    case FrameworkOptions.Vue:
    case FrameworkOptions.Sanity:
    case FrameworkOptions.Vite:
    case FrameworkOptions.Scully:
      return {
        installCommand: "yarn install",
        buildCommand: "yarn build",
        publishDirectory: "dist",
      };
    case FrameworkOptions.Angular:
    case FrameworkOptions.IonicAngular:
      return {
        installCommand: "yarn install",
        buildCommand: "yarn build",
        publishDirectory: "dist/app",
      };
    case FrameworkOptions.Next:
      return {
        installCommand: "yarn install",
        buildCommand: "next build && next export",
        publishDirectory: "out",
      };
    case FrameworkOptions.Nuxt2:
      return {
        installCommand: "yarn install",
        buildCommand: "yarn generate",
        publishDirectory: "dist",
      };
    case FrameworkOptions.Hugo:
      return {
        installCommand: "",
        buildCommand: "hugo -D --gc",
        publishDirectory: "public",
      };
    case FrameworkOptions.Eleventy:
      return {
        installCommand: "yarn install",
        buildCommand: "yarn build",
        publishDirectory: "_site",
      };
    case FrameworkOptions.Svelte:
    case FrameworkOptions.Gatsby:
      return {
        installCommand: "yarn install",
        buildCommand: "yarn build",
        publishDirectory: "public",
      };

    case FrameworkOptions.Stencil:
      return {
        installCommand: "yarn install",
        buildCommand: "yarn build",
        publishDirectory: "www",
      };

    case FrameworkOptions.Brunch:
      return {
        installCommand: "yarn install",
        buildCommand: "yarn build",
        publishDirectory: "public",
      };

    default:
      return {
        installCommand: "",
        buildCommand: "",
        publishDirectory: "",
      };
  }
}

export enum FrameworkOptions {
  Static = "static",
  React = "react",
  Vue = "vue",
  Angular = "angular",
  Next = "next",
  Preact = "preact",
  Nuxt2 = "nuxt2",
  Docusaurus = "docusaurus",
  Hugo = "hugo",
  Eleventy = "eleventy",
  Svelte = "svelte",
  Gatsby = "gatsby",
  Sanity = "sanity",
  IonicReact = "ionicreact",
  Vite = "vite",
  Scully = "scully",
  Stencil = "stencil",
  Brunch = "brunch",
  IonicAngular = "ionicangular",
}
