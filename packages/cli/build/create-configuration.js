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
exports.createConfiguration = void 0;
const uuid_1 = require("uuid");
const configuration_1 = __importDefault(require("./configuration"));
const utils_1 = require("./utils");
function createConfiguration() {
    return __awaiter(this, void 0, void 0, function* () {
        let executionError = false;
        try {
            if (yield (0, utils_1.fileExists)(configuration_1.default.configFilePath)) {
                console.log("Config file already exists");
                return;
            }
            console.log("Creating spheron configuration file...");
            const id = (0, uuid_1.v4)();
            yield (0, utils_1.writeToConfigFile)("id", id);
            yield (0, utils_1.writeToJsonFile)("projects", [], configuration_1.default.projectTrackingFilePath);
        }
        catch (error) {
            console.log("Error: ", error.message);
            executionError = true;
        }
        finally {
            if (executionError) {
                console.log("There was a problem creating spheron configuration file");
            }
            process.exit(0);
        }
    });
}
exports.createConfiguration = createConfiguration;
