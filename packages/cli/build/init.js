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
exports.init = void 0;
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
const utils_1 = require("./utils");
const configuration_1 = __importDefault(require("./configuration"));
function init(name, protocol, projectPath) {
    return __awaiter(this, void 0, void 0, function* () {
        let executionError = false;
        try {
            if (yield (0, utils_1.fileExists)("./spheron.json")) {
                throw new Error("Spheron file already exists");
            }
            console.log("Spheron initialization...");
            const id = (0, uuid_1.v4)();
            console.log(`${path_1.default.join(process.cwd(), "./spheron.json")}`);
            yield (0, utils_1.writeToJsonFile)("id", id, "./spheron.json");
            const spheron_configuration = {
                name,
                protocol: protocol,
                path: projectPath ? projectPath : path_1.default.join(process.cwd(), "./"),
            };
            yield (0, utils_1.writeToJsonFile)("configuration", spheron_configuration, path_1.default.join(process.cwd(), "./spheron.json"));
            const projects = yield (0, utils_1.readFromJsonFile)("projects", configuration_1.default.projectTrackingFilePath);
            projects.push({
                name,
                path: projectPath ? projectPath : path_1.default.join(process.cwd(), "./"),
            });
            yield (0, utils_1.writeToJsonFile)("projects", projects, configuration_1.default.projectTrackingFilePath);
            console.log("Spheron initialized");
        }
        catch (error) {
            console.log("Error: ", error.message);
            executionError = true;
        }
        finally {
            if (executionError) {
                console.log("Failed to initialize spheron in project");
            }
            process.exit(0);
        }
    });
}
exports.init = init;
