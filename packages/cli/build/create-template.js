"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listTemplates = exports.createTemplate = void 0;
const child_process_1 = __importDefault(require("child_process"));
const path_1 = __importDefault(require("path"));
const configuration_1 = __importDefault(require("./configuration"));
function createTemplate(templateUrl, folderName) {
    return __awaiter(this, void 0, void 0, function* () {
        let executionError = false;
        try {
            yield executeCloneOfRepo(templateUrl, folderName);
        }
        catch (error) {
            console.log("Error: ", error.message);
            executionError = true;
        }
        finally {
            if (executionError) {
                console.log("There was a problem while creating template");
            }
            process.exit(0);
        }
    });
}
exports.createTemplate = createTemplate;
function executeCloneOfRepo(sourceUrl, folderName) {
    return new Promise((resolve) => {
        const child = child_process_1.default.spawn("sh", [path_1.default.join(__dirname, "./scripts/clone.sh")], {
            shell: true,
            env: {
                SOURCE_URL: sourceUrl,
                FOLDER_NAME: folderName,
            },
        });
        let scriptOutput = "";
        let exitCode = 0;
        child.stdout.setEncoding("utf8");
        child.stdout.on("data", (data) => {
            const log = data.toString().trim();
            console.log(log);
            scriptOutput += `${log}\n`;
        });
        child.stderr.setEncoding("utf8");
        child.stderr.on("data", (data) => {
            const log = data.toString().trim();
            console.log(log);
        });
        child.on("error", (err) => {
            exitCode = 1;
            console.log(err);
        });
        child.on("close", () => {
            resolve({ exitCode, scriptOutput });
        });
    });
}
function listTemplates() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Supported templates: \n ------------------ \n 
    [react-app]                 (${configuration_1.default.templateUrls["react-app"]})\n  
    [nft-edition-drop-template] (${configuration_1.default.templateUrls["nft-edition-drop-template"]})\n
    [next-app]                  (${configuration_1.default.templateUrls["next-app"]})\n
    [portfolio-app]             (${configuration_1.default.templateUrls["portfolio-app"]})`);
    });
}
exports.listTemplates = listTemplates;
