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
exports.writeToJsonFile = exports.readFromJsonFile = exports.fileExists = exports.writeToConfigFile = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const configuration_1 = __importDefault(require("./configuration"));
function writeToConfigFile(key, value) {
    return __awaiter(this, void 0, void 0, function* () {
        let config = {};
        try {
            yield fs_1.default.promises.stat(configuration_1.default.configFilePath);
            const fileContents = yield fs_1.default.promises.readFile(configuration_1.default.configFilePath, "utf-8");
            config = JSON.parse(fileContents);
        }
        catch (err) {
            console.log("Spheron config file not found. Creating a new file.");
            yield fs_1.default.promises.mkdir(path_1.default.join(configuration_1.default.home_path, ".spheron"), {
                recursive: true,
            });
            yield fs_1.default.promises.writeFile(configuration_1.default.configFilePath, "{}", "utf-8");
        }
        config[key] = value;
        const jsonString = JSON.stringify(config, null, 2);
        yield fs_1.default.promises.writeFile(configuration_1.default.configFilePath, jsonString, "utf-8");
    });
}
exports.writeToConfigFile = writeToConfigFile;
function fileExists(path) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield fs_1.default.promises.stat(path);
            return true;
        }
        catch (err) {
            return false;
        }
    });
}
exports.fileExists = fileExists;
function readFromJsonFile(key, path) {
    return __awaiter(this, void 0, void 0, function* () {
        let config = {};
        try {
            const fileContents = yield fs_1.default.promises.readFile(path, "utf-8");
            config = JSON.parse(fileContents);
        }
        catch (err) {
            console.error("Error reading Spheron config file:", err.message);
            return undefined;
        }
        return config[key];
    });
}
exports.readFromJsonFile = readFromJsonFile;
function writeToJsonFile(key, value, path) {
    return __awaiter(this, void 0, void 0, function* () {
        let config = {};
        try {
            yield fs_1.default.promises.stat(path);
            const fileContents = yield fs_1.default.promises.readFile(path, "utf-8");
            config = JSON.parse(fileContents);
        }
        catch (err) {
            yield fs_1.default.promises.writeFile(path, "{}", "utf-8");
        }
        config[key] = value;
        const jsonString = JSON.stringify(config, null, 2);
        yield fs_1.default.promises.writeFile(path, jsonString, "utf-8");
    });
}
exports.writeToJsonFile = writeToJsonFile;
