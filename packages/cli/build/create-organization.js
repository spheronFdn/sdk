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
exports.createOrganization = void 0;
const axios_1 = __importDefault(require("axios"));
const configuration_1 = __importDefault(require("./configuration"));
const utils_1 = require("./utils");
function createOrganization(name, username, type) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        let executionError = false;
        try {
            if (!(yield (0, utils_1.fileExists)(configuration_1.default.configFilePath))) {
                console.log("Spheron config file does not exist");
                return;
            }
            const jwtToken = yield (0, utils_1.readFromJsonFile)("jwtToken", configuration_1.default.configFilePath);
            if (!jwtToken) {
                console.log("JWT token not valid or does not exist. Pleas login first");
                return;
            }
            console.log(`Creating organization name: ${name}, username: ${username}...`);
            const organizationResponse = yield axios_1.default.post(`${configuration_1.default.spheron_server_address}/v1/organization`, {
                name,
                username,
                appType: type,
            }, {
                headers: {
                    authorization: `Bearer ${jwtToken}`,
                },
            });
            if (organizationResponse.status != 201 ||
                ((_a = organizationResponse.data) === null || _a === void 0 ? void 0 : _a.success) == false) {
                throw new Error("Failed to create an organization");
            }
            console.log("Organization created");
            const organization = organizationResponse.data.organization;
            yield (0, utils_1.writeToConfigFile)("organization", organization._id);
        }
        catch (error) {
            console.log("Error: ", error.message);
            executionError = true;
        }
        finally {
            if (executionError) {
                console.log("There was a problem while creating organization");
            }
            process.exit(0);
        }
    });
}
exports.createOrganization = createOrganization;
