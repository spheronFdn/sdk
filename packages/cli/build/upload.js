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
exports.uploadFile = exports.uploadDir = void 0;
const fs_1 = __importDefault(require("fs"));
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const configuration_1 = __importDefault(require("./configuration"));
const utils_1 = require("./utils");
function uploadDir(directory, rootPath, protocol, organizationId, projectName) {
    return __awaiter(this, void 0, void 0, function* () {
        const { jwtToken, orgId } = yield checkUploadConstraint(organizationId);
        console.log("Upload in progress...");
        const data = new form_data_1.default();
        fillDirectoryFormData(directory, rootPath, data);
        const response = yield axios_1.default.post(`${configuration_1.default.upload_api_address}/v1/deployment/upload?protocol=${protocol}&organization=${orgId}&project=${projectName}`, data, {
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            },
        });
        if (response.data.success == true) {
            console.log(`Upload was succesfull\nSite preview: ${response.data.sitePreview}\nDomains: ${response.data.affectedDomains}`);
        }
        else {
            console.log("Upload failed");
        }
    });
}
exports.uploadDir = uploadDir;
function uploadFile(rootPath, protocol, organizationId, projectName) {
    return __awaiter(this, void 0, void 0, function* () {
        const { jwtToken, orgId } = yield checkUploadConstraint(organizationId);
        console.log("Upload in progress...");
        const data = new form_data_1.default();
        data.append("files", fs_1.default.createReadStream(rootPath), {
            filepath: rootPath,
        });
        const response = yield axios_1.default.post(`${configuration_1.default.upload_api_address}/v1/deployment/upload?protocol=${protocol}&organization=${orgId}&project=${projectName}`, data, {
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            },
        });
        if (response.data.success == true) {
            console.log(`Upload was succesfull\nSite preview: ${response.data.sitePreview}\nDomains: ${response.data.affectedDomains}`);
        }
        else {
            console.log("Upload failed");
        }
    });
}
exports.uploadFile = uploadFile;
function checkUploadConstraint(organizationId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(yield (0, utils_1.fileExists)(configuration_1.default.configFilePath))) {
            throw new Error("config file not present");
        }
        const jwtToken = yield (0, utils_1.readFromJsonFile)("jwtToken", configuration_1.default.configFilePath);
        if (!jwtToken) {
            throw new Error("JWT token not present. Execute login command");
        }
        let orgId = organizationId;
        if (!orgId) {
            orgId = yield (0, utils_1.readFromJsonFile)("organization", configuration_1.default.configFilePath);
            if (!orgId) {
                throw new Error("Organization is not provided");
            }
        }
        return { jwtToken, orgId };
    });
}
function fillDirectoryFormData(dir, rootPath, formData) {
    const files = fs_1.default.readdirSync(dir);
    for (const file of files) {
        const path = dir + "/" + file;
        const filePath = rootPath + file;
        if (fs_1.default.statSync(path).isDirectory()) {
            fillDirectoryFormData(path, filePath + "/", formData);
        }
        else {
            formData.append("files", fs_1.default.createReadStream(path), {
                filepath: filePath,
            });
        }
    }
}
