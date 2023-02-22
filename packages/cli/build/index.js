#! /usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs = require("yargs");
var randomWords = require("random-words");
const upload_1 = require("./upload");
const login_1 = require("./login");
const create_configuration_1 = require("./create-configuration");
const create_organization_1 = require("./create-organization");
const create_template_1 = require("./create-template");
const init_1 = require("./init");
const configuration_1 = __importDefault(require("./configuration"));
const options = yargs
    .usage("Usage: $0 init, login, create-organization, create-template, upload-dir, upload-file")
    .command("login", "Login to the system", (yargs) => {
    yargs
        .option("github", {
        describe: "Login using Github credentials",
        type: "boolean",
        demandOption: false,
    })
        .option("gitlab", {
        describe: "Login using Gitlab credentials",
        type: "boolean",
        demandOption: false,
    })
        .option("bitbucket", {
        describe: "Login using Bitbucket credentials",
        type: "boolean",
        demandOption: false,
    });
})
    .command("upload-dir", "Upload dir", (yargs) => {
    yargs
        .option("directory", {
        describe: "Directory",
        type: "string",
        demandOption: true,
    })
        .option("path", {
        describe: "Path to directory",
        type: "string",
        demandOption: false,
    })
        .option("protocol", {
        describe: "Upload protocol",
        choices: ["arweave", "ipfs-filecoin", "ipfs"],
        demandOption: true,
    })
        .option("project-name", {
        describe: "Project name",
        type: "string",
        demandOption: false,
    })
        .option("organizationId", {
        describe: "Organization where project will be created",
        type: "string",
        demandOption: false,
    });
})
    .command("upload-file", "Upload file", (yargs) => {
    yargs
        .option("path", {
        describe: "Path to directory",
        type: "string",
        demandOption: true,
    })
        .option("protocol", {
        describe: "Upload protocol",
        choices: ["arweave", "ipfs-filecoin", "ipfs"],
        demandOption: true,
    })
        .option("project-name", {
        describe: "Project name",
        type: "string",
        demandOption: false,
    })
        .option("organizationId", {
        describe: "Organization where project will be created",
        type: "string",
        demandOption: false,
    });
})
    .command("create-configuration", "Create spheron config file")
    .command("create-organization", "Create organization", (yargs) => {
    yargs
        .option("name", {
        describe: "Name of the organization",
        type: "string",
        demandOption: true,
    })
        .option("username", {
        describe: "Username of the organization",
        type: "string",
        demandOption: true,
    });
})
    .command("init", "Spheron file initialization in project", (yargs) => {
    yargs.option("name", {
        describe: "Project name",
        type: "string",
        demandOption: true,
    });
    yargs.option("protocol", {
        describe: "Protocol that will be used for uploading ",
        type: "string",
        demandOption: true,
    });
    yargs.option("path", {
        describe: "Path to uploading content",
        type: "string",
        demandOption: false,
    });
})
    .command("create-template", "Create a template application which runs on Spheron", (yargs) => {
    yargs
        .option("list", {
        describe: "List all possible templates that user can create",
        type: "boolean",
        demandOption: false,
    })
        .option("react-app", {
        describe: "Create a react app template",
        type: "boolean",
        demandOption: false,
    })
        .option("nft-edition-drop-template", {
        describe: "Create a nft edition drop app template",
        type: "boolean",
        demandOption: false,
    })
        .option("next-app", {
        describe: "Create a next app template",
        type: "boolean",
        demandOption: false,
    })
        .option("portfolio-app", {
        describe: "Create a porftoflio app template",
        type: "boolean",
        demandOption: false,
    })
        .option("project-name", {
        describe: "Project name",
        type: "string",
        demandOption: yargs.argv["react-app"] ||
            yargs.argv["nft-edition-drop-template"] ||
            yargs.argv["next-app"] ||
            yargs.argv["portfolio-app"],
    });
}).argv;
if (options._[0] === "login") {
    if (!options.github && !options.gitlab && !options.bitbucket) {
        console.error("Error: you must pass either --github, --gitlab, or --bitbucket when using --login");
        process.exit(1);
    }
    if (options.github) {
        (0, login_1.login)("github");
    }
    else if (options.gitlab) {
        (0, login_1.login)("gitlab");
    }
    else if (options.bitbucket) {
        (0, login_1.login)("bitbucket");
    }
}
if (options._[0] === "upload-dir") {
    try {
        const directory = options["directory"];
        const protocol = options["protocol"];
        let projectName = options["project-name"];
        const organizationId = options["organizationId"];
        if (!projectName) {
            projectName = `${randomWords()}-${randomWords()}`;
        }
        let path = options["path"];
        if (!path) {
            path = "./";
        }
        (0, upload_1.uploadDir)(directory, path, protocol, organizationId, projectName);
    }
    catch (error) {
        console.log(error.message);
    }
}
if (options._[0] === "upload-file") {
    try {
        const protocol = options["protocol"];
        let projectName = options["project-name"];
        const organizationId = options["organizationId"];
        if (!projectName) {
            projectName = `${randomWords()}-${randomWords()}`;
        }
        let path = options["path"];
        (0, upload_1.uploadFile)(path, protocol, organizationId, projectName);
    }
    catch (error) {
        console.log(error.message);
    }
}
if (options._[0] === "create-configuration") {
    (0, create_configuration_1.createConfiguration)();
}
if (options._[0] === "init") {
    const name = options["name"];
    const protocol = options["protocol"];
    const path = options["path"];
    (0, init_1.init)(name, protocol, path);
}
if (options._[0] === "create-organization") {
    const organizationName = options["name"];
    const username = options["username"];
    (0, create_organization_1.createOrganization)(organizationName, username, "app");
}
if (options._[0] === "create-template") {
    if (options.list) {
        (0, create_template_1.listTemplates)();
        process.exit(0);
    }
    else if (options["react-app"]) {
        (0, create_template_1.createTemplate)(configuration_1.default.templateUrls["react-app"], options["project-name"]);
    }
    else if (options["nft-edition-drop-template"]) {
        (0, create_template_1.createTemplate)(configuration_1.default.templateUrls["nft-edition-drop-template"], options["project-name"]);
    }
    else if (options["next-app"]) {
        (0, create_template_1.createTemplate)(configuration_1.default.templateUrls["next-app"], options["project-name"]);
    }
    else if (options["portfolio-app"]) {
        (0, create_template_1.createTemplate)(configuration_1.default.templateUrls["portfolio-app"], options["project-name"]);
    }
}
